package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.*;
import at.htlkaindorf.backend.requests.CareerClubRequest;
import at.htlkaindorf.backend.services.TrainerCareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing trainer careers.
 */
@RestController
@RequestMapping("/trainerCareer")
@RequiredArgsConstructor
public class TrainerCareerController {

    private final TrainerCareerService trainerCareerService;

    /**
     * Returns all careers associated with a user.
     *
     * @param username the user's name
     * @return list of TrainerCareersDTO
     */
    @GetMapping("/allByUser/{username}")
    public ResponseEntity<List<TrainerCareersDTO>> getAllCareersByUsername(@PathVariable String username) {
        return ResponseEntity.ok(trainerCareerService.getAllTrainerCareersByUser(username));
    }

    /**
     * Returns the league table for a given career.
     *
     * @param careername the name of the career
     * @return list of TableDataDTO
     */
    @GetMapping("/tableDataByCareer/{careername}")
    public ResponseEntity<List<TableDataDTO>> getTableFromCareer(@PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getAllTeamsFromCareer(careername));
    }

    /**
     * Returns all clubs not yet taken in the specified career.
     *
     * @param careername the career name
     * @return list of available club names
     */
    @GetMapping("/toJoin/{careername}")
    public ResponseEntity<List<String>> getCareersToJoin(@PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getAllTrainerCareersToJoin(careername));
    }

    /**
     * Lets a user join a career with a specific club.
     *
     * @param request contains username, career name, and club name
     * @return HTTP 200 on success
     */
    @PatchMapping("/joinTrainerCareer")
    public ResponseEntity<Void> joinCareerWithUser(@RequestBody CareerClubRequest request) {
        trainerCareerService.joinCareerWithUser(request.getUsername(), request.getCareername(), request.getClubname());
        return ResponseEntity.ok().build();
    }

    /**
     * Returns homepage info such as trainer data, titles, and season.
     *
     * @param username    the user's name
     * @param careername  the career name
     * @return HomepageDTO
     */
    @GetMapping("/homepageInfo/{username}/{careername}")
    public ResponseEntity<HomepageDTO> getHomepageInfo(@PathVariable String username, @PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getHomepageInfo(username, careername));
    }

    /**
     * Returns the current budget of a team.
     *
     * @param clubname    the club name
     * @param careername  the career name
     * @return BudgetDTO
     */
    @GetMapping("/budget/{clubname}/{careername}")
    public ResponseEntity<BudgetDTO> getBudgetFromTeam(@PathVariable String clubname, @PathVariable String careername) {
        return ResponseEntity.ok(trainerCareerService.getBudgetFromTeam(clubname, careername));
    }

    /**
     * Updates the budget of a specific club in a career.
     *
     * @param clubname   the club name
     * @param careername the career name
     * @param budget     the new budget value
     * @return HTTP 200 on success
     */
    @PatchMapping("/changebudget/{clubname}/{careername}/{budget}")
    public ResponseEntity<Void> changeBudget(@PathVariable String clubname,
                                             @PathVariable String careername,
                                             @PathVariable Integer budget) {
        trainerCareerService.changeBudget(clubname, careername, budget);
        return ResponseEntity.ok().build();
    }
}
