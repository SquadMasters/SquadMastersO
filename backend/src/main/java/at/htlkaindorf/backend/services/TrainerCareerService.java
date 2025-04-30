package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import at.htlkaindorf.backend.repositories.TrainerRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerService {

    public final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareersMapper trainerCareersMapper;

    public List<ShowAllTrainerCareersDTO> getAllTrainerCareersByUser(String userName) {

        List<TrainerCareer> careers = trainerCareerRepository.findAllByUserName(userName);

        if (careers.isEmpty()) {
            log.info("No TrainerCareers found!");
        }

        return careers.stream().map(trainerCareersMapper::toDTO).collect(Collectors.toList());
    }

    public List<TableDataDTO> getAllTeamsFromCareer(String careername) {

        List<TrainerCareer> careers = trainerCareerRepository.findAllByCareer(careername);

        if (careers.isEmpty()) {
            log.info("No TrainerCareers found!");
        }

        return careers.stream().map(trainerCareersMapper::toTableDTO).toList();
    }
}
