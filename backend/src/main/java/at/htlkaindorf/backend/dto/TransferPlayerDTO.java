package at.htlkaindorf.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a player transfer between clubs,
 * including player name, transfer value, and involved clubs.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferPlayerDTO {

    private String firstname;
    private String lastname;
    private Integer valueNow;
    private String oldClubname;
    private String newClubname;

}
