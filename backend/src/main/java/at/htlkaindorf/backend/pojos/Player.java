package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Player {

    @Id
    @SequenceGenerator(sequenceName = "player_sequence", name = "player_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "player_sequence")
    private Long player_Id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    @JsonProperty("value")
    private Double startValue;

    @Column(nullable = false)
    @JsonProperty("rating")
    private Integer startRating;

    @Column(nullable = false)
    private Integer startAge;

    @OneToMany(mappedBy = "player", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareerPlayer> trainerCareerPlayerList;

    @ManyToMany(mappedBy = "wishlistEntries")
    private List<TrainerCareer> trainerCareers;

    @ManyToOne
    @JoinColumn(name = "club_id")
    @JsonBackReference
    @ToString.Exclude
    private Club startClub;
}
