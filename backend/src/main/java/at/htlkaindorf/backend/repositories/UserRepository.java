package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.userName = ?1")
    List<User> getUsersByUserName(String userName);
}
