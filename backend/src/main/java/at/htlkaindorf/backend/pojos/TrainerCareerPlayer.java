package at.htlkaindorf.backend.pojos;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class TrainerCareerPlayer {

    @EmbeddedId
    private TrainerCareerPlayerPK trainerCareerPlayer_pk;

    @ManyToOne
    @MapsId("clubId")
    @JoinColumn(name = "club_id", referencedColumnName = "club_Id")
    @ToString.Exclude
    private Club club;

    @ManyToOne
    @MapsId("careerId")
    @JoinColumn(name = "career_id", referencedColumnName = "career_Id")
    @ToString.Exclude
    private Career career;

    @ManyToOne
    @MapsId("playerId")
    @JoinColumn(name = "player_id", referencedColumnName = "player_Id")
    @ToString.Exclude
    private Player player;

    @ToString.Exclude
    @OneToMany(mappedBy = "trainerCareerPlayer", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    private List<SalesInquiryEntry> salesInquiries = new ArrayList<>();

    private Integer ageNow;

    private Double valueNow;

    private Integer ratingNow;

    private Boolean movedRecently;

    private PositionInLineup positionInLineup;
}
