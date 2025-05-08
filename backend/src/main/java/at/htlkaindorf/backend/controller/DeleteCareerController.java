package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.NewCareerRequestDTO;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.*;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.services.PlayerService;
import at.htlkaindorf.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/deleteCareer")
@RequiredArgsConstructor
@Slf4j
public class DeleteCareerController {

    private final CareerService careerService;
    private final ClubService clubsService;
    private final PlayerService playerService;
    private final UserService userService;

    @DeleteMapping("/deleteCareer")
    public ResponseEntity<Boolean> deleteCareer(
            @RequestParam String username,
            @RequestParam String careername
    ) {

        if (username == null || careername == null) {
            return ResponseEntity.badRequest().build();
        }

        //Career career = careerService.

        return ResponseEntity.ok(true);
    }

}
