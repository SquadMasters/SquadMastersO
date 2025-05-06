package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.UserDTO;
import at.htlkaindorf.backend.mapper.UserMapper;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    public final UserRepository userRepository;
    private final UserMapper userMapper;

    public Boolean validateUser(String userName, String passwd) {

        List<User> users = userRepository.getUsersByUserName(userName);

        if (users.isEmpty()) {
            return false;
        }

        return users.get(0).getUserPassword().equals(passwd);
    }

    public UserDTO registerUser(String userName, String passwd) {

        User user = User.builder().userName(userName).userPassword(passwd).trainerCareers(new ArrayList<>()).build();

        if (!userRepository.getUsersByUserName(userName).isEmpty()) {
            log.error("Username schon vorhanden!");
            throw new RuntimeException("Username schon vorhanden");
        }

        userRepository.save(user);

        return userMapper.toDTO(user);
    }

}
