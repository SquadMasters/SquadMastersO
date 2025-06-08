package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.services.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for game-related operations.
 */
@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    /**
     * Returns the next game for the given user and career.
     *
     * @param username    the user's name
     * @param careername  the career name
     * @return the next game
     */
    @GetMapping("/nextGame/{username}/{careername}")
    public ResponseEntity<NextGameDTO> getNextGame(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        return ResponseEntity.ok(gameService.getNextGame(username, careername));
    }

    /**
     * Returns all upcoming games for the given user and career.
     *
     * @param username    the user's name
     * @param careername  the career name
     * @return list of upcoming games
     */
    @GetMapping("/allNextGames/{username}/{careername}")
    public ResponseEntity<List<NextGameDTO>> getAllNextGames(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        return ResponseEntity.ok(gameService.getAllNextGame(username, careername));
    }
}
