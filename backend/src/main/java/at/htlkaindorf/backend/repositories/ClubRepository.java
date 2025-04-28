package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long> {
}
