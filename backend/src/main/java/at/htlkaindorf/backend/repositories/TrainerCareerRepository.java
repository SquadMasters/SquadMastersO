package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainerCareerRepository extends JpaRepository<TrainerCareer, TrainerCareerPK> {

    @Query("SELECT c FROM TrainerCareer c WHERE c.user.userName = ?1")
    List<TrainerCareer> findAllByUserName(String username);

    @Query("SELECT c FROM TrainerCareer c WHERE c.career.careerName = ?1")
    List<TrainerCareer> findAllByCareer(String career);

    @Query("SELECT t.club.clubName FROM TrainerCareer t WHERE t.career.careerName = ?1 AND t.user.userName = ?2")
    String findClubNameByUserAndCareer(String careername, String username);

    @Query("SELECT t FROM TrainerCareer t WHERE t.club.clubName = ?1 AND t.career.careerName = ?2")
    TrainerCareer findTrainerCareerByClubnameAndCareername(String clubname, String careername);

    @Query("SELECT t.club.clubName FROM TrainerCareer t WHERE t.user IS NULL AND t.career.careerName = ?1")
    List<String> findTrainerCareersToJoin(String careername);

}
