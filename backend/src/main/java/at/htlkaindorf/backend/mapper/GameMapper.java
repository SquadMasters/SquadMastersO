package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.NextGameDTO;
import at.htlkaindorf.backend.pojos.Game;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GameMapper {

    @Mapping(target = "homeTeam", source = "homeTeam.club.clubName")
    @Mapping(target = "awayTeam", source = "awayTeam.club.clubName")
    @Mapping(target = "date", source = "matchDate")
    NextGameDTO toNextGameDTO(Game game);
}
