package at.htlkaindorf.backend.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Trainer {

    @Id
    @SequenceGenerator(sequenceName = "trainer_sequence", name = "trainer_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "trainer_sequence")
    @EqualsAndHashCode.Include
    private Long trainer_id;

    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @OneToOne(mappedBy = "trainer", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonBackReference
    @ToString.Exclude
    private Club club;
}
