package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.HomepageDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.CareerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
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
    private final UserService userService;
    private final TrainerCareersMapper trainerCareersMapper;

    public List<ShowAllTrainerCareersDTO> getAllTrainerCareersByUser(String username) {
        List<TrainerCareer> careers = trainerCareerRepository.findAllByUserName(username);
        logIfEmpty(careers, "No TrainerCareers found!");
        return careers.stream().map(trainerCareersMapper::toDTO).collect(Collectors.toList());
    }

    public List<TableDataDTO> getAllTeamsFromCareer(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.findAllByCareer(careername);
        logIfEmpty(careers, "No TrainerCareers found!");
        return careers.stream().map(trainerCareersMapper::toTableDTO).toList();
    }

    public List<String> getAllTrainerCareersToJoin(String careername) {
        List<String> careers = trainerCareerRepository.findTrainerCareersToJoin(careername);
        logIfEmpty(careers, "No TrainerCareers found!");
        return careers;
    }

    public Boolean joinCareerWithUser(String username, String careername, String clubname) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            log.error("Benutzer" + username +  "nicht gefunden!");
            return false;
        }

        TrainerCareer trainerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (trainerCareer == null) {
            log.error("TrainerCareer nicht gefunden");
            return false;
        }


        trainerCareer.setUser(user);
        user.getTrainerCareers().add(trainerCareer);
        trainerCareerRepository.save(trainerCareer);

        return true;
    }

    public HomepageDTO getHomepageInfo(String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);

        if (career == null) {
            log.info("Fehler bei Homepage Info!");
        }

        return trainerCareersMapper.toHomepageDTO(career);
    }


    private void logIfEmpty(List<?> list, String message) {
        if (list.isEmpty()) {
            log.info(message);
        }
    }
}
