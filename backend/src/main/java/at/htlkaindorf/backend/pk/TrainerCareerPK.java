package at.htlkaindorf.backend.pk;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class TrainerCareerPK implements Serializable {

    private Long clubId;
    private Long careerId;

}
