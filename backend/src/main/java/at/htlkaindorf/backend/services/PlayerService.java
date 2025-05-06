package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.repositories.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerService {

    public final PlayerRepository playerRepository;

    public List<Player> getAllPlayersClubs(Long id) {
        List<Player> players = playerRepository.findPlayersByClub(id);
        logIfEmpty(players, "Keine Spieler vorhanden!");
        return players;
    }

    public List<Player> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        logIfEmpty(players, "Keine Spieler vorhanden!");
        return players;
    }

    private void logIfEmpty(List<?> list, String message) {
        if (list.isEmpty()) {
            log.error(message);
        }
    }
}
