package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public List<TrainerCareerPlayerDTO> getAllPlayersByCareer(String careername) {

        List<TrainerCareerPlayer> tcPlayers = trainerCareerPlayerRepository.findAllPlayersFromCareer(careername);

        return tcPlayers.stream()
                .map(trainerCareerPlayerMapper::toCareerPlayerDTO)
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
}
