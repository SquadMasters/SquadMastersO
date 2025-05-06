package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.PlayerListDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerCareerPlayerMapper {


    @Mapping(target = "rating", source = "player.rating")
    @Mapping(target = "firstname", source = "player.firstname")
    @Mapping(target = "lastname", source = "player.lastname")
    @Mapping(target = "position", source = "player.position")
    @Mapping(target = "value", source = "player.value")
    @Mapping(target = "ageNow", source = "ageNow")
    PlayerListDTO toPlayerListDTO(TrainerCareerPlayer trainerCareerPlayer);
}
