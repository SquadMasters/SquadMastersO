package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.dto.TransferPlayerDTO;
import at.htlkaindorf.backend.help.PlayerValueCalc;
import at.htlkaindorf.backend.mapper.TrainerCareerPlayerMapper;
import at.htlkaindorf.backend.mapper.TrainerCareersMapper;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.PositionInLineup;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerPlayerRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerPlayerService {

    public final TrainerCareerPlayerRepository trainerCareerPlayerRepository;
    private final TrainerCareerRepository trainerCareerRepository;
    private final TrainerCareerPlayerMapper trainerCareerPlayerMapper;

    public List<PlayerListDTO> getAllPlayersByTrainerCareer(String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findPlayersByTrainerCareer(clubname, careername);

        return tcPlayers.stream()
                .map(trainerCareerPlayerMapper::toPlayerListDTO)
                .toList();
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersForTransferMarketByCareer(String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllForTransfermarket(clubname, careername);
        List<TrainerCareerPlayer> filteredPlayers = new ArrayList<>();

        for (TrainerCareerPlayer player : tcPlayers) {
            String position = player.getPlayer().getPosition();
            String clubnamePlayer = player.getClub().getClubName();
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

            int count = trainerCareerPlayerRepository.countPlayersFromTeamOnPosition(careername, clubnamePlayer, group);
            if (count >= minCount) {
                filteredPlayers.add(player);
            }
        }

        return filteredPlayers.stream()
                .map(trainerCareerPlayerMapper::toCareerPlayerDTO)
                .toList();
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersByCareer(String careername) {

        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllPlayersFromCareer(careername);

        return tcPlayers.stream()
                .map(trainerCareerPlayerMapper::toCareerPlayerDTO)
                .toList();
    }

    public List<TransferPlayerDTO> getAllPlayersByCareerWithTransfer(String careername) {

        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllPlayersFromCareerWithTransfer(careername);

        return tcPlayers.stream()
                .map(trainerCareerPlayerMapper::toTransferPlayerDTO)
                .toList();
    }

    public void changeStartEleven(List<Long> ids, String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findPlayersByTrainerCareer(clubname, careername);


        List<TrainerCareerPlayer> startingEleven = tcPlayers.stream()
                .filter(player -> player.getPositionInLineup() != PositionInLineup.B)
                .toList();

        for (TrainerCareerPlayer trainerCareerPlayer : startingEleven) {
            trainerCareerPlayer.setPositionInLineup(PositionInLineup.B);
        }

        int index = 0;

        PositionInLineup[] positions = PositionInLineup.values();

        for (Long id : ids) {

            TrainerCareerPlayer player = trainerCareerPlayerRepository.findPlayerById(id, careername);

            if (player != null && index < positions.length) {
                player.setPositionInLineup(positions[index]);
            }

            index++;
        }

        trainerCareerPlayerRepository.saveAll(tcPlayers);
    }

    public Boolean changePlayerStats(String careername) {

        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllPlayersFromCareer(careername);

        if (tcPlayers == null || tcPlayers.isEmpty()) {
            return false;
        }

        for (TrainerCareerPlayer player : tcPlayers) {
            player.setAgeNow(player.getAgeNow() + 1);
            player.setMovedRecently(false);

            int potential = player.getPlayer().getPotential();
            int age = player.getAgeNow();
            int rating = player.getRatingNow();
            Random random = new Random();
            int chance = getChanceIndex(age, random);
            int doubleChange = random.nextInt(6);

            if (age < 32 && rating < potential && rating < 10) {
                if (chance == 0) {
                    player.setRatingNow(rating + (doubleChange == 0 && rating < 9 ? 2 : 1));
                }
            }
            else if (age > 31 && rating > 1) {
                if (chance == 0) {
                    player.setRatingNow(rating - (doubleChange == 0 && rating > 2 ? 2 : 1));
                }
            }

            player.setValueNow(PlayerValueCalc.calculateMarketValue(player.getAgeNow(), player.getRatingNow()));
        }

        trainerCareerPlayerRepository.saveAll(tcPlayers);

        return true;
    }

    private int getChanceIndex(int age, Random random) {
        if (age < 23) {
            return random.nextInt(4);
        } else if (age < 28) {
            return random.nextInt(6);
        } else if (age < 32) {
            return random.nextInt(10);
        } else if (age < 36) {
            return random.nextInt(3);
        } else {
            return random.nextInt(2);
        }
    }

    public List<TrainerCareerPlayerDTO> getAllPlayersByTrainerCareerOnWishlist(String username, String careername) {

        String clubname = trainerCareerRepository.findClubNameByUserAndCareer(careername, username);
        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllPlayersOnWishlist(clubname, careername);

        return tcPlayers.stream()
                .map(trainerCareerPlayerMapper::toCareerPlayerDTO)
                .toList();
    }
    @Transactional
    public void updateAttributes(String careername, Long playerId, Map<String, Object> updates) {
        TrainerCareerPlayer player = trainerCareerPlayerRepository
                .findByCareernameAndPlayerId(careername, playerId)
                .orElseThrow(() -> new RuntimeException("Spieler nicht gefunden"));

        if (updates.containsKey("ratingNow")) {
            player.setRatingNow(Integer.parseInt(updates.get("ratingNow").toString()));
        }
        if (updates.containsKey("valueNow")) {
            player.setValueNow(Double.parseDouble(updates.get("valueNow").toString()));
        }

        trainerCareerPlayerRepository.save(player);
    }


}
