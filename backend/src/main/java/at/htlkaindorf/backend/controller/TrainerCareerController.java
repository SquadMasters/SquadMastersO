package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.services.AuthService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/trainerCareer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerCareerController {

    private final TrainerCareerService trainerCareerService;

    @GetMapping("/allByUser")
    public ResponseEntity<List<TrainerCareer>> getAlleUsersById(@RequestBody String username) {

        return ResponseEntity.ok(trainerCareerService.getAllTrainerCareersByUser(username));
    }
}
