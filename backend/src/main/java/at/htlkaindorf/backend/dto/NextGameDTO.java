package at.htlkaindorf.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NextGameDTO {

    private String homeTeam;
    private String awayTeam;
    @JsonFormat(pattern = "dd.MM.yyyy")
    private LocalDate date;
    private Integer homeGoals;
    private Integer awayGoals;
}
