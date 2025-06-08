package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.repositories.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling player-related operations.
 * Provides methods to retrieve players based on club or get all players.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerService {

    private final PlayerRepository playerRepository;

    /**
     * Retrieves a list of players for a specific club by the club ID.
     *
     * @param clubId the ID of the club
     * @return a list of players for the given club
     */
    public List<Player> getPlayersFromClub(Long clubId) {
        return playerRepository.findPlayersFromClub(clubId); // Fetch players based on the club ID
    }

    /**
     * Retrieves a list of all players in the system.
     *
     * @return a list of all players
     */
    public List<Player> getAllPlayers() {
        return playerRepository.findAll(); // Fetch all players from the repository
    }
}
