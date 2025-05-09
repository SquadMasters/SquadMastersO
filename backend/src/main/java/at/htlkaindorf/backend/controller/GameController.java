package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.services.GameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

    @GetMapping("/nextGame/{username}/{careername}")
    public ResponseEntity<NextGameDTO> getNextGame(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        NextGameDTO dto = gameService.getNextGame(username, careername);

        if (dto == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/allNextGames/{username}/{careername}")
    public ResponseEntity<List<NextGameDTO>> getAllNextGames(
            @PathVariable String username,
            @PathVariable String careername
    ) {
        List<NextGameDTO> dtos = gameService.getAllNextGame(username, careername);

        if (dtos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(dtos);
    }
}
