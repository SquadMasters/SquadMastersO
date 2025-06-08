package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.repositories.ClubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class that handles operations related to clubs, such as retrieving all club names,
 * fetching all clubs, and getting the total count of clubs in the database.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClubService {

    private final ClubRepository clubRepository;

    /**
     * Retrieves a list of all club names from the database.
     *
     * @return a list of club names
     */
    public List<String> getAllClubNames() {
        // Fetch all clubs and extract their names into a list
        return clubRepository.findAll()
                .stream() // Convert the list into a stream
                .map(Club::getClubName) // Map each club to its name
                .collect(Collectors.toList()); // Collect the results into a list
    }

    /**
     * Retrieves a list of all clubs.
     *
     * @return a list of Club objects
     */
    public List<Club> getAllClubs() {
        return clubRepository.findAll(); // Fetch all clubs from the database
    }

    /**
     * Gets the total number of clubs in the database.
     *
     * @return the total number of clubs
     */
    public int getClubCount() {
        return clubRepository.getClubCount(); // Retrieve the total count of clubs
    }
}
