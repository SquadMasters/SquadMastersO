package at.htlkaindorf.backend.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long career_id;

    private String careerName;

    private Integer season;

    @OneToMany(mappedBy = "career", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareer> trainerCareers;

    @OneToMany(mappedBy = "career", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareerPlayer> players;
}
