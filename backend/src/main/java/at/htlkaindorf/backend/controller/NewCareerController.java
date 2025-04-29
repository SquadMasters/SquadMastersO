package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.services.PlayerService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/newCareer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class NewCareerController {

    private final CareerService careerService;
    private final ClubService clubsService;
    private final PlayerService playerService;

    @PostMapping("/create")
    public ResponseEntity<Boolean> createNewCareer(@RequestBody String careerName) {

        if (careerName == null || careerName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }


        Random random = new Random();

        Career career = Career.builder().season(2025).careerName(careerName).build();
        List<TrainerCareer> trainerCareers = new ArrayList<>();
        List<TrainerCareerPlayer> trainerCareerPlayers;
        List<TrainerCareerPlayer> allPlayers = new ArrayList<>();
        List<Player> players;

        List<Club> clubs = clubsService.getAllClubs();
        for (Club club : clubs) {
            players = playerService.getAllPlayersClubs(club.getClub_id());
            int budget = 10_000_000 + random.nextInt(90_000_000);

            TrainerCareerPK trainerCareerPK = new TrainerCareerPK(club.getClub_id(), career.getCareer_id());
            TrainerCareer trainerCareer = TrainerCareer.builder().trainerCareer_pk(trainerCareerPK).career(career).budget(budget).club(club).build();
            trainerCareers.add(trainerCareer);

            trainerCareerPlayers = new ArrayList<>();
            for (Player player : players) {

                TrainerCareerPlayerPK pk = new TrainerCareerPlayerPK(
                        trainerCareerPK,
                        player.getPlayer_Id()
                );

                TrainerCareerPlayer trainerCareerPlayer = TrainerCareerPlayer.builder()
                        .trainerCareerPlayer_pk(pk)
                        .career(career)
                        .player(player)
                        .ageNow(player.getStartAge())
                        .movedRecently(false)
                        .positionInLineup(PositionInLineup.B)
                        .salesInquiry(false)
                        .club(club)
                        .build();
                trainerCareerPlayers.add(trainerCareerPlayer);
                allPlayers.add(trainerCareerPlayer);

                List<TrainerCareerPlayer> careerPlayersOfPlayer = player.getTrainerCareerPlayerList();
                careerPlayersOfPlayer.add(trainerCareerPlayer);
                player.setTrainerCareerPlayerList(careerPlayersOfPlayer);

                List<TrainerCareer> careersOfPlayer = player.getTrainerCareers();
                careersOfPlayer.add(trainerCareer);
                player.setTrainerCareers(careersOfPlayer);
            }
            club.setCareerPlayers(trainerCareerPlayers);
            List<TrainerCareer> careersOfClub = club.getTrainerCareers();
            careersOfClub.add(trainerCareer);
            club.setTrainerCareers(careersOfClub);
        }
        career.setTrainerCareers(trainerCareers);
        career.setPlayers(allPlayers);

        careerService.careerRepository.save(career);

        log.info("Neue Karriere erstellt!");

        return ResponseEntity.ok(true);
    }

}
