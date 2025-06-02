package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleOfferDTO {

    private Long playerId;
    private String firstname;
    private String lastname;
    private Double value;
    private Integer rating;
    private Integer ageNow;
    private String clubWithOffer;

}
