package at.htlkaindorf.backend.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Data Transfer Object representing a player in a trainer career context,
 * including club, stats, lineup position, and personal data.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class  TrainerCareerPlayerDTO {

    private Long playerId;
    private String clubname;
    private String firstname;
    private String lastname;
    private String position;
    private Double value;
    private Integer rating;
    private Integer ageNow;
    private String positionInLineup;
    private Integer potential;
}
