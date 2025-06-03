package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.mapper.TrainerCareerPlayerMapper;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.SalesInquiryEntry;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.SalesInquiryRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {

    public final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final ClubRepository clubRepository;

    public Boolean transferPlayer(String username, String careername, Long playerId, String targetClub) {
        if (username == null || username.trim().isEmpty() ||
                careername == null || careername.trim().isEmpty() ||
                playerId == null || playerId <= 0 ||
                targetClub == null || targetClub.trim().isEmpty()) {
            return false;
        }

        TrainerCareerPlayer oldPlayer = trainerCareerPlayerRepository.findPlayerFromCareerById(careername, playerId);
        Club newClub = clubRepository.getClubByName(targetClub);
        if (oldPlayer == null || newClub == null) return false;

        TrainerCareer targetCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(targetClub, careername);
        TrainerCareer oldCareer = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);
        if (targetCareer == null || targetCareer.getBudget() < oldPlayer.getValueNow() || oldCareer == null)
            return false;

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
        newPlayer.setClub(newClub);
        newPlayer.setTrainerCareerPlayer_pk(new TrainerCareerPlayerPK(
                new TrainerCareerPK(newClub.getClub_id(), oldPlayer.getTrainerCareerPlayer_pk().getTrainerCareerPK().getCareerId()),
                playerId
        ));


        trainerCareerPlayerRepository.delete(oldPlayer);

        trainerCareerPlayerRepository.save(newPlayer);

        return true;
    }



}
