package at.htlkaindorf.backend.pk;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class TrainerCareerPlayerPK implements Serializable {

    @Embedded
    private TrainerCareerPK trainerCareerPK;
    private Long playerId;

}
