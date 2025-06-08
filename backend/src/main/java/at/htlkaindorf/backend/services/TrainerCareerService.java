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

/**
 * Service for managing TrainerCareer operations, including career creation, career updates, and player readiness.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerService {

    private final TrainerCareerRepository trainerCareerRepository;
    private final GameRepository gameRepository;
    private final UserService userService;
    private final TrainerCareersMapper trainerCareersMapper;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final ClubService clubService;

    /**
     * Retrieves all trainer careers associated with a specific user.
     *
     * @param username the username of the user
     * @return a list of TrainerCareersDTO objects
     * @throws ResourceNotFoundException if no careers are found for the user
     */
    public List<TrainerCareersDTO> getAllTrainerCareersByUser(String username) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersByUserName(username);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", username);
        }
        return careers.stream().map(trainerCareersMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Retrieves all teams for a specific career, including win/loss data.
     *
     * @param careername the name of the career
     * @return a list of TableDataDTO objects
     * @throws ResourceNotFoundException if no teams are found for the career
     */
    public List<TableDataDTO> getAllTeamsFromCareer(String careername) {
        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careername);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareers", careername);
        }
        return careers.stream().map(trainerCareersMapper::toTableDTO).toList();
    }

    /**
     * Retrieves a list of careers that can be joined by the user.
     *
     * @param careername the career name to check
     * @return a list of joinable career names
     * @throws ResourceNotFoundException if no joinable careers are found
     */
    public List<String> getAllTrainerCareersToJoin(String careername) {
        List<String> careers = trainerCareerRepository.findTrainerCareersToJoin(careername);
        if (careers.isEmpty()) {
            throw new ResourceNotFoundException("Joinable TrainerCareers", careername);
        }
        return careers;
    }

    /**
     * Allows a user to join a career with a specific club.
     *
     * @param username   the username of the user
     * @param careername the career name the user wants to join
     * @param clubname   the club name the user wants to join
     * @throws ResourceNotFoundException if the user or trainer career is not found
     */
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

    /**
     * Retrieves homepage information for a specific user and career, including club name, season, and league titles.
     *
     * @param username   the username of the user
     * @param careername the career name
     * @return a HomepageDTO object with the homepage data
     * @throws ResourceNotFoundException if the career is not found
     */
    public HomepageDTO getHomepageInfo(String username, String careername) {
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        return trainerCareersMapper.toHomepageDTO(career);
    }

    /**
     * Marks a user as ready for simulation. Checks if there are exactly 11 players in the starting lineup.
     *
     * @param username   the username of the user
     * @param careername the career name
     * @throws ResourceNotFoundException if the career is not found
     * @throws IllegalStateException     if the starting lineup is not full
     */
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

    /**
     * Retrieves a list of users who are not ready for simulation in the career.
     *
     * @param careername the career name
     * @return a list of usernames of not ready users
     */
    public List<String> getNotReadyUsers(String careername) {
        return trainerCareerRepository.findNotReadyUsersFromCareer(careername);
    }

    /**
     * Checks if a user is allowed to simulate the career, based on their readiness and whether they are the starting user.
     *
     * @param username   the username of the user
     * @param careername the career name
     * @return true if the user can simulate, false otherwise
     */
    public boolean isUserAllowedToSimulate(String username, String careername) {
        String startuser = trainerCareerRepository.findStartUsernameFromCareer(username, careername);
        List<String> notReadyUsers = trainerCareerRepository.findNotReadyUsersFromCareer(careername);
        return notReadyUsers.isEmpty() && startuser.equals(username);
    }

    /**
     * Checks if a user is ready for simulation in the career.
     *
     * @param username   the username of the user
     * @param careername the career name
     * @return true if the user is ready, false otherwise
     * @throws ResourceNotFoundException if the career is not found
     */
    public boolean isUserReady(String username, String careername) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByUsernameAndCareername(username, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", username);
        }
        return career.getReadyForSimulation();
    }

    /**
     * Updates the league table based on match results, adjusting win, loss, draw, and goal difference stats.
     *
     * @param careername the career name
     * @param firstHalf  true if updating for the first half of the season, false for the second half
     */
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

    /**
     * Sets all users in the career as not ready for the next simulation.
     *
     * @param careername the career name
     * @throws ResourceNotFoundException if no careers are found for the given career name
     */
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

    /**
     * Resets all trainer careers after a season ends.
     *
     * @param careername the career name
     * @throws ResourceNotFoundException if no trainer careers are found
     */
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

    /**
     * Retrieves the current budget of a team in a career.
     *
     * @param clubname   the club name
     * @param careername the career name
     * @return a BudgetDTO object containing the team's budget
     * @throws ResourceNotFoundException if the trainer career is not found
     */
    public BudgetDTO getBudgetFromTeam(String clubname, String careername) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        return trainerCareersMapper.toBudgetDTO(career);
    }

    /**
     * Updates the budget of a team in a specific career.
     *
     * @param clubname   the club name
     * @param careername the career name
     * @param budget     the new budget to set
     * @throws ResourceNotFoundException if the trainer career is not found
     */
    public void changeBudget(String clubname, String careername, Integer budget) {
        TrainerCareer career = trainerCareerRepository.findTrainerCareerByClubnameAndCareername(clubname, careername);
        if (career == null) {
            throw new ResourceNotFoundException("TrainerCareer", clubname);
        }
        career.setBudget(budget);
        trainerCareerRepository.save(career);
    }
}
