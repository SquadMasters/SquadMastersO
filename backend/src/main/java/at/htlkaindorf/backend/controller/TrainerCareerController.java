package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.*;
import at.htlkaindorf.backend.requests.CareerClubRequest;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainerCareer")
@RequiredArgsConstructor
public class TrainerCareerController {

    private final TrainerCareerService trainerCareerService;

    @GetMapping("/allByUser/{username}")
    public ResponseEntity<List<TrainerCareersDTO>> getAllCareersByUsername(@PathVariable String username) {
        return ResponseEntity.ok(trainerCareerService.getAllTrainerCareersByUser(username));
    }

    @GetMapping("/tableDataByCareer/{careername}")
    public ResponseEntity<List<TableDataDTO>> getTableFromCareer(@PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getAllTeamsFromCareer(careername));
    }

    @GetMapping("/toJoin/{careername}")
    public ResponseEntity<List<String>> getCareersToJoin(@PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getAllTrainerCareersToJoin(careername));
    }

    @PatchMapping("/joinTrainerCareer")
    public ResponseEntity<Void> joinCareerWithUser(@RequestBody CareerClubRequest request) {
        trainerCareerService.joinCareerWithUser(request.getUsername(), request.getCareername(), request.getClubname());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/homepageInfo/{username}/{careername}")
    public ResponseEntity<HomepageDTO> getHomepageInfo(@PathVariable String username, @PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getHomepageInfo(username, careername));
    }

    @GetMapping("/budget/{clubname}/{careername}")
    public ResponseEntity<BudgetDTO> getBudgetFromTeam(@PathVariable String clubname, @PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getBudgetFromTeam(clubname, careername));
    }

    @PatchMapping("/changebudget/{clubname}/{careername}/{budget}")
    public ResponseEntity<Void> changeBudget(@PathVariable String clubname,
                                             @PathVariable String careername,
                                             @PathVariable Integer budget) {
        trainerCareerService.changeBudget(clubname, careername, budget);
        return ResponseEntity.ok().build();
    }
}
