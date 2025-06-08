package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final ClubRepository clubRepository;

    @Transactional
    public void transferPlayer(String clubname, String careername, Long playerId) {

        if (clubname == null || clubname.isBlank() ||
                careername == null || careername.isBlank() ||
                playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid transfer parameters");
        }

        TrainerCareerPlayer oldPlayer = trainerCareerPlayerRepository
                .findPlayerFromCareerById(playerId, careername);
        if (oldPlayer == null) {
            throw new ResourceNotFoundException("Player in career", "id: " + playerId + ", career: " + careername);
        }

        Club newClub = clubRepository.findClubByName(clubname);
        if (newClub == null) {
            throw new ResourceNotFoundException("Club", clubname);
        }

        TrainerCareer targetCareer = trainerCareerRepository
                .findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (targetCareer == null) {
            throw new ResourceNotFoundException("Target career", "club: " + clubname + ", career: " + careername);
        }

        if (targetCareer.getBudget() < oldPlayer.getValueNow()) {
            throw new IllegalStateException("Target club does not have enough budget");
        }

        TrainerCareer oldCareer = trainerCareerRepository
                .findTrainerCareerByClubnameAndCareername(oldPlayer.getClub().getClubName(), careername);
        if (oldCareer == null) {
            throw new ResourceNotFoundException("Old career", "club: " + oldPlayer.getClub().getClubName() + ", career: " + careername);
        }

        targetCareer.setBudget((int) (targetCareer.getBudget() - oldPlayer.getValueNow()));
        oldCareer.setBudget((int) (oldCareer.getBudget() + oldPlayer.getValueNow()));

        List<SalesInquiryEntry> entries = salesInquiryRepository.findAllSalesInquiryFromPlayer(careername, playerId);
        salesInquiryRepository.deleteAll(entries);

        TrainerCareerPlayer newPlayer = new TrainerCareerPlayer();
        newPlayer.setPlayer(oldPlayer.getPlayer());
        newPlayer.setRatingNow(oldPlayer.getRatingNow());
        newPlayer.setValueNow(oldPlayer.getValueNow());
        newPlayer.setMovedRecently(true);
        newPlayer.setAgeNow(oldPlayer.getAgeNow());
        newPlayer.setOldClub(oldCareer.getClub().getClubName());
        newPlayer.setClub(newClub);
        newPlayer.setTrainerCareerPlayer_pk(new TrainerCareerPlayerPK(
                new TrainerCareerPK(newClub.getClub_id(), oldPlayer.getTrainerCareerPlayer_pk().getTrainerCareerPK().getCareerId()),
                playerId
        ));

        trainerCareerPlayerRepository.delete(oldPlayer);
        trainerCareerPlayerRepository.save(newPlayer);
        trainerCareerRepository.saveAll(List.of(targetCareer, oldCareer));
    }
}
