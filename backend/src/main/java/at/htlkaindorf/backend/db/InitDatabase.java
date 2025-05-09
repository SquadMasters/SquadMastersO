package at.htlkaindorf.backend.db;

import at.htlkaindorf.backend.json.Json_Access;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.GameRepository;
import at.htlkaindorf.backend.repositories.PlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerRepository;
import jakarta.annotation.PostConstruct;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
@Builder
public class InitDatabase {

    private final ClubRepository clubRepository;
    private final PlayerRepository playerRepository;
    private final TrainerRepository trainerRepository;

    @PostConstruct
    public void importData() throws IOException {

        if (clubRepository.count() > 0) {
            log.info("DB schon befüllt");
            return;
        }

        List<Club> clubs = Json_Access.readJson();

        clubRepository.saveAll(clubs);

        log.info("Clubs imported: " + clubRepository.count());
        log.info("Players imported: " + playerRepository.count());
        log.info("Trainers imported: " + trainerRepository.count());
    }
}
