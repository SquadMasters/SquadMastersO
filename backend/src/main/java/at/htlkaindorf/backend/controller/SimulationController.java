package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NewCareerRequestDTO;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.services.GameService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/simulation")
@RequiredArgsConstructor
@Slf4j
public class SimulationController {

    private final CareerService careerService;
    private final GameService gameService;
    private final TrainerCareerService trainerCareerService;
    private final ClubService clubService;

    // nicht jeder darf aufrufen
    @PostMapping("/start")
    public ResponseEntity<String> startSimulation(@RequestParam String careername, @RequestParam Boolean firstHalf) {

        Integer countGames = gameService.getNotPlayedGames(careername);
        Integer countClubs = clubService.getClubCount();

        if ((countGames.equals((countClubs-1)*2*countClubs) && !firstHalf) || (countGames.equals((countClubs-1)*countClubs) && firstHalf) || countGames.equals(0)) {
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

        return ResponseEntity.ok("Simulation " + (firstHalf ? "Hinrunde" : "Rückrunde") + " erfolgreich!");
    }

    // titel mitzählen
    // Spieler aktualisieren
    @PostMapping("/endSeason")
    public ResponseEntity<String> endSeason(@RequestParam String careername) {

        if (!trainerCareerService.getNotReadyUsers(careername).isEmpty()) {
            return ResponseEntity.ok("User noch nicht ready!");
        }

        boolean resetGames = gameService.resetGamesFromCareer(careername);
        boolean resetCareers = trainerCareerService.resetTrainerCareers(careername);

        if (!resetGames || !resetCareers) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler beim Zurücksetzen der Saison!");
        }

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
