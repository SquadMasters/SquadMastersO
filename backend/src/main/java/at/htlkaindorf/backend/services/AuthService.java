package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import at.htlkaindorf.backend.utils.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Service class for handling authentication related operations, such as logging in and registering users.
 * This service interacts with the {@link UserRepository} to manage user data and generate JWT tokens.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    /**
     * Authenticates a user based on username and password, and generates a JWT token.
     *
     * @param username the username of the user
     * @param password the password of the user
     * @return the generated JWT token
     * @throws IllegalArgumentException if the credentials are invalid
     */
    public String loginUser(String username, String password) {
        // Find the user by username and check if the password matches
        return userRepository.findUserByName(username)
                .filter(user -> user.getUserPassword().equals(password)) // password validation
                .map(user -> JWTUtils.generateToken(username)) // generate token if credentials are valid
                .orElseThrow(() -> new IllegalArgumentException("Login failed: Invalid username or password.")); // throw exception if invalid
    }

    /**
     * Registers a new user by checking if the username is already taken,
     * and then saving the new user to the repository.
     *
     * @param username the username of the user
     * @param password the password of the user
     * @return the registered username
     * @throws IllegalStateException if the username is already taken
     */
    public String registerUser(String username, String password) {
        // Check if the username already exists in the database
        if (userRepository.findUserByName(username).isPresent()) {
            throw new IllegalStateException("Username is already taken"); // if the username is already taken, throw an exception
        }

        // Create and save the new user
        User user = User.builder()
                .userName(username)
                .userPassword(password)
                .trainerCareers(new ArrayList<>()) // Initialize empty trainer careers
                .build();

        userRepository.save(user); // Save the user to the database
        return user.getUserName(); // Return the registered username
    }
}
