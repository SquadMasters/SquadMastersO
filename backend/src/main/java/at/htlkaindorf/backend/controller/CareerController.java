package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.services.CareerService;
import at.htlkaindorf.backend.services.ClubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/careers")
@RequiredArgsConstructor
@Slf4j
public class CareerController {

    private final CareerService careerService;

    @GetMapping("/toJoin/{username}")
    public ResponseEntity<List<String>> getAllCareersToJoin(@PathVariable String username) {

        if (!careerService.getCareersToJoin(username).isEmpty()) {
            log.info("No careers to join!");
        }

        return ResponseEntity.ok(careerService.getCareersToJoin(username));
    }

}
