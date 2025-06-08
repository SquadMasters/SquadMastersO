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

/**
 * Service class for handling sales inquiries related to player transfers.
 * It manages sending, receiving, and deleting offers, as well as random player transfers.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SalesInquiryService {

    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final SalesInquiryMapper salesInquiryMapper;
    private final TransferService transferService;

    /**
     * Retrieves all players with offers for a specific trainer career.
     *
     * @param username   the username of the user making the request
     * @param careerName the career name of the trainer
     * @return a list of sale offer DTOs
     */
    public List<SaleOfferDTO> getAllPlayersByTrainerCareerWithOffer(String username, String careerName) {
        // Get the club name for the user's career
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);

        // Get all players with offers for the career and map them to SaleOfferDTO
        List<SalesInquiryEntry> inquiries = salesInquiryRepository.findAllPlayersWithOffer(clubName, careerName);
        return inquiries.stream().map(salesInquiryMapper::toSaleOfferDTO).toList();
    }

    /**
     * Sends an offer to a player for a transfer.
     *
     * @param clubName   the club name of the buyer
     * @param careerName the career name of the buyer
     * @param playerId   the player ID to whom the offer is sent
     * @return a message indicating success or failure
     * @throws IllegalArgumentException if the parameters are invalid
     * @throws ResourceNotFoundException if the trainer career or player is not found
     */
    public String sendOfferToPlayer(String clubName, String careerName, Long playerId) {
        // Validate the request parameters
        if (clubName == null || clubName.isBlank() ||
                careerName == null || careerName.isBlank() ||
                playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        // Fetch the buyer's career
        TrainerCareer buyerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubName, careerName);
        if (buyerCareer == null) {
            throw new ResourceNotFoundException("TrainerCareer", "club: " + clubName + ", career: " + careerName);
        }

        // Fetch the player to whom the offer will be sent
        TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(playerId, careerName);
        if (player == null) {
            throw new ResourceNotFoundException("Player", "id: " + playerId + ", career: " + careerName);
        }

        // Fetch the seller's career based on the player's current club
        TrainerCareer sellerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(
                player.getClub().getClubName(), player.getCareer().getCareerName());
        if (sellerCareer == null) {
            throw new ResourceNotFoundException("TrainerCareer", "seller for player: " + playerId);
        }

        // Check if the buyer has enough budget to afford the player
        if (buyerCareer.getBudget() < player.getValueNow()) {
            throw new IllegalStateException("Not enough budget for player transfer");
        }

        // Check if the seller has a user; if so, create an offer, otherwise, transfer the player directly
        if (sellerCareer.getUser() != null) {
            TrainerCareerPK tcPK = new TrainerCareerPK(buyerCareer.getClub().getClub_id(), buyerCareer.getCareer().getCareer_id());
            TrainerCareerPlayerPK playerPK = new TrainerCareerPlayerPK(tcPK, player.getPlayer().getPlayer_Id());

            // Create and save the sales inquiry entry
            SalesInquiryEntry entry = SalesInquiryEntry.builder()
                    .id(new SalesInquiryEntryPK(tcPK, playerPK))
                    .trainerCareer(buyerCareer)
                    .trainerCareerPlayer(player)
                    .build();

            salesInquiryRepository.save(entry); // Save the sales inquiry entry
            return "Offer sent successfully!";
        } else {
            // If the seller does not have a user, transfer the player directly
            transferService.transferPlayer(clubName, careerName, playerId);
            return "Transfer completed successfully!";
        }
    }

    /**
     * Deletes all sent offers for a player in a specific career.
     *
     * @param careerName the career name
     * @param playerId   the player ID
     * @param username   the username of the person deleting the offers
     */
    public void deleteSentOffers(String careerName, Long playerId, String username) {
        // Validate the request parameters
        if (careerName == null || careerName.isBlank() || playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        // Find and delete the sent offers for the player
        List<SalesInquiryEntry> entries = salesInquiryRepository.findSaleInquirySentOffers(careerName, playerId, username);
        salesInquiryRepository.deleteAll(entries); // Delete all entries for the player
    }

    /**
     * Deletes all received offers for a player in a specific career.
     *
     * @param careerName the career name
     * @param playerId   the player ID
     * @param clubName   the club name of the receiver
     */
    public void deleteReceivedOffers(String careerName, Long playerId, String clubName) {
        // Validate the request parameters
        if (careerName == null || careerName.isBlank() || playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid request parameters");
        }

        // Find and delete the received offers for the player
        List<SalesInquiryEntry> entries = salesInquiryRepository.findSaleInquiryReceivedOffers(careerName, playerId, clubName);
        salesInquiryRepository.deleteAll(entries); // Delete all received offers
    }

    /**
     * Transfers a random player between careers.
     *
     * @param careerName the career name for which to transfer the player
     */
    public void transferRandomPlayer(String careerName) {
        // Validate the career name
        if (careerName == null || careerName.isBlank()) {
            throw new IllegalArgumentException("Career name must not be empty");
        }

        // Fetch all the careers related to the specified career name
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careerName);
        Map<TrainerCareer, List<TrainerCareerPlayer>> playerMap = new HashMap<>();

        // Populate a map of career and players
        for (TrainerCareer career : careers) {
            List<TrainerCareerPlayer> players = trainerCareerPlayerRepository
                    .findPlayersFromTrainerCareer(career.getClub().getClubName(), careerName);
            playerMap.put(career, players);
        }

        // Sort the careers by the number of players
        careers.sort(Comparator.comparingInt(c -> playerMap.get(c).size()));
        int index = 0;

        // Transfer players randomly
        for (TrainerCareer career : careers) {
            List<TrainerCareerPlayer> playersOnTransfermarket = trainerCareerPlayerRepository
                    .findPlayersFromCareerForSale(career.getClub().getClubName(), careerName, career.getBudget());

            // Ensure there are enough players on the transfer market
            if (playersOnTransfermarket.size() >= 2) {
                Random random = new Random();
                TrainerCareerPlayer randomPlayer = playersOnTransfermarket.remove(random.nextInt(playersOnTransfermarket.size()));

                // Send offers to transfer players based on the index
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
