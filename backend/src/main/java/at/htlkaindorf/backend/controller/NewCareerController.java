package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.requests.CareerClubRequest;
import at.htlkaindorf.backend.help.PlayerValueCalc;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

/**
 * Controller to handle creation of new careers.
 */
@RestController
@RequestMapping("/newCareer")
@RequiredArgsConstructor
public class NewCareerController {

    private final CareerService careerService;
    private final ClubService clubsService;
    private final PlayerService playerService;
    private final UserService userService;
    private final GameService gameService;

    /**
     * Creates a new career for the given user and selected club.
     *
     * @param request contains username, career name, and selected club
     * @return true if creation was successful, otherwise error response
     */
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

        Career career = Career.builder()
                .currentCareerDate(LocalDate.of(2025, 6, 1))
                .startUser(user)
                .isRunning(false)
                .careerName(request.getCareername())
                .build();

        user.getCareers().add(career);
        List<TrainerCareer> trainerCareers = new ArrayList<>();
        List<TrainerCareerPlayer> allPlayers = new ArrayList<>();
        Random random = new Random();

        for (Club club : clubsService.getAllClubs()) {
            List<Player> players = playerService.getPlayersFromClub(club.getClub_id());
            int budget = 10_000_000 + random.nextInt(90_000_000);

            TrainerCareer trainerCareer = TrainerCareer.builder()
                    .trainerCareer_pk(new TrainerCareerPK(club.getClub_id(), career.getCareer_id()))
                    .career(career)
                    .budget(budget)
                    .club(club)
                    .wins(0).losses(0).draws(0).goalDiff(0)
                    .leagueTitleCount(0)
                    .readyForSimulation(false)
                    .build();

            if (club.getClubName().equals(request.getClubname())) {
                trainerCareer.setUser(user);
                user.getTrainerCareers().add(trainerCareer);
            }

            List<TrainerCareerPlayer> trainerCareerPlayers = new ArrayList<>();
            for (Player player : players) {
                TrainerCareerPlayer trainerCareerPlayer = TrainerCareerPlayer.builder()
                        .trainerCareerPlayer_pk(new TrainerCareerPlayerPK(trainerCareer.getTrainerCareer_pk(), player.getPlayer_Id()))
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
                player.getTrainerCareerPlayerList().add(trainerCareerPlayer);
            }

            trainerCareers.add(trainerCareer);
            club.setCareerPlayers(trainerCareerPlayers);
            club.getTrainerCareers().add(trainerCareer);
        }

        career.setTrainerCareers(trainerCareers);
        career.setPlayers(allPlayers);

        careerService.careerRepository.save(career);
        gameService.generateTrainerCareerGames(trainerCareers, career.getCareerName());
        careerService.careerRepository.save(career);

        return ResponseEntity.ok(true);
    }
}
