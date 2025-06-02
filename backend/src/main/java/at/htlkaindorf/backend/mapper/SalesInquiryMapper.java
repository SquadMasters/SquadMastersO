package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.dto.SaleOfferDTO;
import at.htlkaindorf.backend.pojos.Game;
import at.htlkaindorf.backend.pojos.SalesInquiryEntry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SalesInquiryMapper {

    @Mapping(target = "playerId", source = "trainerCareerPlayer.player.player_Id")
    @Mapping(target = "firstname", source = "trainerCareerPlayer.player.firstname")
    @Mapping(target = "lastname", source = "trainerCareerPlayer.player.lastname")
    @Mapping(target = "value", source = "trainerCareerPlayer.valueNow")
    @Mapping(target = "rating", source = "trainerCareerPlayer.ratingNow")
    @Mapping(target = "ageNow", source = "trainerCareerPlayer.ageNow")
    @Mapping(target = "clubWithOffer", source = "trainerCareer.club.clubName")
    SaleOfferDTO toSaleOfferDTO(SalesInquiryEntry salesInquiryEntry);

}
