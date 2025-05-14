package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.NextGameDTO;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    public final GameRepository gameRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final CareerRepository careerRepository;
    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final GameMapper gameMapper;

    public void generateTrainerCareerGames(List<TrainerCareer> trainerCareers) {
        List<Game> games = new ArrayList<>();
        int year = LocalDate.now().getYear();
        Random random = new Random();

        // Set to keep track of already generated dates
        Set<LocalDate> generatedDates = new HashSet<>();

        for (TrainerCareer tc : trainerCareers) {
            if (tc.getHomeGames() == null) {
                tc.setHomeGames(new ArrayList<>());
            }
            if (tc.getAwayGames() == null) {
                tc.setAwayGames(new ArrayList<>());
            }
        }

        for (int i = 0; i < trainerCareers.size() - 1; i++) {
            for (int j = i + 1; j < trainerCareers.size(); j++) {
                TrainerCareer teamA = trainerCareers.get(i);
                TrainerCareer teamB = trainerCareers.get(j);

                LocalDate date1 = getRandomDate(year, 7, 1, year, 12, 31, random, generatedDates);
                LocalDate date2 = getRandomDate(year, 7, 1, year, 12, 31, random, generatedDates);

                games.add(createGame(teamA, teamB, date1));
                games.add(createGame(teamB, teamA, date2));

                LocalDate date3 = getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random, generatedDates);
                LocalDate date4 = getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random, generatedDates);

                games.add(createGame(teamA, teamB, date3));
                games.add(createGame(teamB, teamA, date4));
            }
        }

        games.forEach(game -> {
            game.getHomeTeam().addHomeGame(game);
            game.getAwayTeam().addAwayGame(game);
        });
    }

    private Game createGame(TrainerCareer home, TrainerCareer away, LocalDate matchDate) {
        return Game.builder()
                .homeTeam(home)
                .awayTeam(away)
                .matchDate(matchDate)
                .homeGoals(null)
                .awayGoals(null)
                .build();
    }

    private LocalDate getRandomDate(int yearStart, int monthStart, int dayStart,
                                    int yearEnd, int monthEnd, int dayEnd, Random random,
                                    Set<LocalDate> generatedDates) {
        LocalDate startDate = LocalDate.of(yearStart, monthStart, dayStart);
        LocalDate endDate = LocalDate.of(yearEnd, monthEnd, dayEnd);
        long days = ChronoUnit.DAYS.between(startDate, endDate);

        LocalDate randomDate;
        do {
            randomDate = startDate.plusDays(random.nextInt((int) days + 1)); // Zufälliges Datum generieren
        } while (generatedDates.contains(randomDate)); // Prüfen, ob das Datum schon existiert

        generatedDates.add(randomDate); // Das generierte Datum zu dem Set hinzufügen
        return randomDate;
    }




    public NextGameDTO getNextGame(String username, String careername) {
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        if (clubname == null) {
            throw new IllegalArgumentException("No club found for user and career.");
        }

        Career career = careerRepository.findCareerByName(careername);
        if (career == null) {
            throw new IllegalArgumentException("Career not found.");
        }

        Game game = gameRepository.getNextGameForTrainerCareer(clubname, careername, career.getCurrentCareerDate());
        if (game == null) {
            return null;
        }

        return gameMapper.toNextGameDTO(game);
    }

    public List<NextGameDTO> getAllNextGame(String username, String careername) {
        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        if (clubname == null) {
            throw new IllegalArgumentException("No club found for user and career.");
        }

        List<Game> games = gameRepository.getAllGamesForTrainerCareer(clubname, careername);
        if (games.isEmpty()) {
            return null;
        }

        return games.stream().map(gameMapper::toNextGameDTO).toList();
    }

    public Boolean simulateSeason(String careername, Boolean firstHalf) {

        List<Game> games;

        Pageable pageable;
        if (firstHalf) {
            pageable = PageRequest.of(0, 90);
        } else {
            pageable = PageRequest.of(1, 90);
        }

        games = gameRepository.getGamesFromCareer(careername, pageable);

        if (games.isEmpty()) {
            log.error("Keine Spiele gefunden für Karriere: {}", careername);
            return false;
        }

        simulateGames(games);

        return true;
    }

    private void simulateGames(List<Game> games) {

        for(Game game : games) {

            long careerIdHome = game.getHomeTeam().getCareer().getCareer_id();
            long clubIdHome = game.getHomeTeam().getClub().getClub_id();
            long careerIdAway = game.getAwayTeam().getCareer().getCareer_id();
            long clubIdAway = game.getAwayTeam().getClub().getClub_id();

            Double ratingHomeTeam = trainerCareerPlayerRepository.findAvgRatingFromTrainerCareer(careerIdHome, clubIdHome);

            Double ratingAwayTeam = trainerCareerPlayerRepository.findAvgRatingFromTrainerCareer(careerIdAway, clubIdAway);

            ratingHomeTeam = ratingHomeTeam == 0 ? getRatingForNoStartingEleven(careerIdHome, clubIdHome) : ratingHomeTeam;
            ratingAwayTeam = ratingAwayTeam == 0 ? getRatingForNoStartingEleven(careerIdAway, clubIdAway) : ratingAwayTeam;

            //log.info(game.getHomeTeam().getClub().getClubName() + "->" + ratingHomeTeam + " - " + game.getAwayTeam().getClub().getClubName() + "->" + ratingAwayTeam);

            double difference = ratingHomeTeam - ratingAwayTeam;
            boolean homeTeamBetter = true;

            if (difference < 0) {
                difference *= -1;
                homeTeamBetter = false;
            }

            if (difference < 0.1) {
                int upperLimit = 2 + new Random().nextInt(2);
                game.setHomeGoals(new Random().nextInt(upperLimit));
                game.setAwayGoals(new Random().nextInt(upperLimit));
            } else if (difference < 0.25) {
                int limit = 3 + new Random().nextInt(2);
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 4 : limit));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 4 : limit));
            } else if (difference < 0.4) {
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 4 : 3));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 4 : 3));
            } else if (difference < 0.7) {
                int upperLimit = 4 + new Random().nextInt(2);
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? upperLimit : 3));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? upperLimit : 3));
            } else if (difference < 1) {
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 5 : 3));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 5 : 3));
            } else if (difference < 1.5) {
                int limit = 2 + new Random().nextInt(2);
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 5 : limit));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 5 : limit));
            } else if (difference < 2) {
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 5 : 2));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 5 : 2));
            } else if (difference < 4) {
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 6 : 2));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 6 : 2));
            } else {
                game.setHomeGoals(new Random().nextInt(homeTeamBetter ? 6 : 1));
                game.setAwayGoals(new Random().nextInt(!homeTeamBetter ? 6 : 1));
            }

            gameRepository.save(game);
        }
    }

    private Double getRatingForNoStartingEleven(Long careerId, Long clubId) {

        double avgRatingGoalkeeper = getAverageRating(careerId, clubId, new String[] {"TW"}, 1);
        double avgRatingDefender = getAverageRating(careerId, clubId, new String[] {"LV", "RV", "IV"}, 4);
        double avgRatingStriker = getAverageRating(careerId, clubId, new String[] {"LF", "RF", "ST"}, 3);
        double avgRatingMidfielder = getAverageRating(careerId, clubId, new String[] {"ZDM", "ZM"}, 3);

        return (avgRatingGoalkeeper + avgRatingDefender + avgRatingStriker + avgRatingMidfielder) / 4;
    }

    private double getAverageRating(Long careerId, Long clubId, String[] roles, int pageSize) {
        List<Double> ratings = trainerCareerPlayerRepository.findTopRatings(
                careerId,
                clubId,
                new ArrayList<>(Arrays.asList(roles)),
                PageRequest.of(0, pageSize)
        );

        return ratings.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
    }

}
