package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for transferring budget-related information
 * of a specific club within a given career.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetDTO {
    private String clubname;
    private String careername;
    private Integer budget;
}
