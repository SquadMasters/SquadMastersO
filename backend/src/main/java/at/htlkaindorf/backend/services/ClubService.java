package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.repositories.ClubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;

    public List<String> getAllClubNames() {
        return clubRepository.findAll()
                .stream()
                .map(Club::getClubName)
                .collect(Collectors.toList());
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public int getClubCount() {
        return clubRepository.getClubCount();
    }
}
