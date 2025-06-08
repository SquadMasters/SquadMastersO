package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.requests.LoginRequest;
import at.htlkaindorf.backend.services.AuthService;
import at.htlkaindorf.backend.services.UserService;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for authentication and user-related operations.
 * Handles login, registration, and user listing.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    /**
     * Authenticates a user and returns a JWT token if successful.
     *
     * @param request The login credentials (username and password).
     * @return JWT token as a string.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String token = authService.loginUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(token);
    }

    /**
     * Registers a new user account.
     *
     * @param request The registration details (username and password).
     * @return The username of the newly registered user.
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest request) {
        String username = authService.registerUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(username);
    }

    /**
     * Retrieves a list of all registered usernames.
     *
     * @return List of usernames.
     */
    @GetMapping("/allUsernames")
    public ResponseEntity<List<String>> getAllUsernames() {
        List<String> usernames = userService.getAllUsernames();
        return ResponseEntity.ok(usernames);
    }
}
