package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.SaleOfferDTO;
import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.mapper.SalesInquiryMapper;
import at.htlkaindorf.backend.pk.SalesInquiryEntryPK;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.SalesInquiryEntry;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
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
public class SalesInquiryService {

    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final SalesInquiryMapper salesInquiryMapper;
    private final TransferService transferService;

    public List<SaleOfferDTO> getAllPlayersByTrainerCareerWithOffer(String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        List<SalesInquiryEntry> inquiries = salesInquiryRepository.findAllPlayersWithOffer(clubname, careername);

        return inquiries.stream()
                .map(salesInquiryMapper::toSaleOfferDTO)
                .toList();
    }

    public String sentOfferToPlayer(String clubname, String careername, Long playerId) {

        if (clubname == null || clubname.trim().isEmpty() || careername == null || careername.trim().isEmpty() || playerId == null || playerId <= 0) {
            return "Übergabewerte fehlerhaft!";
        }

        TrainerCareer tc = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(careername, playerId);
        TrainerCareer targetCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(player.getClub().getClubName(), player.getCareer().getCareerName());

        if (tc == null || targetCareer == null || tc.getBudget() < player.getValueNow()) {
            return "Zu wenig Budget für den Spieler!";
        }

        if (targetCareer.getUser() != null) {
            SalesInquiryEntryPK pk = new SalesInquiryEntryPK();
            TrainerCareerPK tcPK = new TrainerCareerPK(tc.getClub().getClub_id(), tc.getCareer().getCareer_id());
            pk.setTrainerCareerPK(tcPK);
            pk.setTrainerCareerPlayerPK(new TrainerCareerPlayerPK(tcPK, player.getPlayer().getPlayer_Id()));

            SalesInquiryEntry entry = SalesInquiryEntry.builder()
                    .id(pk)
                    .trainerCareer(tc)
                    .trainerCareerPlayer(player)
                    .build();

            salesInquiryRepository.save(entry);
        } else {
            Boolean transfer = transferService.transferPlayer(clubname, careername, playerId);
            if (transfer) {
                return player.getPlayer().getLastname() + " erfolgreich verpflichtet!";
            }
            return "Fehler beim Transfer!";
        }


        return "Angebot erfolgreich gesendet!";
    }

    public Boolean deleteOfferToPlayer(String careername, Long playerId, String username) {

        if (careername == null || careername.trim().isEmpty() || playerId == null || playerId <= 0) {
            return false;
        }

        List<SalesInquiryEntry> entries = salesInquiryRepository.findSaleInquiryFromPlayer(careername, playerId, username);

        salesInquiryRepository.deleteAll(entries);

        return true;
    }

}
