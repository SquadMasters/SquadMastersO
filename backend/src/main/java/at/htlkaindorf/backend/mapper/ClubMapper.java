package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.dto.UserDTO;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClubMapper {

    ClubDTO toDTO(Club club);

}
