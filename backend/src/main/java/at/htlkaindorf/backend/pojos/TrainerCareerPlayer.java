package at.htlkaindorf.backend.pojos;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
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

    private Integer ageNow;

    private Boolean movedRecently;

    private PositionInLineup positionInLineup;

    private Boolean salesInquiry;
}
