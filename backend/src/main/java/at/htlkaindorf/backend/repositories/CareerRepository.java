package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pojos.Career;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRepository extends JpaRepository<Career, Long> {
}
