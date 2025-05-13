package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NewCareerRequestDTO;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final TrainerCareerService trainerCareerService;

    @PostMapping("/startFirstHalfOfTheSeason")
    public ResponseEntity<Boolean> startSimulation(String careername) {

        Boolean changeCareer = careerService.changeCareerAfterFirstHalfSimulation(careername);


        return ResponseEntity.ok(true);
    }

    @PatchMapping("/pressReady")
    public ResponseEntity<Boolean> pressReadyForSimulation(
            @RequestParam String username,
            @RequestParam String careername) {

        Boolean setReady = trainerCareerService.userSetReady(username, careername);

        if (Boolean.FALSE.equals(setReady)) {
            return ResponseEntity.badRequest().body(false);
        }

        return ResponseEntity.ok(true);
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
