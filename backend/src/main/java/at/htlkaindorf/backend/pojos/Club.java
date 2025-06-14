package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Club {

    @Id
    @SequenceGenerator(sequenceName = "club_sequence", name = "club_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "club_sequence")
    @EqualsAndHashCode.Include
    private Long club_id;

    @Column(nullable = false)
    private String clubName;

    @Column(nullable = false)
    private Integer foundingYear;

    @OneToMany(mappedBy = "club", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareer> trainerCareers;

    @OneToMany(mappedBy = "club", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareerPlayer> careerPlayers;

    @OneToMany(mappedBy = "startClub", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonProperty("players")
    @JsonManagedReference
    private List<Player> startPlayers;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "trainer_id")
    @JsonManagedReference
    private Trainer trainer;
}
