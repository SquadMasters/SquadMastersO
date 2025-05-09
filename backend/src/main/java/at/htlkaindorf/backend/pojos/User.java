package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "app_user")
@Builder
public class User {

    @Id
    @SequenceGenerator(sequenceName = "user_sequence", name = "user_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")
    private Long id;

    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false)
    private String userPassword;

    @OneToMany(mappedBy = "startUser", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    List<Career> careers;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @ToString.Exclude
    private List<TrainerCareer> trainerCareers;
}
