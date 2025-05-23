package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.services.TrainerCareerPlayerService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trainerCareerPlayer")
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerPlayerController {

    private final TrainerCareerPlayerService trainerCareerPlayerService;

    @GetMapping("/allPlayersFromTrainerCareer")
    public ResponseEntity<List<PlayerListDTO>> getAllPlayersByTrainerCareer(
            @RequestParam String username,
            @RequestParam String careername) {

        List<PlayerListDTO> players = trainerCareerPlayerService.getAllPlayersByTrainerCareer(username, careername);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/allPlayersFromCareer")
    public ResponseEntity<List<TrainerCareerPlayerDTO>> getAllPlayersByCareer(@RequestParam String careername) {

        List<TrainerCareerPlayerDTO> players = trainerCareerPlayerService.getAllPlayersByCareer(careername);
        return ResponseEntity.ok(players);
    }


    @PostMapping("/changeStartElevenPlayers")
    public ResponseEntity<String> changeStartElevenPlayers(
            @RequestBody Map<String, List<Long>> requestBody,
            @RequestParam String username,
            @RequestParam String careername) {

        List<Long> ids = requestBody.get("ids");

        if (ids == null || ids.size() != 11) {
            return ResponseEntity.badRequest().body("{\"error\": \"Invalid number of players. Exactly 11 players required.\"}");
        }

        try {
            trainerCareerPlayerService.changeStartEleven(ids, username, careername);
            return ResponseEntity.ok("{\"message\": \"Startelf erfolgreich geändert\"}");
        } catch (Exception e) {
            log.error("Fehler beim Ändern der Startelf: {}", e.getMessage());
            return ResponseEntity.status(500).body("{\"error\": \"Fehler beim Ändern der Startelf: " + e.getMessage() + "\"}");
        }
    }
}
