package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling club-related endpoints.
 */
@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubsService;

    /**
     * Returns a list of all club names.
     *
     * @return list of club names
     */
    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllClubs() {
        List<String> clubs = clubsService.getAllClubNames();
        return ResponseEntity.ok(clubs);
    }
}
