package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TrainerCareerPlayerDTO;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerCareerPlayerMapper {

    @Mapping(target = "playerId", source = "player.player_Id")
    @Mapping(target = "rating", source = "ratingNow")
    @Mapping(target = "firstname", source = "player.firstname")
    @Mapping(target = "lastname", source = "player.lastname")
    @Mapping(target = "position", source = "player.position")
    @Mapping(target = "value", source = "valueNow")
    @Mapping(target = "positionInLineup", source = "positionInLineup")
    PlayerListDTO toPlayerListDTO(TrainerCareerPlayer trainerCareerPlayer);

    @Mapping(target = "playerId", source = "player.player_Id")
    @Mapping(target = "rating", source = "ratingNow")
    @Mapping(target = "firstname", source = "player.firstname")
    @Mapping(target = "lastname", source = "player.lastname")
    @Mapping(target = "position", source = "player.position")
    @Mapping(target = "value", source = "valueNow")
    @Mapping(target = "clubname", source = "club.clubName")
    TrainerCareerPlayerDTO toCareerPlayerDTO(TrainerCareerPlayer trainerCareerPlayer);
}
