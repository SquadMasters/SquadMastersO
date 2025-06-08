package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerCareersDTO {

    private String clubname;
    private String careername;
    private String username;
    private String startUser;
}
