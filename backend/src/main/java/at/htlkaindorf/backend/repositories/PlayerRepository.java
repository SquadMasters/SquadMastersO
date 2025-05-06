package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    @Query("SELECT p from Player p WHERE p.startClub.club_id = ?1")
    List<Player> findPlayersByClub(Long clubId);
}
