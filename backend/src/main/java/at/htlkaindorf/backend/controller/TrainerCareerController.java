package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.*;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.services.AuthService;
import at.htlkaindorf.backend.services.TrainerCareerService;
import at.htlkaindorf.backend.services.UserService;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/trainerCareer")
@RequiredArgsConstructor
public class TrainerCareerController {

    private final TrainerCareerService trainerCareerService;
    private final UserService userService;

    @GetMapping("/allByUser/{username}")
    public ResponseEntity<List<ShowAllTrainerCareersDTO>> getAlleUsersById(@PathVariable String username) {

        List<ShowAllTrainerCareersDTO> trainerCareers = trainerCareerService.getAllTrainerCareersByUser(username);

        return ResponseEntity.ok(trainerCareers);
    }

    @GetMapping("/tableDataByCareer/{careername}")
    public ResponseEntity<List<TableDataDTO>> getTableFromCareer(@PathVariable String careername) {

        List<TableDataDTO> trainerCareers = trainerCareerService.getAllTeamsFromCareer(careername);

        return ResponseEntity.ok(trainerCareers);

    }

    @GetMapping("/toJoin/{careername}")
    public ResponseEntity<List<String>> getCareersToJoin(@PathVariable String careername) {

        List<String> trainerCareers = trainerCareerService.getAllTrainerCareersToJoin(careername);

        return ResponseEntity.ok(trainerCareers);
    }

    @PatchMapping("/joinTrainerCareer")
    public ResponseEntity<Boolean> joinCareerWithUser(@RequestBody JoinClubRequest request) {
        boolean result = trainerCareerService.joinCareerWithUser(request.getUsername(), request.getCareername(), request.getClubname());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/homepageInfo")
    public ResponseEntity<HomepageDTO> getCareersToJoin(@RequestBody TrainerCareerRequest request) {

        HomepageDTO homepageDTO = trainerCareerService.getHomepageInfo(request.getUsername(), request.getCareername());

        return ResponseEntity.ok(homepageDTO);

    }
}
