package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.services.ClubService;
import at.htlkaindorf.backend.utils.JWTUtils;
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
@CrossOrigin(origins = "*")
@Slf4j
public class ClubController {

    private final ClubService clubsService;

    @GetMapping("/all")
    public ResponseEntity<List<ClubDTO>> getAllClubs() {

        if (!clubsService.getAllClubs().isEmpty()) {
            return ResponseEntity.ok(clubsService.getAllClubsDTO());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No clubs available!");
        }
    }
}
