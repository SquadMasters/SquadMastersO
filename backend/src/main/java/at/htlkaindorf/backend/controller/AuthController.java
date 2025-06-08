package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.requests.LoginRequest;
import at.htlkaindorf.backend.services.AuthService;
import at.htlkaindorf.backend.services.UserService;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String token = authService.loginUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest request) {
        String username = authService.registerUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(username);
    }

    @GetMapping("/allUsernames")
    public ResponseEntity<List<String>> getAllUsernames() {
        List<String> usernames = userService.getAllUsernames();
        return ResponseEntity.ok(usernames);
    }
}
