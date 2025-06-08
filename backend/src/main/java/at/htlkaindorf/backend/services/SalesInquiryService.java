package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.SaleOfferDTO;
import at.htlkaindorf.backend.mapper.SalesInquiryMapper;
import at.htlkaindorf.backend.pk.SalesInquiryEntryPK;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.repositories.SalesInquiryRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SalesInquiryService {

    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final SalesInquiryMapper salesInquiryMapper;
    private final TransferService transferService;

    public List<SaleOfferDTO> getAllPlayersByTrainerCareerWithOffer(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<SalesInquiryEntry> inquiries = salesInquiryRepository.findAllPlayersWithOffer(clubName, careerName);
        return inquiries.stream().map(salesInquiryMapper::toSaleOfferDTO).toList();
    }

    public String sendOfferToPlayer(String clubName, String careerName, Long playerId) {
        if (clubName == null || clubName.isBlank() ||
                careerName == null || careerName.isBlank() ||
                playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        TrainerCareer buyerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubName, careerName);
        if (buyerCareer == null) {
            throw new ResourceNotFoundException("TrainerCareer", "club: " + clubName + ", career: " + careerName);
        }

        TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(playerId, careerName);
        if (player == null) {
            throw new ResourceNotFoundException("Player", "id: " + playerId + ", career: " + careerName);
        }

        TrainerCareer sellerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(
                player.getClub().getClubName(), player.getCareer().getCareerName());
        if (sellerCareer == null) {
            throw new ResourceNotFoundException("TrainerCareer", "seller for player: " + playerId);
        }

        if (buyerCareer.getBudget() < player.getValueNow()) {
            throw new IllegalStateException("Not enough budget for player transfer");
        }

        if (sellerCareer.getUser() != null) {
            TrainerCareerPK tcPK = new TrainerCareerPK(buyerCareer.getClub().getClub_id(), buyerCareer.getCareer().getCareer_id());
            TrainerCareerPlayerPK playerPK = new TrainerCareerPlayerPK(tcPK, player.getPlayer().getPlayer_Id());

            SalesInquiryEntry entry = SalesInquiryEntry.builder()
                    .id(new SalesInquiryEntryPK(tcPK, playerPK))
                    .trainerCareer(buyerCareer)
                    .trainerCareerPlayer(player)
                    .build();

            salesInquiryRepository.save(entry);
            return "Offer sent successfully!";
        } else {
            transferService.transferPlayer(clubName, careerName, playerId);
            return "Transfer completed successfully!";
        }
    }

    public void deleteSentOffers(String careerName, Long playerId, String username) {
        if (careerName == null || careerName.isBlank() || playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        List<SalesInquiryEntry> entries = salesInquiryRepository.findSaleInquirySentOffers(careerName, playerId, username);
        salesInquiryRepository.deleteAll(entries);
    }

    public void deleteReceivedOffers(String careerName, Long playerId, String clubName) {
        if (careerName == null || careerName.isBlank() || playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        List<SalesInquiryEntry> entries = salesInquiryRepository.findSaleInquiryReceivedOffers(careerName, playerId, clubName);
        salesInquiryRepository.deleteAll(entries);
    }

    public void transferRandomPlayer(String careerName) {
        if (careerName == null || careerName.isBlank()) {
            throw new IllegalArgumentException("Career name must not be empty");
        }

        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careerName);
        Map<TrainerCareer, List<TrainerCareerPlayer>> playerMap = new HashMap<>();

        for (TrainerCareer career : careers) {
            List<TrainerCareerPlayer> players = trainerCareerPlayerRepository
                    .findPlayersFromTrainerCareer(career.getClub().getClubName(), careerName);
            playerMap.put(career, players);
        }

        careers.sort(Comparator.comparingInt(c -> playerMap.get(c).size()));
        int index = 0;

        for (TrainerCareer career : careers) {
            List<TrainerCareerPlayer> playersOnTransfermarket = trainerCareerPlayerRepository
                    .findPlayersFromCareerForSale(career.getClub().getClubName(), careerName, career.getBudget());

            if (playersOnTransfermarket.size() >= 2) {
                Random random = new Random();
                TrainerCareerPlayer randomPlayer = playersOnTransfermarket.remove(random.nextInt(playersOnTransfermarket.size()));

                if (index < 3) {
                    sendOfferToPlayer(career.getClub().getClubName(), careerName, randomPlayer.getPlayer().getPlayer_Id());

                    playersOnTransfermarket = trainerCareerPlayerRepository
                            .findPlayersFromCareerForSale(career.getClub().getClubName(), careerName, career.getBudget());
                    TrainerCareerPlayer randomPlayer2 = playersOnTransfermarket.get(random.nextInt(playersOnTransfermarket.size()));

                    sendOfferToPlayer(career.getClub().getClubName(), careerName, randomPlayer2.getPlayer().getPlayer_Id());
                } else if (index < 7) {
                    sendOfferToPlayer(career.getClub().getClubName(), careerName, randomPlayer.getPlayer().getPlayer_Id());
                }
            }
            index++;
        }
    }
}
