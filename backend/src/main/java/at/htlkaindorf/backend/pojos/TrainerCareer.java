package at.htlkaindorf.backend.pojos;

import at.htlkaindorf.backend.pk.TrainerCareerPK;
import jakarta.persistence.*;
import lombok.*;

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


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "wishlist_entry",
            joinColumns = {
                    @JoinColumn(name = "club_id", referencedColumnName = "club_id"),
                    @JoinColumn(name = "career_id", referencedColumnName = "career_id")
            },
            inverseJoinColumns = @JoinColumn(name = "player_id", referencedColumnName = "player_Id")
    )
    private List<Player> wishlistEntries;
}
