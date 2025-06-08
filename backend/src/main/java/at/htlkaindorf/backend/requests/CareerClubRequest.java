package at.htlkaindorf.backend.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CareerClubRequest {
    private String careername;
    private String username;
    private String clubname;
}
