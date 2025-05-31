package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.CareerRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    public final UserRepository userRepository;

    public User getUserByUsername(String username) {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty!");
        }

        List<User> user = userRepository.getUsersByUserName(username);

        if (user.isEmpty()) {
            throw new NoSuchElementException("User not found with username: " + username);
        }

        return user.get(0);
    }

    // In UserService.java
    public List<String> getAllUsernames() {
        return userRepository.findAllUsernames(); // Diese Methode muss im Repository erstellt werden
    }

}
