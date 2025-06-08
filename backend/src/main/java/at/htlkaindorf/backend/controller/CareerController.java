package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling career-related endpoints.
 */
@RestController
@RequestMapping("/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    /**
     * Returns a list of careers the given user can join.
     *
     * @param username the user's name
     * @return list of available careers
     */
    @GetMapping("/toJoin/{username}")
    public ResponseEntity<List<String>> getAllCareersToJoin(@PathVariable String username) {
        return ResponseEntity.ok(careerService.getCareersToJoin(username));
    }
}
