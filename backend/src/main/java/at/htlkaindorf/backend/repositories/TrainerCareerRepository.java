package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainerCareerRepository extends JpaRepository<TrainerCareer, TrainerCareerPK> {

    @Query("SELECT c FROM TrainerCareer c WHERE c.user.userName = ?1")
    List<TrainerCareer> findAllByUserName(String username);

}
