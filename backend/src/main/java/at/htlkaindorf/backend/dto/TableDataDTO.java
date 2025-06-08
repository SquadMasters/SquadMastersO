package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing table data for a club in a career,
 * including user, club name, and performance stats.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDataDTO {
    private String username;
    private String clubname;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Integer goalDiff;
}
