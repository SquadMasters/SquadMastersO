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
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long trainer_id;

    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @OneToOne(mappedBy = "trainer", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonBackReference
    private Club club;
}
