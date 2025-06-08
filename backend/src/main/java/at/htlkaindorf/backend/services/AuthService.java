package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public String loginUser(String username, String password) {
        return userRepository.findUserByName(username)
                .filter(user -> user.getUserPassword().equals(password))
                .map(user -> JWTUtils.generateToken(username))
                .orElseThrow(() -> new IllegalArgumentException("Login failed: Invalid username or password."));
    }

    public String registerUser(String username, String password) {
        if (userRepository.findUserByName(username).isPresent()) {
            throw new IllegalStateException("Username is already taken");
        }

        User user = User.builder()
                .userName(username)
                .userPassword(password)
                .trainerCareers(new ArrayList<>())
                .build();

        userRepository.save(user);
        return user.getUserName();
    }
}
