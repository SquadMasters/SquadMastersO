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

/**
 * Service for handling player transfers between careers and clubs.
 * It ensures proper validation of transfer parameters and updates career and club data accordingly.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {

    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final SalesInquiryRepository salesInquiryRepository;
    private final ClubRepository clubRepository;

    /**
     * Transfers a player from one career to another, updating the necessary career and club data.
     *
     * @param clubname   the name of the club the player is being transferred to
     * @param careername the career name of the club the player is being transferred to
     * @param playerId   the ID of the player being transferred
     * @throws IllegalArgumentException if the transfer parameters are invalid
     * @throws ResourceNotFoundException if the player, career, or club is not found
     * @throws IllegalStateException     if the target club does not have enough budget
     */
    @Transactional
    public void transferPlayer(String clubname, String careername, Long playerId) {

        // Validate the parameters for the transfer
        if (clubname == null || clubname.isBlank() ||
                careername == null || careername.isBlank() ||
                playerId == null || playerId <= 0) {
            throw new IllegalArgumentException("Invalid transfer parameters");
        }

        // Fetch the player from the old career
        TrainerCareerPlayer oldPlayer = trainerCareerPlayerRepository
                .findPlayerFromCareerById(playerId, careername);
        if (oldPlayer == null) {
            throw new ResourceNotFoundException("Player in career", "id: " + playerId + ", career: " + careername);
        }

        // Fetch the new club to which the player will be transferred
        Club newClub = clubRepository.findClubByName(clubname);
        if (newClub == null) {
            throw new ResourceNotFoundException("Club", clubname);
        }

        // Fetch the target career for the transfer
        TrainerCareer targetCareer = trainerCareerRepository
                .findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (targetCareer == null) {
            throw new ResourceNotFoundException("Target career", "club: " + clubname + ", career: " + careername);
        }

        // Check if the target club has enough budget for the transfer
        if (targetCareer.getBudget() < oldPlayer.getValueNow()) {
            throw new IllegalStateException("Target club does not have enough budget");
        }

        // Fetch the old career to update its budget
        TrainerCareer oldCareer = trainerCareerRepository
                .findTrainerCareerByClubnameAndCareername(oldPlayer.getClub().getClubName(), careername);
        if (oldCareer == null) {
            throw new ResourceNotFoundException("Old career", "club: " + oldPlayer.getClub().getClubName() + ", career: " + careername);
        }

        // Transfer the budget between the clubs
        targetCareer.setBudget((int) (targetCareer.getBudget() - oldPlayer.getValueNow()));
        oldCareer.setBudget((int) (oldCareer.getBudget() + oldPlayer.getValueNow()));

        // Remove any pending sales inquiries for the player
        List<SalesInquiryEntry> entries = salesInquiryRepository.findAllSalesInquiryFromPlayer(careername, playerId);
        salesInquiryRepository.deleteAll(entries);

        // Create a new player entity for the target club with the updated data
        TrainerCareerPlayer newPlayer = new TrainerCareerPlayer();
        newPlayer.setPlayer(oldPlayer.getPlayer());
        newPlayer.setRatingNow(oldPlayer.getRatingNow());
        newPlayer.setValueNow(oldPlayer.getValueNow());
        newPlayer.setMovedRecently(true); // Mark the player as moved
        newPlayer.setAgeNow(oldPlayer.getAgeNow());
        newPlayer.setOldClub(oldCareer.getClub().getClubName());
        newPlayer.setClub(newClub);
        newPlayer.setTrainerCareerPlayer_pk(new TrainerCareerPlayerPK(
                new TrainerCareerPK(newClub.getClub_id(), oldPlayer.getTrainerCareerPlayer_pk().getTrainerCareerPK().getCareerId()),
                playerId
        ));

        // Delete the old player and save the new player
        trainerCareerPlayerRepository.delete(oldPlayer);
        trainerCareerPlayerRepository.save(newPlayer);

        // Save the updated careers for both clubs
        trainerCareerRepository.saveAll(List.of(targetCareer, oldCareer));
    }
}
