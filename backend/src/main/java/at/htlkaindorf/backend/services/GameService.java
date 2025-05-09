package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.mapper.GameMapper;
import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.Game;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.repositories.CareerRepository;
import at.htlkaindorf.backend.repositories.GameRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameService {

    public final GameRepository gameRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final CareerRepository careerRepository;
    private final GameMapper gameMapper;

    public void generateTrainerCareerGames(List<TrainerCareer> trainerCareers) {
        List<Game> games = new ArrayList<>();
        int year = LocalDate.now().getYear();
        Random random = new Random();

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

                games.add(createGame(teamA, teamB, getRandomDate(year, 7, 1, year, 12, 31, random)));
                games.add(createGame(teamB, teamA, getRandomDate(year, 7, 1, year, 12, 31, random)));

                games.add(createGame(teamA, teamB, getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random)));
                games.add(createGame(teamB, teamA, getRandomDate(year + 1, 2, 1, year + 1, 5, 31, random)));
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
                                    int yearEnd, int monthEnd, int dayEnd, Random random) {
        LocalDate startDate = LocalDate.of(yearStart, monthStart, dayStart);
        LocalDate endDate = LocalDate.of(yearEnd, monthEnd, dayEnd);
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        return startDate.plusDays(random.nextInt((int) days + 1));
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

}
