package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.services.PlayerService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/createNewCareer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NewCareerController {

    private final TrainerCareerService trainerCareerService;
    private final CareerService careerService;
    private final ClubService clubsService;
    private final PlayerService playerService;

    @PostMapping("/createNewCareer")
    public ResponseEntity<Boolean> createNewCareer(@RequestBody String careerName) {

        Career career = Career.builder().season(2025).careerName(careerName).build();
        List<Club> clubs = clubsService.getAllClubs();
        for (Club club : clubs) {
            List<Player> players = playerService.getAllPlayersClubs(club.getClub_id());


        }

        return ResponseEntity.ok(false);
    }

}
