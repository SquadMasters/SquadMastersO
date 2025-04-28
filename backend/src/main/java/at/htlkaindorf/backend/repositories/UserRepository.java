package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {


    List<User> getUsersByUserName(String userName);
}
