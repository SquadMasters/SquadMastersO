package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDataDTO {

    private String clubName;

    private Integer wins;

    private Integer draws;

    private Integer losses;

    private Integer goalDiff;

    private String username;
}
