package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TrainerCareerRequest;
import at.htlkaindorf.backend.services.TrainerCareerPlayerService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainerCareerPlayer")
@RequiredArgsConstructor
public class TrainerCareerPlayerController {

    private final TrainerCareerPlayerService trainerCareerPlayerService;

    @GetMapping("/allPlayersFromTrainerCareer")
    public ResponseEntity<List<PlayerListDTO>> getAllPlayersByTrainerCareer(@RequestBody TrainerCareerRequest request) {

        List<PlayerListDTO> players = trainerCareerPlayerService.getAllPlayersByTrainerCareer(request.getUsername(), request.getCareername());

        return ResponseEntity.ok(players);
    }

}
