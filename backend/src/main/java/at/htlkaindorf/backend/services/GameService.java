package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.mapper.GameMapper;
import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.Game;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.repositories.CareerRepository;
import at.htlkaindorf.backend.repositories.GameRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Service class for handling game-related operations such as generating games, simulating matches, and retrieving next games.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameRepository gameRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final CareerRepository careerRepository;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final GameMapper gameMapper;
    private final ClubService clubService;

    /**
     * Generates the games for all the teams in a given career.
     *
     * @param trainerCareers the list of trainer careers
     * @param careerName     the name of the career
     */
    public void generateTrainerCareerGames(List<TrainerCareer> trainerCareers, String careerName) {
        List<Game> games = new ArrayList<>();
        int year = careerRepository.findCareerByName(careerName).getCurrentCareerDate().getYear();
        Random random = new Random();
        Set<LocalDate> generatedDates = new HashSet<>();

        trainerCareers.forEach(tc -> {
            tc.setHomeGames(new ArrayList<>());
            tc.setAwayGames(new ArrayList<>());
        });

        // Create games for all teams
        for (int i = 0; i < trainerCareers.size() - 1; i++) {
            for (int j = i + 1; j < trainerCareers.size(); j++) {
                TrainerCareer teamA = trainerCareers.get(i);
                TrainerCareer teamB = trainerCareers.get(j);

                // Generate home and away games
                games.add(createGame(
                        teamA,
                        teamB,
                        getRandomDate(year, 7, 1, year, 12, 31, random, generatedDates)));
                games.add(createGame(
                        teamB,
                        teamA,
                        getRandomDate(year, 7, 1, year, 12, 31, random, generatedDates)));

                games.add(createGame(
                        teamA,
                        teamB,
                        getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random, generatedDates)));
                games.add(createGame(
                        teamB,
                        teamA,
                        getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random, generatedDates)));
            }
        }

        // Assign games to the home teams
        games.forEach(game -> game.getHomeTeam().addHomeGame(game));
    }

    /**
     * Creates a game between two teams.
     *
     * @param home      the home team
     * @param away      the away team
     * @param matchDate the date of the match
     * @return the created game
     */
    private Game createGame(TrainerCareer home, TrainerCareer away, LocalDate matchDate) {
        return Game.builder()
                .homeTeam(home)
                .awayTeam(away)
                .matchDate(matchDate)
                .homeGoals(null)
                .awayGoals(null)
                .build();
    }

    /**
     * Generates a random date within a specified range, ensuring no duplicate dates.
     *
     * @param yearStart      the start year of the range
     * @param monthStart     the start month of the range
     * @param dayStart       the start day of the range
     * @param yearEnd        the end year of the range
     * @param monthEnd       the end month of the range
     * @param dayEnd         the end day of the range
     * @param random         the random generator used to create the date
     * @param generatedDates the set of already generated dates to avoid duplicates
     * @return a random date within the range
     */
    private LocalDate getRandomDate(int yearStart, int monthStart, int dayStart,
                                    int yearEnd, int monthEnd, int dayEnd, Random random,
                                    Set<LocalDate> generatedDates) {
        LocalDate start = LocalDate.of(yearStart, monthStart, dayStart);
        LocalDate end = LocalDate.of(yearEnd, monthEnd, dayEnd);
        long days = ChronoUnit.DAYS.between(start, end);

        LocalDate randomDate;
        do {
            randomDate = start.plusDays(random.nextInt((int) days + 1));
        } while (generatedDates.contains(randomDate));

        generatedDates.add(randomDate);
        return randomDate;
    }

    /**
     * Retrieves the next game for a user based on their username and career name.
     *
     * @param username  the username of the user
     * @param careerName the career name
     * @return the next game as a DTO
     * @throws ResourceNotFoundException if the next game is not found
     */
    public NextGameDTO getNextGame(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        if (clubName == null) {
            throw new ResourceNotFoundException("TrainerCareer", "user: " + username + ", career: " + careerName);
        }

        Career career = careerRepository.findCareerByName(careerName);
        if (career == null) {
            throw new ResourceNotFoundException("Career", careerName);
        }

        Game game = gameRepository.findNextGameFromTrainerCareer(clubName, careerName, career.getCurrentCareerDate());
        if (game == null) {
            throw new ResourceNotFoundException("Game", "next game for " + clubName + " in " + careerName);
        }

        return gameMapper.toNextGameDTO(game);
    }

    /**
     * Retrieves all upcoming games for a user based on their username and career name.
     *
     * @param username  the username of the user
     * @param careerName the career name
     * @return a list of upcoming games as DTOs
     */
    public List<NextGameDTO> getAllNextGame(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        if (clubName == null) {
            throw new ResourceNotFoundException("TrainerCareer", "user: " + username + ", career: " + careerName);
        }

        List<Game> games = gameRepository.findGamesFromTrainerCareer(clubName, careerName);
        return games.stream().map(gameMapper::toNextGameDTO).toList();
    }

    /**
     * Simulates a season by simulating games for each club based on the career name.
     *
     * @param careerName the career name
     * @param firstHalf  indicates whether it's the first half of the season
     * @throws ResourceNotFoundException if no games are found for the season
     */
    public void simulateSeason(String careerName, boolean firstHalf) {
        int clubCount = clubService.getClubCount();
        Pageable pageable = PageRequest.of(firstHalf ? 0 : 1, clubCount * (clubCount - 1));
        List<Game> games = gameRepository.findGamesFromCareer(careerName, pageable);

        if (games.isEmpty()) {
            throw new ResourceNotFoundException("Games", "for career: " + careerName);
        }

        simulateGames(games);
    }

    /**
     * Simulates the results of a list of games based on player ratings.
     *
     * @param games the list of games to simulate
     */
    private void simulateGames(List<Game> games) {
        for (Game game : games) {
            long careerIdHome = game.getHomeTeam().getCareer().getCareer_id();
            long clubIdHome = game.getHomeTeam().getClub().getClub_id();
            long careerIdAway = game.getAwayTeam().getCareer().getCareer_id();
            long clubIdAway = game.getAwayTeam().getClub().getClub_id();

            double ratingHome = trainerCareerPlayerRepository.findAvgRatingFromTrainerCareer(careerIdHome, clubIdHome);
            double ratingAway = trainerCareerPlayerRepository.findAvgRatingFromTrainerCareer(careerIdAway, clubIdAway);

            ratingHome = ratingHome == 0 ? getFallbackRating(careerIdHome, clubIdHome) : ratingHome;
            ratingAway = ratingAway == 0 ? getFallbackRating(careerIdAway, clubIdAway) : ratingAway;

            simulateMatch(game, ratingHome, ratingAway);
            gameRepository.save(game);
        }
    }

    /**
     * Fallback method to get an average rating for a team if no player ratings are available.
     *
     * @param careerId the career ID of the team
     * @param clubId   the club ID of the team
     * @return the average rating for the team
     */
    private double getFallbackRating(Long careerId, Long clubId) {
        double gk = getAverageRating(careerId, clubId, new String[]{"TW"}, 1);
        double def = getAverageRating(careerId, clubId, new String[]{"LV", "RV", "IV"}, 4);
        double mid = getAverageRating(careerId, clubId, new String[]{"ZDM", "ZM"}, 3);
        double atk = getAverageRating(careerId, clubId, new String[]{"LF", "RF", "ST"}, 3);
        return (gk + def + mid + atk) / 4.0;
    }

    /**
     * Calculates the average rating for a given role in a team.
     *
     * @param careerId the career ID of the team
     * @param clubId   the club ID of the team
     * @param roles    the roles to include in the calculation
     * @param limit    the number of players to consider for the role
     * @return the average rating for the specified role
     */
    private double getAverageRating(Long careerId, Long clubId, String[] roles, int limit) {
        List<Double> ratings = trainerCareerPlayerRepository.getTopRatingsFromTrainerCareer(
                careerId, clubId, new ArrayList<>(Arrays.asList(roles)), PageRequest.of(0, limit)
        );
        return ratings.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    /**
     * Simulates the match result based on the ratings of the two teams.
     *
     * @param game         the game to simulate
     * @param homeRating   the rating of the home team
     * @param awayRating   the rating of the away team
     */
    private void simulateMatch(Game game, double homeRating, double awayRating) {
        double diff = Math.abs(homeRating - awayRating);
        boolean homeBetter = homeRating >= awayRating;
        Random random = new Random();

        int max = switch ((int) (diff * 10)) {
            case 0, 1 -> 2;
            case 2 -> 3;
            case 3 -> 4;
            case 4, 5, 6 -> 5;
            case 7, 8, 9 -> 6;
            default -> 6;
        };

        game.setHomeGoals(random.nextInt(homeBetter ? max + 1 : 3));
        game.setAwayGoals(random.nextInt(!homeBetter ? max + 1 : 3));
    }

    /**
     * Retrieves the count of unplayed games for a given career.
     *
     * @param careerName the career name
     * @return the count of unplayed games
     */
    public int getNotPlayedGames(String careerName) {
        return gameRepository.getNotPlayedGamesCount(careerName);
    }

    /**
     * Resets the games for a given career and generates new ones.
     *
     * @param careerName the career name
     */
    public void resetGamesFromCareer(String careerName) {
        int clubCount = clubService.getClubCount();
        Pageable pageable = PageRequest.of(0, clubCount * 2 * (clubCount - 1));
        List<Game> games = gameRepository.findGamesFromCareer(careerName, pageable);
        gameRepository.deleteAll(games);

        List<TrainerCareer> careers = trainerCareerRepository.findTrainerCareersFromCareer(careerName);
        generateTrainerCareerGames(careers, careerName);
    }
}
