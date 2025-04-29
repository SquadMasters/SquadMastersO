package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
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
