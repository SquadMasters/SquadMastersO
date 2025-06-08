package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;

    public User getUserByUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank.");
        }

        return userRepository.findUserByName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", username));
    }

    public List<String> getAllUsernames() {
        return userRepository.findAllUsernames();
    }
}
