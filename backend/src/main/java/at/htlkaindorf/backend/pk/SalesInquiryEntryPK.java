package at.htlkaindorf.backend.pk;

import at.htlkaindorf.backend.pojos.TrainerCareer;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesInquiryEntryPK implements Serializable {

    @Embedded
    private TrainerCareerPK trainerCareerPK;
    @Embedded
    private TrainerCareerPlayerPK trainerCareerPlayerPK;
}
