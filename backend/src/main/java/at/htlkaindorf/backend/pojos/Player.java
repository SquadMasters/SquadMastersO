package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long player_Id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false)
    private Integer startAge;

    @OneToMany(mappedBy = "player", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<TrainerCareerPlayer> trainerCareerPlayerList;

    @ManyToMany(mappedBy = "wishlistEntries")
    private List<TrainerCareer> trainerCareers;

    @ManyToOne
    @JoinColumn(name = "club_id")
    @JsonBackReference
    private Club startClub;
}
