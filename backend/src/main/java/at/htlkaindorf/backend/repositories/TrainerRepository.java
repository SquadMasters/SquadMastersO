package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
}
