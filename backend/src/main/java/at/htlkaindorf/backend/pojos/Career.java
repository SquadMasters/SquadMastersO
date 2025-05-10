package at.htlkaindorf.backend.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Career {

    @Id
    @SequenceGenerator(sequenceName = "career_sequence", name = "career_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "career_sequence")
    private Long career_id;

    @Column(unique = true)
    private String careerName;

    private LocalDate currentCareerDate;

    private Boolean isRunning;

    @ManyToOne
    @JoinColumn(name = "startUserFK")
    @ToString.Exclude
    private User startUser;

    @OneToMany(mappedBy = "career", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareer> trainerCareers;

    @OneToMany(mappedBy = "career", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @ToString.Exclude
    private List<TrainerCareerPlayer> players;
}
