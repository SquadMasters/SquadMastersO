package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.BudgetDTO;
import at.htlkaindorf.backend.dto.HomepageDTO;
import at.htlkaindorf.backend.dto.TrainerCareersDTO;
import at.htlkaindorf.backend.dto.TableDataDTO;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainerCareersMapper {

    @Mapping(target = "clubname", source = "club.clubName")
    @Mapping(target = "careername", source = "career.careerName")
    @Mapping(target = "username", source = "user.userName")
    @Mapping(target = "startUser", source = "career.startUser.userName")
    TrainerCareersDTO toDTO(TrainerCareer trainerCareer);

    @Mapping(target = "clubname", source = "club.clubName")
    @Mapping(target = "username", source = "user.userName")
    TableDataDTO toTableDTO(TrainerCareer trainerCareer);

    @Mapping(target = "clubname", source = "club.clubName")
    @Mapping(target = "username", source = "user.userName")
    @Mapping(target = "firstname", source = "club.trainer.firstname")
    @Mapping(target = "lastname", source = "club.trainer.lastname")
    @Mapping(target = "season", expression = "java(trainerCareer.getCareer().getCurrentCareerDate().getYear())")
    HomepageDTO toHomepageDTO(TrainerCareer trainerCareer);


    @Mapping(target = "clubname", source = "club.clubName")
    @Mapping(target = "careername", source = "career.careerName")
    BudgetDTO toBudgetDTO(TrainerCareer trainerCareer);
}
