package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.dto.ShowAllTrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerCareersMapper {

    @Mapping(target = "clubName", source = "club.clubName")
    @Mapping(target = "careerName", source = "career.careerName")
    @Mapping(target = "username", source = "user.userName")
    ShowAllTrainerCareersDTO toDTO(TrainerCareer trainerCareer);

    @Mapping(target = "clubName", source = "club.clubName")
    TableDataDTO toTableDTO(TrainerCareer trainerCareer);
}
