package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/trainerCareer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainerCareerController {

    private final TrainerCareerService trainerCareerService;
    private final TrainerCareersMapper trainerCareersMapper;

    @GetMapping("/allByUser")
    public ResponseEntity<List<ShowAllTrainerCareersDTO>> getAlleUsersById(@RequestBody String username) {

        List<TrainerCareer> trainerCareers = trainerCareerService.getAllTrainerCareersByUser(username);

        return ResponseEntity.ok(trainerCareers.stream().map(trainerCareersMapper::toDTO).collect(Collectors.toList()));
    }
}
