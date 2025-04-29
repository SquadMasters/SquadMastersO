package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewCareerRequestDTO {
    private String careerName;
    private String clubName;
    private String username;
}
