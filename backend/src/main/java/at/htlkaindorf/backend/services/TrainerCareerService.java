package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.BudgetDTO;
import at.htlkaindorf.backend.dto.HomepageDTO;
import at.htlkaindorf.backend.dto.TrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.Game;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.GameRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerCareerService {

    public final TrainerCareerRepository trainerCareerRepository;
    private final GameRepository gameRepository;
    private final UserService userService;
    private final TrainerCareersMapper trainerCareersMapper;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final ClubService clubService;

    public List<TrainerCareersDTO> getAllTrainerCareersByUser(String username) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersByUserName(username);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", username);
        }
        return careers.stream().map(trainerCareersMapper::toDTO).collect(Collectors.toList());
    }

    public List<TableDataDTO> getAllTeamsFromCareer(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careername);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", careername);
        }
        return careers.stream().map(trainerCareersMapper::toTableDTO).toList();
    }

    public List<String> getAllTrainerCareersToJoin(String careername) {
        List<String> careers = trainerCareerRepository.findTrainerCareersToJoin(careername);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("Joinable TrainerCareers", careername);
        }
        return careers;
    }

    public void joinCareerWithUser(String username, String careername, String clubname) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new ResourceNotFoundException("User", username);
        }

        TrainerCareer trainerCareer = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (trainerCareer == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }

        trainerCareer.setUser(user);
        user.getTrainerCareers().add(trainerCareer);
        trainerCareerRepository.save(trainerCareer);
    }

    public HomepageDTO getHomepageInfo(String username, String careername) {
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        return trainerCareersMapper.toHomepageDTO(career);
    }

    public void userSetReady(String username, String careername) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        if (!trainerCareerPlayerRepository.findPlayersInStartingEleven(careername, clubname).equals(11)) {
            throw new IllegalStateException("Not enough players in the starting lineup.");
        }
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", username);
        }
        career.changeReady();
        trainerCareerRepository.save(career);
    }

    public List<String> getNotReadyUsers(String careername) {
        return trainerCareerRepository.findNotReadyUsersFromCareer(careername);
    }

    public boolean isUserAllowedToSimulate(String username, String careername) {
        String startuser = trainerCareerRepository.findStartUsernameFromCareer(username, careername);
        List<String> notReadyUsers = trainerCareerRepository.findNotReadyUsersFromCareer(careername);
        return notReadyUsers.isEmpty() && startuser.equals(username);
    }

    public boolean isUserReady(String username, String careername) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", username);
        }
        return career.getReadyForSimulation();
    }

    public void changeTable(String careername, Boolean firstHalf) {
        Integer clubCount = clubService.getClubCount();
        Pageable pageable = PageRequest.of(firstHalf ? 0 : 1, clubCount * (clubCount - 1));
        List<Game> games = gameRepository.findGamesFromCareer(careername, pageable);
        if (games.isEmpty()) {
            throw new ResourceNotFoundException("Games", careername);
        }
        for (Game game : games) {
            changeTeam(game.getHomeTeam(), game.getHomeGoals(), game.getAwayGoals());
            changeTeam(game.getAwayTeam(), game.getAwayGoals(), game.getHomeGoals());
            trainerCareerRepository.save(game.getHomeTeam());
            trainerCareerRepository.save(game.getAwayTeam());
        }
    }

    private void changeTeam(TrainerCareer team, Integer goals, Integer enemyGoals) {
        if (goals > enemyGoals) {
            team.setWins(team.getWins() + 1);
        } else if (goals.equals(enemyGoals)) {
            team.setDraws(team.getDraws() + 1);
        } else {
            team.setLosses(team.getLosses() + 1);
        }
        team.setGoalDiff(team.getGoalDiff() + goals - enemyGoals);
    }

    public void setUsersNotReady(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersWithUserFromCareer(careername);
        if (careers == null || careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", careername);
        }
        for (TrainerCareer career : careers) {
            career.setReadyForSimulation(false);
        }
        trainerCareerRepository.saveAll(careers);
    }

    public void resetTrainerCareers(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careername);
        if (careers == null || careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", careername);
        }
        careers.sort(Comparator
                .comparingInt((TrainerCareer c) -> c.getWins() * 3 + c.getDraws())
                .thenComparingInt(TrainerCareer::getGoalDiff)
                .reversed()
        );
        int budget = 50000000;
        for (TrainerCareer career : careers) {
            career.setBudget(career.getBudget() + budget);
            career.setReadyForSimulation(false);
            career.setWins(0);
            career.setDraws(0);
            career.setLosses(0);
            career.setGoalDiff(0);
            budget -= 5000000;
        }
        TrainerCareer firstPlace = careers.get(0);
        firstPlace.setLeagueTitleCount(firstPlace.getLeagueTitleCount() + 1);
        trainerCareerRepository.saveAll(careers);
    }

    public BudgetDTO getBudgetFromTeam(String clubname, String careername) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        return trainerCareersMapper.toBudgetDTO(career);
    }

    public void changeBudget(String clubname, String careername, Integer budget) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        career.setBudget(budget);
        trainerCareerRepository.save(career);
    }
}
