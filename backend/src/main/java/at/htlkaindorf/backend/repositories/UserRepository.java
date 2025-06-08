package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.userName = ?1")
    Optional<User> findUserByName(String username);

    @Query("SELECT u.userName FROM User u")
    List<String> findAllUsernames();
}
