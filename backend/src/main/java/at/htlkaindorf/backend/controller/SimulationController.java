package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NewCareerRequestDTO;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.*;
import at.htlkaindorf.backend.websocket.SimulationUpdate;
import at.htlkaindorf.backend.websocket.SimulationWebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/simulation")
@RequiredArgsConstructor
@Slf4j
public class SimulationController {

    private final CareerService careerService;
    private final GameService gameService;
    private final TrainerCareerService trainerCareerService;
    private final TrainerCareerPlayerService trainerCareerPlayerService;
    private final ClubService clubService;
    private final SimulationWebSocketService websocketService;

    // nicht jeder darf aufrufen
    @PostMapping("/start")
    public ResponseEntity<String> startSimulation(@RequestParam String careername, @RequestParam Boolean firstHalf) {

        Integer countGames = gameService.getNotPlayedGames(careername);
        Integer countClubs = clubService.getClubCount();

        if ((countGames.equals((countClubs - 1) * 2 * countClubs) && !firstHalf) || (countGames.equals((countClubs - 1) * countClubs) && firstHalf) || countGames.equals(0)) {
            return ResponseEntity.ok("Fehler beim Spiele simulieren!");
        }
        if (!trainerCareerService.getNotReadyUsers(careername).isEmpty()) {
            return ResponseEntity.ok("User noch nicht ready!");
        }

        Boolean changeCareer = careerService.changeCareerAfterFirstHalfSimulation(careername, firstHalf);
        Boolean simulateSeason = gameService.simulateSeason(careername, firstHalf);
        Boolean changeTable = trainerCareerService.changeTable(careername, firstHalf);

        if (!changeCareer || !simulateSeason || !changeTable) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim simulieren!");
        }

        trainerCareerService.setUsersNotReady(careername);

        websocketService.sendUpdate(careername, new SimulationUpdate("SIMULATION_STARTED", firstHalf));

        return ResponseEntity.ok("Simulation " + (firstHalf ? "Hinrunde" : "Rückrunde") + " erfolgreich!");
    }

    // Spieler aktualisieren
    @PostMapping("/endSeason")
    public ResponseEntity<String> endSeason(@RequestParam String careername) {

        if (!trainerCareerService.getNotReadyUsers(careername).isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Nicht alle User sind bereit.");
        }

        if (gameService.getNotPlayedGames(careername) > 0) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Es sind noch Spiele offen, die nicht simuliert wurden.");
        }

        boolean resetGames = gameService.resetGamesFromCareer(careername);
        boolean resetCareers = trainerCareerService.resetTrainerCareers(careername);
        boolean changePlayerStats = trainerCareerPlayerService.changePlayerStats(careername);

        if (!resetGames || !resetCareers) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler beim Zurücksetzen der Saison!");
        }

        // WebSocket Update senden
        websocketService.sendUpdate(careername, new SimulationUpdate("SEASON_ENDED", null));

        return ResponseEntity.ok("Season erfolgreich beendet!");
    }

    @PatchMapping("/pressReady")
    public ResponseEntity<String> pressReadyForSimulation(
            @RequestParam String username,
            @RequestParam String careername) {

        Boolean setReady = trainerCareerService.userSetReady(username, careername);

        if (Boolean.FALSE.equals(setReady)) {
            return ResponseEntity.badRequest().body("keine volle Startelf gefunden!");
        }

        // WebSocket Update senden
        websocketService.sendUpdate(careername, new SimulationUpdate("USER_READY", username));

        return ResponseEntity.ok("User ready!");
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

        Boolean isAllowed = trainerCareerService.isUserAllowedToSimulate(username, careername);

        return ResponseEntity.ok(isAllowed);
    }

}
