package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.services.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/nextGame/{username}/{careername}")
    public ResponseEntity<NextGameDTO> getNextGame(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        return ResponseEntity.ok(gameService.getNextGame(username, careername));
    }

    @GetMapping("/allNextGames/{username}/{careername}")
    public ResponseEntity<List<NextGameDTO>> getAllNextGames(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        return ResponseEntity.ok(gameService.getAllNextGame(username, careername));
    }
}
