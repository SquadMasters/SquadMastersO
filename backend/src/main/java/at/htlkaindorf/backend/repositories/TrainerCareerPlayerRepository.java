package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainerCareerPlayerRepository extends JpaRepository<TrainerCareerPlayer, TrainerCareerPlayerPK> {

    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.club.clubName = ?1 AND tcp.career.careerName = ?2")
    List<TrainerCareerPlayer> findPlayersByTrainerCareer(String clubname, String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1 AND p.movedRecently = false")
    List<TrainerCareerPlayer> findAllPlayersFromCareer(String careername);
}
