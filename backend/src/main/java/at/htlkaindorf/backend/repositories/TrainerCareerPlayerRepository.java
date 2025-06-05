package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.Player;
import at.htlkaindorf.backend.pojos.TrainerCareer;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerCareerPlayerRepository extends JpaRepository<TrainerCareerPlayer, TrainerCareerPlayerPK> {

    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.club.clubName = ?1 AND tcp.career.careerName = ?2")
    List<TrainerCareerPlayer> findPlayersByTrainerCareer(String clubname, String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1")
    List<TrainerCareerPlayer> findAllPlayersFromCareer(String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1 AND p.movedRecently = true")
    List<TrainerCareerPlayer> findAllPlayersFromCareerWithTransfer(String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?2 AND p.movedRecently = false AND p.club.clubName != ?1")
    List<TrainerCareerPlayer> findAllForTransfermarket(String clubname, String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?2 AND p.movedRecently = false AND p.club.clubName != ?1 AND p.valueNow < ?3")
    List<TrainerCareerPlayer> findAllForTransfermarketInBudget(String clubname, String careername, Integer budget);

    @Query("SELECT count(p) FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1 AND p.club.clubName = ?2 AND p.player.position IN ?3")
    Integer countPlayersFromTeamOnPosition(String careername, String clubname, List<String> positions);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.player.player_Id = ?1 AND p.career.careerName = ?2")
    TrainerCareerPlayer findPlayerById(Long id, String careername);

    @Query("SELECT COALESCE(AVG(p.ratingNow), 0.0) FROM TrainerCareerPlayer p " +
            "WHERE p.trainerCareerPlayer_pk.trainerCareerPK.careerId = ?1 AND p.trainerCareerPlayer_pk.trainerCareerPK.clubId = ?2 " +
            "AND p.positionInLineup != at.htlkaindorf.backend.pojos.PositionInLineup.B")
    Double findAvgRatingFromTrainerCareer(Long careerId, Long clubId);

    @Query("SELECT p.ratingNow FROM TrainerCareerPlayer p " +
            "WHERE p.career.career_id = :careerId AND p.club.club_id = :clubId AND p.player.position IN :positions " +
            "ORDER BY p.ratingNow DESC")
    List<Double> findTopRatings(
            @Param("careerId") Long careerId,
            @Param("clubId") Long clubId,
            @Param("positions") List<String> positions,
            Pageable pageable
    );

    @Query("SELECT COALESCE(count(p), 0) FROM TrainerCareerPlayer p WHERE p.positionInLineup != at.htlkaindorf.backend.pojos.PositionInLineup.B AND p.career.careerName = ?1 AND p.club.clubName = ?2")
    Integer findPlayersInStartingEleven(String careername, String clubname);

    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.player.player_Id IN (SELECT s.trainerCareerPlayer.player.player_Id FROM SalesInquiryEntry s WHERE s.trainerCareer.club.clubName = ?1 AND s.trainerCareer.career.careerName = ?2) AND tcp.career.careerName = ?2")
    List<TrainerCareerPlayer> findAllPlayersOnWishlist(String clubname, String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1 AND p.player.player_Id = ?2")
    TrainerCareerPlayer findPlayerFromCareerById(String careername, Long id);
}
