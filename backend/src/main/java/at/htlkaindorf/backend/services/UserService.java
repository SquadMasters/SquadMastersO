package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling operations related to users.
 * It includes methods for fetching a user by username and retrieving a list of all usernames.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * Retrieves a user based on the provided username.
     *
     * @param username the username of the user to be fetched
     * @return the User object corresponding to the given username
     * @throws IllegalArgumentException if the username is null or blank
     * @throws ResourceNotFoundException if no user is found with the given username
     */
    public User getUserByUsername(String username) {
        // Validate the username to ensure it's not null or blank
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank.");
        }

        // Attempt to fetch the user by username, throw exception if not found
        return userRepository.findUserByName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", username));
    }

    /**
     * Retrieves a list of all usernames from the database.
     *
     * @return a list of all usernames
     */
    public List<String> getAllUsernames() {
        return userRepository.findAllUsernames(); // Fetch all usernames from the repository
    }
}
