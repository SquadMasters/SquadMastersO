package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.CareerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    @GetMapping("/toJoin/{username}")
    public ResponseEntity<List<String>> getAllCareersToJoin(@PathVariable String username) {
        return ResponseEntity.ok(careerService.getCareersToJoin(username));
    }

}
