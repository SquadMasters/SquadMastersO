package at.htlkaindorf.backend.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Game {

    @Id
    @SequenceGenerator(sequenceName = "game_sequence", name = "game_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "game_sequence")
    @EqualsAndHashCode.Include
    private Long game_id;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumns({
            @JoinColumn(name = "home_club_id", referencedColumnName = "club_id"),
            @JoinColumn(name = "home_career_id", referencedColumnName = "career_id")
    })
    private TrainerCareer homeTeam;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumns({
            @JoinColumn(name = "away_club_id", referencedColumnName = "club_id"),
            @JoinColumn(name = "away_career_id", referencedColumnName = "career_id")
    })
    private TrainerCareer awayTeam;

    private LocalDate matchDate;

    private Integer homeGoals;

    private Integer awayGoals;
}
