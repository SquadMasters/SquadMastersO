package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a trainer's career assignment,
 * including club, career, and user information.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerCareersDTO {

    private String clubname;
    private String careername;
    private String username;
    private String startUser;
}
