package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for transferring user and club information
 * displayed on the homepage of the career mode.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomepageDTO {

    private String username;
    private String clubname;
    private String firstname;
    private String lastname;
    private Integer season;
    private Integer leagueTitleCount;

}
