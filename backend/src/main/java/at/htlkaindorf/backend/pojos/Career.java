package at.htlkaindorf.backend.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Career {

    @Id
    @SequenceGenerator(sequenceName = "career_sequence", name = "career_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "career_sequence")
    @EqualsAndHashCode.Include
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


    public void changeIsRunning() {
        if (!isRunning)
            isRunning = true;
    }

    public void changeCurrentDate(Boolean firstHalf) {
        if (currentCareerDate == null) {
            currentCareerDate = LocalDate.of(2025, Month.JUNE, 1);
        }

        if (firstHalf) {
            currentCareerDate = currentCareerDate.plusYears(1).withMonth(Month.JANUARY.getValue()).withDayOfMonth(1);
        } else {
            currentCareerDate = currentCareerDate.withMonth(Month.JUNE.getValue()).withDayOfMonth(1);
        }
    }
}
