package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.UserDTO;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.services.AuthService;
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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {

        if (authService.validateUser(loginRequest.getUsername(), loginRequest.getPassword())) {
            return ResponseEntity.ok(JWTUtils.generateToken(loginRequest.getUsername()));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Login fehlgeschlagen!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> login(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.registerUser(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Register fehlgeschlagen!");
        }
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class LoginRequest {
    private String username;
    private String password;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class RegisterRequest {
    private String username;
    private String password;
}
