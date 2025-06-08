package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerCareerRepository extends JpaRepository<TrainerCareer, TrainerCareerPK> {

    @Query("SELECT c FROM TrainerCareer c WHERE c.user.userName = :username")
    List<TrainerCareer> findTrainerCareersByUserName(@Param("username") String username);

    @Query("SELECT c FROM TrainerCareer c WHERE c.user.userName = :username AND c.career.careerName = :careername")
    TrainerCareer findTrainerCareerByUsernameAndCareername(@Param("username") String username,
                                                           @Param("careername") String careername);

    @Query("SELECT t.club.clubName FROM TrainerCareer t WHERE t.career.careerName = :careername AND t.user.userName = :username")
    String findClubNameByUserAndCareer(@Param("careername") String careername,
                                       @Param("username") String username);

    @Query("SELECT t FROM TrainerCareer t WHERE t.club.clubName = :clubname AND t.career.careerName = :careername")
    TrainerCareer findTrainerCareerByClubnameAndCareername(@Param("clubname") String clubname,
                                                           @Param("careername") String careername);

    @Query("SELECT t.club.clubName FROM TrainerCareer t WHERE t.user IS NULL AND t.career.careerName = :careername")
    List<String> findTrainerCareersToJoin(@Param("careername") String careername);

    @Query("SELECT t.user.userName FROM TrainerCareer t WHERE t.career.careerName = :careername " +
            "AND t.user IS NOT NULL AND t.readyForSimulation = false")
    List<String> findNotReadyUsersFromCareer(@Param("careername") String careername);

    @Query("SELECT t.career.startUser.userName FROM TrainerCareer t WHERE t.career.careerName = :careername " +
            "AND t.user.userName = :username")
    String findStartUsernameFromCareer(@Param("username") String username,
                                       @Param("careername") String careername);

    @Query("SELECT t FROM TrainerCareer t WHERE t.career.careerName = :careername AND t.user IS NOT NULL")
    List<TrainerCareer> findTrainerCareersWithUserFromCareer(@Param("careername") String careername);

    @Query("SELECT t FROM TrainerCareer t WHERE t.career.careerName = :careername")
    List<TrainerCareer> findTrainerCareersFromCareer(@Param("careername") String careername);
}
