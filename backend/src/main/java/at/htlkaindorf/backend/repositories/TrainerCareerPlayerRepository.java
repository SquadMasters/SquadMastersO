package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerCareerPlayerRepository extends JpaRepository<TrainerCareerPlayer, TrainerCareerPlayerPK> {
}
