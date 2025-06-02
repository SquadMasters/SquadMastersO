package at.htlkaindorf.backend.pojos;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class TrainerCareer {

    @EmbeddedId
    private TrainerCareerPK trainerCareer_pk;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id")
    @ToString.Exclude
    private Club club;

    @ManyToOne
    @MapsId("careerId")
    @JoinColumn(name = "career_id")
    @ToString.Exclude
    private Career career;

    private Integer budget;

    private Integer wins;

    private Integer draws;

    private Integer losses;

    private Integer goalDiff;

    private Integer leagueTitleCount;

    private Boolean readyForSimulation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "trainerCareer", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private List<SalesInquiryEntry> salesInquiries = new ArrayList<>();

    @OneToMany(mappedBy = "homeTeam", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @ToString.Exclude
    private List<Game> homeGames = new ArrayList<>();

    @OneToMany(mappedBy = "awayTeam", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @ToString.Exclude
    private List<Game> awayGames = new ArrayList<>();

    public void addHomeGame(Game game) {
        homeGames.add(game);
        game.setHomeTeam(this);
    }

    public void changeReady() {
        readyForSimulation = !readyForSimulation;
    }
}
