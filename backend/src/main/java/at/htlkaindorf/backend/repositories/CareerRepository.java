package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Career;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CareerRepository extends JpaRepository<Career, Long> {

    @Query("""
    SELECT c.careerName
    FROM Career c
    WHERE NOT EXISTS (
        SELECT tc
        FROM TrainerCareer tc
        WHERE tc.career = c AND tc.user.userName = ?1
        ) AND c.isRunning = false
    """)
    List<String> getCareersWithoutUser(String username);

    @Query("SELECT c FROM Career c WHERE c.careerName = ?1")
    Career findCareerByName(String careername);
}
