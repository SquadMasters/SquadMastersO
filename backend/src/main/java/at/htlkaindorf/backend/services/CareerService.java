package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.repositories.CareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CareerService {

    public final CareerRepository careerRepository;

    public List<String> getCareersToJoin(String username) {
        return careerRepository.findCareersWithoutUser(username);
    }

    public void changeCareerAfterSimulation(String careername, boolean firstHalf) {

        Career career = careerRepository.findCareerByName(careername);
        if (career == null) {
            throw new ResourceNotFoundException("Career", careername);
        }

        career.changeIsRunning();
        career.changeCurrentDate(firstHalf);
        careerRepository.save(career);
    }
}
