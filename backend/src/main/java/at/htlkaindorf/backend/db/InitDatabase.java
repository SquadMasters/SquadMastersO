package at.htlkaindorf.backend.db;

import at.htlkaindorf.backend.json.Json_Access;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.PlayerRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * Component that initializes the database with club and player data
 * from a JSON file when the application starts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InitDatabase {

    private final ClubRepository clubRepository;
    private final PlayerRepository playerRepository;

    /**
     * Imports clubs and players into the database if it's not already populated.
     * This method is called automatically after the bean is created.
     *
     * @throws IOException if the JSON file cannot be read
     */
    @PostConstruct
    public void importData() throws IOException {
        if (clubRepository.count() > 0) {
            log.info("DB already initialized");
            return;
        }

        List<Club> clubs = Json_Access.readJson();
        clubRepository.saveAll(clubs);

        log.info("Clubs imported: " + clubRepository.count());
        log.info("Players imported: " + playerRepository.count());
    }
}
