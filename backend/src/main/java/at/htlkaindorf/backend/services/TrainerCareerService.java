package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import at.htlkaindorf.backend.repositories.TrainerRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerService {

    public final TrainerCareerRepository trainerCareerRepository;

    public List<TrainerCareer> getAllTrainerCareersByUser(String userName) {

        List<TrainerCareer> careers = trainerCareerRepository.findAllByUserName(userName);

        if (careers.isEmpty()) {
            log.info("No TrainerCareers found!");
        }

        return careers;
    }
}
