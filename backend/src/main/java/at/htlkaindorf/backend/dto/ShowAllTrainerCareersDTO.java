package at.htlkaindorf.backend.dto;

import at.htlkaindorf.backend.pojos.Career;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShowAllTrainerCareersDTO {
    private String clubName;
    private String careerName;
    private String username;
}
