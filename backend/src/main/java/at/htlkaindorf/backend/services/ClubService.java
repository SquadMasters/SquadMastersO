package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClubService {

    public final ClubRepository clubRepository;

    public List<Club> getAllClubs() {

        List<Club> clubs = clubRepository.findAll();

        if (clubs.isEmpty()) {
            log.error("Keine Clubs vorhanden!");
        }

        return clubs;
    }

}
