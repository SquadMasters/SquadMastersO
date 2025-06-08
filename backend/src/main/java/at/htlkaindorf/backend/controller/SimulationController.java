package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.*;
import at.htlkaindorf.backend.websocket.SimulationUpdate;
import at.htlkaindorf.backend.websocket.SimulationWebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final CareerService careerService;
    private final GameService gameService;
    private final TrainerCareerService trainerCareerService;
    private final TrainerCareerPlayerService trainerCareerPlayerService;
    private final ClubService clubService;
    private final SimulationWebSocketService websocketService;
    private final SalesInquiryService salesInquiryService;

    @PostMapping("/start")
    public ResponseEntity<String> startSimulation(@RequestParam String careername, @RequestParam Boolean firstHalf) {

        int countGames = gameService.getNotPlayedGames(careername);
        int countClubs = clubService.getClubCount();

        if ((countGames == (countClubs - 1) * 2 * countClubs && !firstHalf)
                || (countGames == (countClubs - 1) * countClubs && firstHalf)
                || countGames == 0) {
            throw new IllegalStateException("Simulation cannot be started. Invalid game state.");
        }

        if (!trainerCareerService.getNotReadyUsers(careername).isEmpty()) {
            throw new IllegalStateException("Not all users are ready for simulation.");
        }

        careerService.changeCareerAfterSimulation(careername, firstHalf);
        gameService.simulateSeason(careername, firstHalf);
        trainerCareerService.changeTable(careername, firstHalf);
        trainerCareerService.setUsersNotReady(careername);

        websocketService.sendUpdate(careername, new SimulationUpdate("SIMULATION_STARTED", firstHalf));

        return ResponseEntity.ok("Simulation " + (firstHalf ? "first half" : "second half") + " completed successfully!");
    }

    @PostMapping("/endSeason")
    public ResponseEntity<String> endSeason(@RequestParam String careername) {

        if (!trainerCareerService.getNotReadyUsers(careername).isEmpty()) {
            throw new IllegalStateException("Not all users are ready to end the season.");
        }

        if (gameService.getNotPlayedGames(careername) > 0) {
            throw new IllegalStateException("There are still unplayed games.");
        }

        gameService.resetGamesFromCareer(careername);
        trainerCareerService.resetTrainerCareers(careername);
        trainerCareerPlayerService.changePlayerStats(careername);
        salesInquiryService.transferRandomPlayer(careername);

        websocketService.sendUpdate(careername, new SimulationUpdate("SEASON_ENDED", null));

        return ResponseEntity.ok("Season ended successfully!");
    }

    @PatchMapping("/pressReady")
    public ResponseEntity<String> pressReadyForSimulation(
            @RequestParam String username,
            @RequestParam String careername) {

        trainerCareerService.userSetReady(username, careername);
        websocketService.sendUpdate(careername, new SimulationUpdate("USER_READY", username));
        return ResponseEntity.ok("User is now ready.");
    }

    @GetMapping("/isUserReady")
    public ResponseEntity<Boolean> isUserReady(@RequestParam String username, @RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerService.isUserReady(username, careername));
    }

    @GetMapping("/notReadyUsers")
    public ResponseEntity<List<String>> getNotReadyUsers(@RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerService.getNotReadyUsers(careername));
    }

    @GetMapping("/isAllowedToSimulate")
    public ResponseEntity<Boolean> isAllowedToSimulate(
            @RequestParam String username,
            @RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerService.isUserAllowedToSimulate(username, careername));
    }
}
