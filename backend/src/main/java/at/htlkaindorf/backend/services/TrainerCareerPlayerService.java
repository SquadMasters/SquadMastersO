package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.dto.TransferPlayerDTO;
import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.help.PlayerValueCalc;
import at.htlkaindorf.backend.mapper.TrainerCareerPlayerMapper;
import at.htlkaindorf.backend.pojos.PositionInLineup;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.*;

/**
 * Service class for handling TrainerCareerPlayer related operations.
 * It includes methods for managing player data, handling transfers, and updating player stats.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerPlayerService {

    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerMapper trainerCareerPlayerMapper;

    /**
     * Retrieves all players by trainer career.
     *
     * @param username   the username of the user
     * @param careerName the name of the career
     * @return a list of TrainerCareerPlayerDTOs
     */
    public List<TrainerCareerPlayerDTO> getAllPlayersByTrainerCareer(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromTrainerCareer(clubName, careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList(); // Map to DTO
    }

    /**
     * Retrieves all players available for the transfer market in a specific career.
     *
     * @param username   the username of the user
     * @param careerName the name of the career
     * @return a list of TrainerCareerPlayerDTOs
     */
    public List<TrainerCareerPlayerDTO> getAllPlayersForTransferMarketByCareer(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> allPlayers = trainerCareerPlayerRepository.findPlayersFromCareerForSale(clubName, careerName, Integer.MAX_VALUE);
        List<TrainerCareerPlayer> filteredPlayers = new ArrayList<>();

        // Filtering players based on position and team composition
        for (TrainerCareerPlayer player : allPlayers) {
            String position = player.getPlayer().getPosition();
            String playerClub = player.getClub().getClubName();
            List<String> group;
            int minCount;

            // Set position groups and minimum player counts
            if (position.equals("TW")) {
                group = List.of("TW");
                minCount = 2;
            } else if (List.of("IV", "LV", "RV").contains(position)) {
                group = List.of("IV", "LV", "RV");
                minCount = 5;
            } else if (List.of("ZDM", "ZM").contains(position)) {
                group = List.of("ZDM", "ZM");
                minCount = 4;
            } else {
                group = List.of("ST", "RF", "LF");
                minCount = 4;
            }

            // Check the count of players in the specified position group
            int count = trainerCareerPlayerRepository.getPlayersFromTrainerCareerOnPositionsCount(careerName, playerClub, group);
            if (count >= minCount) {
                filteredPlayers.add(player);
            }
        }

        return filteredPlayers.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList(); // Map to DTO
    }

    /**
     * Retrieves all players by career name.
     *
     * @param careerName the name of the career
     * @return a list of TrainerCareerPlayerDTOs
     */
    public List<TrainerCareerPlayerDTO> getAllPlayersByCareer(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareer(careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList(); // Map to DTO
    }

    /**
     * Retrieves all players from a career with transfer information.
     *
     * @param careerName the name of the career
     * @return a list of TransferPlayerDTOs
     */
    public List<TransferPlayerDTO> getAllPlayersByCareerWithTransfer(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareerWithTransfer(careerName);
        return players.stream().map(trainerCareerPlayerMapper::toTransferPlayerDTO).toList(); // Map to DTO
    }

    /**
     * Changes the starting eleven players in a career based on the provided player IDs.
     *
     * @param ids        the list of player IDs to be set in the starting eleven
     * @param username   the username of the user
     * @param careerName the name of the career
     */
    public void changeStartEleven(List<Long> ids, String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromTrainerCareer(clubName, careerName);

        // Reset all players' positions to Bench (B)
        players.forEach(player -> player.setPositionInLineup(PositionInLineup.B));

        PositionInLineup[] positions = PositionInLineup.values();
        for (int i = 0; i < ids.size() && i < positions.length; i++) {
            TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(ids.get(i), careerName);
            if (player == null) {
                throw new ResourceNotFoundException("Player", "id: " + ids.get(i)); // Player not found
            }
            player.setPositionInLineup(positions[i]); // Assign player to the specified position
        }

        trainerCareerPlayerRepository.saveAll(players); // Save the updated positions
    }

    /**
     * Updates the stats of all players in a career.
     *
     * @param careerName the name of the career
     */
    public void changePlayerStats(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareer(careerName);
        if (players.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareerPlayers", "in career: " + careerName); // No players found
        }

        Random random = new Random();

        // Update player stats based on age, rating, and potential
        for (TrainerCareerPlayer player : players) {
            player.setAgeNow(player.getAgeNow() + 1); // Increase age
            player.setMovedRecently(false); // Reset "moved recently" flag

            int age = player.getAgeNow();
            int rating = player.getRatingNow();
            int potential = player.getPlayer().getPotential();
            int chance = getChanceIndex(age, random);
            boolean doubleChange = random.nextInt(6) == 0;

            // Update player rating based on age and potential
            if (age < 32 && rating < potential && rating < 10) {
                if (chance == 0) {
                    player.setRatingNow(rating + (doubleChange && rating < 9 ? 2 : 1));
                }
            } else if (age > 31 && rating > 1) {
                if (chance == 0) {
                    player.setRatingNow(rating - (doubleChange && rating > 2 ? 2 : 1));
                }
            }

            // Calculate new market value
            player.setValueNow(PlayerValueCalc.calculateMarketValue(player.getAgeNow(), player.getRatingNow()));
        }

        trainerCareerPlayerRepository.saveAll(players); // Save the updated players
    }

    /**
     * Gets the chance index for player stat changes based on their age.
     *
     * @param age    the age of the player
     * @param random a Random instance for generating random numbers
     * @return the chance index for stat changes
     */
    private int getChanceIndex(int age, Random random) {
        if (age < 23) return random.nextInt(4);
        if (age < 28) return random.nextInt(6);
        if (age < 32) return random.nextInt(10);
        if (age < 36) return random.nextInt(3);
        return random.nextInt(2);
    }

    /**
     * Retrieves all players on the wishlist for a specific trainer career.
     *
     * @param username   the username of the user
     * @param careerName the career name of the trainer
     * @return a list of TrainerCareerPlayerDTOs
     */
    public List<TrainerCareerPlayerDTO> getAllPlayersByTrainerCareerOnWishlist(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersOnWishlist(clubName, careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList(); // Map to DTO
    }

    /**
     * Updates the attributes of a player in the specified career.
     *
     * @param careername the career name
     * @param playerId   the player ID
     * @param updates    the map containing the attributes to be updated
     */
    @Transactional
    public void updateAttributes(String careername, Long playerId, Map<String, Object> updates) {
        // Find the player by career name and player ID
        TrainerCareerPlayer player = trainerCareerPlayerRepository
                .findByCareernameAndPlayerId(careername, playerId)
                .orElseThrow(() -> new RuntimeException("Spieler nicht gefunden")); // Player not found

        // Update the player's attributes based on the provided map
        if (updates.containsKey("ratingNow")) {
            player.setRatingNow(Integer.parseInt(updates.get("ratingNow").toString()));
        }
        if (updates.containsKey("valueNow")) {
            player.setValueNow(Double.parseDouble(updates.get("valueNow").toString()));
        }

        trainerCareerPlayerRepository.save(player); // Save the updated player
    }
}
