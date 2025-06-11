package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.repositories.CareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class that manages career-related operations, including retrieving available careers to join
 * and updating the career status after a simulation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CareerService {

    public final CareerRepository careerRepository;

    /**
     * Retrieves a list of careers that a user is not yet part of.
     *
     * @param username the username of the user
     * @return a list of career names that the user is not part of
     */
    public List<String> getCareersToJoin(String username) {
        // Get careers where the user is not part of
        return careerRepository.findCareersWithoutUser(username);
    }

    /**
     * Updates the career status and the current date after a simulation is completed.
     *
     * @param careername the name of the career to be updated
     * @param firstHalf  whether it's the first half of the season
     * @throws ResourceNotFoundException if the career is not found
     */
    public void changeCareerAfterSimulation(String careername, boolean firstHalf) {
        // Retrieve the career from the database by career name
        Career career = careerRepository.findCareerByName(careername);

        // If the career is not found, throw a ResourceNotFoundException
        if (career == null) {
            throw new ResourceNotFoundException("Career", careername); // Resource not found exception
        }

        // Change the running status of the career and adjust the date based on the simulation phase
        career.changeIsRunning();
        career.changeCurrentDate(firstHalf);

        // Save the updated career
        careerRepository.save(career);
    }
}
