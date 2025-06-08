package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.dto.TransferPlayerDTO;
import at.htlkaindorf.backend.exceptions.ResourceNotFoundException;
import at.htlkaindorf.backend.help.PlayerValueCalc;
import at.htlkaindorf.backend.mapper.TrainerCareerPlayerMapper;
import at.htlkaindorf.backend.pojos.PositionInLineup;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TrainerCareerPlayerService {

    private final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerMapper trainerCareerPlayerMapper;

    public List<TrainerCareerPlayerDTO> getAllPlayersByTrainerCareer(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromTrainerCareer(clubName, careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList();
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersForTransferMarketByCareer(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> allPlayers = trainerCareerPlayerRepository.findPlayersFromCareerForSale(clubName, careerName, Integer.MAX_VALUE);
        List<TrainerCareerPlayer> filteredPlayers = new ArrayList<>();

        for (TrainerCareerPlayer player : allPlayers) {
            String position = player.getPlayer().getPosition();
            String playerClub = player.getClub().getClubName();
            List<String> group;
            int minCount;

            if (position.equals("TW")) {
                group = List.of("TW");
                minCount = 2;
            } else if (List.of("IV", "LV", "RV").contains(position)) {
                group = List.of("IV", "LV", "RV");
                minCount = 5;
            } else if (List.of("ZDM", "ZM").contains(position)) {
                group = List.of("ZDM", "ZM");
                minCount = 4;
            } else {
                group = List.of("ST", "RF", "LF");
                minCount = 4;
            }

            int count = trainerCareerPlayerRepository.getPlayersFromTrainerCareerOnPositionsCount(careerName, playerClub, group);
            if (count >= minCount) {
                filteredPlayers.add(player);
            }
        }

        return filteredPlayers.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList();
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersByCareer(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareer(careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList();
    }

    public List<TransferPlayerDTO> getAllPlayersByCareerWithTransfer(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareerWithTransfer(careerName);
        return players.stream().map(trainerCareerPlayerMapper::toTransferPlayerDTO).toList();
    }

    public void changeStartEleven(List<Long> ids, String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromTrainerCareer(clubName, careerName);

        players.forEach(player -> player.setPositionInLineup(PositionInLineup.B));

        PositionInLineup[] positions = PositionInLineup.values();
        for (int i = 0; i < ids.size() && i < positions.length; i++) {
            TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerFromCareerById(ids.get(i), careerName);
            if (player == null) {
                throw new ResourceNotFoundException("Player", "id: " + ids.get(i));
            }
            player.setPositionInLineup(positions[i]);
        }

        trainerCareerPlayerRepository.saveAll(players);
    }

    public void changePlayerStats(String careerName) {
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersFromCareer(careerName);
        if (players.isEmpty()) {
            throw new ResourceNotFoundException("TrainerCareerPlayers", "in career: " + careerName);
        }

        Random random = new Random();

        for (TrainerCareerPlayer player : players) {
            player.setAgeNow(player.getAgeNow() + 1);
            player.setMovedRecently(false);

            int age = player.getAgeNow();
            int rating = player.getRatingNow();
            int potential = player.getPlayer().getPotential();
            int chance = getChanceIndex(age, random);
            boolean doubleChange = random.nextInt(6) == 0;

            if (age < 32 && rating < potential && rating < 10) {
                if (chance == 0) {
                    player.setRatingNow(rating + (doubleChange && rating < 9 ? 2 : 1));
                }
            } else if (age > 31 && rating > 1) {
                if (chance == 0) {
                    player.setRatingNow(rating - (doubleChange && rating > 2 ? 2 : 1));
                }
            }

            player.setValueNow(PlayerValueCalc.calculateMarketValue(player.getAgeNow(), player.getRatingNow()));
        }

        trainerCareerPlayerRepository.saveAll(players);
    }

    private int getChanceIndex(int age, Random random) {
        if (age < 23) return random.nextInt(4);
        if (age < 28) return random.nextInt(6);
        if (age < 32) return random.nextInt(10);
        if (age < 36) return random.nextInt(3);
        return random.nextInt(2);
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersByTrainerCareerOnWishlist(String username, String careerName) {
        String clubName = trainerCareerRepository.findClubNameByUserAndCareer(careerName, username);
        List<TrainerCareerPlayer> players = trainerCareerPlayerRepository.findPlayersOnWishlist(clubName, careerName);
        return players.stream().map(trainerCareerPlayerMapper::toCareerPlayerDTO).toList();
    }
}
