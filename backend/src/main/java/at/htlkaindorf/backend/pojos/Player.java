package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Player {

    @Id
    @SequenceGenerator(sequenceName = "player_sequence", name = "player_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "player_sequence")
    @EqualsAndHashCode.Include
    private Long player_Id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String position;

    @JsonProperty("value")
    @Transient
    private Double startValue;

    @Column(nullable = false)
    @JsonProperty("rating")
    private Integer startRating;

    @Column(nullable = false)
    private Integer startAge;

    @Column(nullable = false)
    private Integer potential;

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
