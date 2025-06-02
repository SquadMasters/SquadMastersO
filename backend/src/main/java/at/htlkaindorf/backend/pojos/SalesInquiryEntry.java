package at.htlkaindorf.backend.pojos;

import at.htlkaindorf.backend.pk.SalesInquiryEntryPK;
import at.htlkaindorf.backend.pk.TrainerCareerPK;
import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class SalesInquiryEntry {

    @EmbeddedId
    private SalesInquiryEntryPK id;

    @ManyToOne
    @MapsId("trainerCareerPK")
    @JoinColumns({
            @JoinColumn(name = "club_id", referencedColumnName = "club_id"),
            @JoinColumn(name = "career_id", referencedColumnName = "career_id")
    })
    private TrainerCareer trainerCareer;

    @ManyToOne
    @MapsId("trainerCareerPlayerPK")
    @JoinColumns({
            @JoinColumn(name = "player_id", referencedColumnName = "player_id"),
            @JoinColumn(name = "player_club_id", referencedColumnName = "club_id"),
            @JoinColumn(name = "player_career_id", referencedColumnName = "career_id")
    })
    private TrainerCareerPlayer trainerCareerPlayer;
}
