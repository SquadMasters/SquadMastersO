package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.repositories.CareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareerService {

    public final CareerRepository careerRepository;

    public Boolean createNewCareer(Career career) {

        if (career.getCareerName().isBlank()) {
            log.error("Keine Name vorhanden!");
            return false;
        }

        careerRepository.save(career);

        return true;
    }

    public List<String> getCareersToJoin(String username) {
        return careerRepository.getCareersWithoutUser(username);
    }


    public Boolean changeCareerAfterFirstHalfSimulation(String careername) {

        Career career = careerRepository.findCareerByName(careername);

        if (career == null) {
            log.error("Karriere mit dem Namen {} nicht gefunden!", careername);
            return false;
        }

        career.changeIsRunning();
        career.changeCurrentDate(true);
        careerRepository.save(career);

        return true;
    }

}
