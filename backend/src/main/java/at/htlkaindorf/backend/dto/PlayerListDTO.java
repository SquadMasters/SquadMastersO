package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerListDTO {

    private Long playerId;
    private Integer rating;
    private String firstname;
    private String lastname;
    private String position;
    private Integer ageNow;
    private Double value;
    private String positionInLineup;
}
