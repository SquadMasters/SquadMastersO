package at.htlkaindorf.backend.services;

import at.htlkaindorf.backend.dto.ClubDTO;
import at.htlkaindorf.backend.mapper.ClubMapper;
import at.htlkaindorf.backend.mapper.UserMapper;
import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.User;
import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClubService {

    public final ClubRepository clubRepository;
    private final ClubMapper clubMapper;

    public List<ClubDTO> getAllClubsDTO() {
        List<Club> clubs = clubRepository.findAll();
        logIfEmpty(clubs, "Keine Clubs vorhanden!");
        return clubs.stream().map(clubMapper::toDTO).collect(Collectors.toList());
    }

    public List<Club> getAllClubs() {
        List<Club> clubs = clubRepository.findAll();
        logIfEmpty(clubs, "Keine Clubs vorhanden!");
        return clubs;
    }

    private void logIfEmpty(List<?> list, String message) {
        if (list.isEmpty()) {
            log.error(message);
        }
    }

    public Integer getClubCount() {
        return clubRepository.getClubCount();
    }
}
