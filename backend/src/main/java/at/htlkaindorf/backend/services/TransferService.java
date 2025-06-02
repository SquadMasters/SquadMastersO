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

        TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(careername, playerId);
        Club newClub = clubRepository.getClubByName(targetClub);

        if (player == null || newClub == null) {
            return false;
        }

        trainerCareerPlayerRepository.delete(player);

        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(targetClub, careername);
        if (career.getBudget() < player.getValueNow()) {
            return false;
        }

        TrainerCareerPlayerPK pk = player.getTrainerCareerPlayer_pk();
        TrainerCareerPK pkTrainerCareer = pk.getTrainerCareerPK();
        pkTrainerCareer.setClubId(newClub.getClub_id());
        pk.setTrainerCareerPK(pkTrainerCareer);

        player.setClub(newClub);
        player.setMovedRecently(true);
        career.setBudget((int) (career.getBudget()-player.getValueNow()));

        List<SalesInquiryEntry> entries = salesInquiryRepository.findAllSalesInquiryFromPlayer(careername, playerId);

        salesInquiryRepository.deleteAll(entries);

        trainerCareerPlayerRepository.save(player);

        return true;
    }

}
