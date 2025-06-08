package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.ClubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubsService;

    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllClubs() {
        List<String> clubs = clubsService.getAllClubNames();
        return ResponseEntity.ok(clubs);
    }
}
