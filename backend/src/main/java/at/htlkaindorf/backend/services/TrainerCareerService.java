package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.HomepageDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.Game;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.CareerRepository;
import at.htlkaindorf.backend.repositories.GameRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerService {

    public final TrainerCareerRepository trainerCareerRepository;
    private final GameRepository gameRepository;
    private final UserService userService;
    private final TrainerCareersMapper trainerCareersMapper;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final ClubService clubService;

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

    public Boolean userSetReady(String username, String careername) {

        TrainerCareer career = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        if (!trainerCareerPlayerRepository.findPlayersInStartingEleven(careername, clubname).equals(11)) {
            return false;
        }

        if (career == null) {
            log.info("Keine Karriere gefunden!");
            return false;
        }

        career.changeReady();

        trainerCareerRepository.save(career);

        return true;
    }

    public List<String> getNotReadyUsers(String careername) {
        return trainerCareerRepository.getNotReadyUsersFromCareer(careername);
    }

    public Boolean isUserAllowedToSimulate(String username, String careername) {

        String startuser = trainerCareerRepository.getStartUsername(username, careername);
        List<String> notReadyUsers = trainerCareerRepository.getNotReadyUsersFromCareer(careername);

        if (notReadyUsers.isEmpty() && startuser.equals(username)) {
            return true;
        }
        return false;
    }

    public Boolean isUserReady(String username, String careername) {

        TrainerCareer career = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);

        if (career == null) {
            log.error("Keine Karriere gefunden!");
            return false;
        }

        return career.getReadyForSimulation();
    }

    public Boolean changeTable(String careername, Boolean firstHalf) {

        List<Game> games;
        Integer clubCount = clubService.getClubCount();

        Pageable pageable;
        if (firstHalf) {
            pageable = PageRequest.of(0, clubCount*(clubCount-1));
        } else {
            pageable = PageRequest.of(1, clubCount*(clubCount-1));
        }

        games = gameRepository.getGamesFromCareer(careername, pageable);

        if (games.isEmpty()) {
            log.error("Keine Spiele gefunden für Karriere: {}", careername);
            return false;
        }

        for (Game game : games) {

            TrainerCareer homeTeam = game.getHomeTeam();
            TrainerCareer awayTeam = game.getAwayTeam();
            int homeTeamGoals = game.getHomeGoals();
            int awayTeamGoals = game.getAwayGoals();

            changeTeam(homeTeam, homeTeamGoals, awayTeamGoals);
            changeTeam(awayTeam, awayTeamGoals, homeTeamGoals);

            trainerCareerRepository.save(homeTeam);
            trainerCareerRepository.save(awayTeam);
        }

        return true;
    }

    private void changeTeam(TrainerCareer team, Integer goals, Integer enemyGoals) {

        if (goals > enemyGoals) {
            int wins = team.getWins();
            team.setWins(wins+1);
        } else if (goals.equals(enemyGoals)) {
            int draws = team.getDraws();
            team.setDraws(draws+1);
        } else {
            int losses = team.getLosses();
            team.setLosses(losses+1);
        }
        int goalDiff = team.getGoalDiff();
        team.setGoalDiff(goalDiff + goals - enemyGoals);
    }

    public void setUsersNotReady(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.getTrainerCareersWithUserFromCareer(careername);

        if (careers == null || careers.isEmpty()) {
            return;
        }

        for (TrainerCareer career : careers) {
            career.setReadyForSimulation(false);
        }

        trainerCareerRepository.saveAll(careers);
    }
}
