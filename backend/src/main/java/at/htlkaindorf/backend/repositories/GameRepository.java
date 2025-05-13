package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Game;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    @Query("""
    SELECT g
    FROM Game g
    WHERE (
        (g.homeTeam.club.clubName = :clubname AND g.homeTeam.career.careerName = :careername)
        OR
        (g.awayTeam.club.clubName = :clubname AND g.awayTeam.career.careerName = :careername)
    )
    AND g.matchDate = (
        SELECT MIN(g2.matchDate)
        FROM Game g2
        WHERE (
            (g2.homeTeam.club.clubName = :clubname AND g2.homeTeam.career.careerName = :careername)
            OR
            (g2.awayTeam.club.clubName = :clubname AND g2.awayTeam.career.careerName = :careername)
        )
        AND g2.matchDate > current_date
    )
    """)
    Game getNextGameForTrainerCareer(@Param("clubname") String clubname, @Param("careername") String careername, @Param("currentdate") LocalDate currentDate);

    @Query("SELECT g FROM Game g WHERE ((g.homeTeam.club.clubName = :clubname AND g.homeTeam.career.careerName = :careername) OR (g.awayTeam.club.clubName = :clubname AND g.awayTeam.career.careerName = :careername)) ORDER BY g.matchDate")
    List<Game> getAllGamesForTrainerCareer(@Param("clubname") String clubname, @Param("careername") String careername);


    @Query("SELECT g FROM Game g WHERE g.awayTeam.career.careerName = ?1 AND g.homeTeam.career.careerName = ?1 ORDER BY g.matchDate ASC")
    List<Game> getGamesFromCareer(String careername, Pageable pageable);
}
