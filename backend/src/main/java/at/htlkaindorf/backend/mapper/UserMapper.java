package at.htlkaindorf.backend.mapper;

import at.htlkaindorf.backend.dto.UserDTO;
import at.htlkaindorf.backend.pojos.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDTO(User user);

}
