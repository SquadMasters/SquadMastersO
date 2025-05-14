package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ClubRepository extends JpaRepository<Club, Long> {

    @Query("SELECT COALESCE(count(c), 0) FROM Club c")
    Integer getClubCount();
}
