package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.repositories.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<Player> getPlayersFromClub(Long clubId) {
        return playerRepository.findPlayersFromClub(clubId);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }
}
