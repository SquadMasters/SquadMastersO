package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomepageDTO {

    private String clubname;
    private String firstname;
    private String lastname;
    private String username;
    private Integer season;
    private Integer leagueTitleCount;

}
