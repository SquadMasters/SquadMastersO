package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.requests.CareerClubRequest;
import at.htlkaindorf.backend.help.PlayerValueCalc;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/newCareer")
@RequiredArgsConstructor
public class NewCareerController {

    private final CareerService careerService;
    private final ClubService clubsService;
    private final PlayerService playerService;
    private final UserService userService;
    private final GameService gameService;

    @PostMapping("/create")
    public ResponseEntity<Boolean> createNewCareer(@RequestBody CareerClubRequest request) {

        if (request.getCareername() == null || request.getCareername().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user;
        try {
            user = userService.getUserByUsername(request.getUsername());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        Random random = new Random();

        Career career = Career.builder().currentCareerDate(LocalDate.of(2025, 6, 1)).startUser(user).isRunning(false).careerName(request.getCareername()).build();
        List<Career> careers = user.getCareers();
        careers.add(career);
        user.setCareers(careers);

        List<TrainerCareer> trainerCareers = new ArrayList<>();
        List<TrainerCareerPlayer> trainerCareerPlayers;
        List<TrainerCareerPlayer> allPlayers = new ArrayList<>();
        List<Player> players;

        List<Club> clubs = clubsService.getAllClubs();
        for (Club club : clubs) {
            players = playerService.getPlayersFromClub(club.getClub_id());
            int budget = 10_000_000 + random.nextInt(90_000_000);

            TrainerCareerPK trainerCareerPK = new TrainerCareerPK(club.getClub_id(), career.getCareer_id());
            TrainerCareer trainerCareer = TrainerCareer.builder()
                    .trainerCareer_pk(trainerCareerPK)
                    .career(career)
                    .budget(budget)
                    .club(club)
                    .wins(0)
                    .losses(0)
                    .draws(0)
                    .goalDiff(0)
                    .leagueTitleCount(0)
                    .readyForSimulation(false)
                    .build();

            if (club.getClubName().equals(request.getClubname())) {
                trainerCareer.setUser(user);
                List<TrainerCareer> careersOfUser = user.getTrainerCareers();
                careersOfUser.add(trainerCareer);
                user.setTrainerCareers(careersOfUser);
            }

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
                        .valueNow(PlayerValueCalc.calculateMarketValue(player.getStartAge(), player.getStartRating()))
                        .ratingNow(player.getStartRating())
                        .club(club)
                        .oldClub("")
                        .build();
                trainerCareerPlayers.add(trainerCareerPlayer);
                allPlayers.add(trainerCareerPlayer);

                List<TrainerCareerPlayer> careerPlayersOfPlayer = player.getTrainerCareerPlayerList();
                careerPlayersOfPlayer.add(trainerCareerPlayer);
                player.setTrainerCareerPlayerList(careerPlayersOfPlayer);
            }
            club.setCareerPlayers(trainerCareerPlayers);
            List<TrainerCareer> careersOfClub = club.getTrainerCareers();
            careersOfClub.add(trainerCareer);
            club.setTrainerCareers(careersOfClub);
        }
        career.setTrainerCareers(trainerCareers);
        career.setPlayers(allPlayers);

        careerService.careerRepository.save(career);
        gameService.generateTrainerCareerGames(trainerCareers, career.getCareerName());
        careerService.careerRepository.save(career);

        return ResponseEntity.ok(true);
    }

}
