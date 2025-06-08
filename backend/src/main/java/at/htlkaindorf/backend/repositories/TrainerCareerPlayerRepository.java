package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.TrainerCareerPlayerPK;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainerCareerPlayerRepository extends JpaRepository<TrainerCareerPlayer, TrainerCareerPlayerPK> {

    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.club.clubName = :clubname AND tcp.career.careerName = :careername")
    List<TrainerCareerPlayer> findPlayersFromTrainerCareer(@Param("clubname") String clubname,
                                                           @Param("careername") String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = :careername")
    List<TrainerCareerPlayer> findPlayersFromCareer(@Param("careername") String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = :careername AND p.movedRecently = true")
    List<TrainerCareerPlayer> findPlayersFromCareerWithTransfer(@Param("careername") String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = :careername " +
            "AND p.movedRecently = false AND p.club.clubName != :clubname AND p.valueNow < :budget")
    List<TrainerCareerPlayer> findPlayersFromCareerForSale(@Param("clubname") String clubname,
                                                           @Param("careername") String careername,
                                                           @Param("budget") Integer budget);

    @Query("SELECT count(p) FROM TrainerCareerPlayer p WHERE p.career.careerName = :careername " +
            "AND p.club.clubName = :clubname AND p.player.position IN :positions")
    Integer getPlayersFromTrainerCareerOnPositionsCount(@Param("careername") String careername,
                                                        @Param("clubname") String clubname,
                                                        @Param("positions") List<String> positions);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.player.player_Id = :id AND p.career.careerName = :careername")
    TrainerCareerPlayer findPlayerFromCareerById(@Param("id") Long id, @Param("careername") String careername);

    @Query("SELECT COALESCE(AVG(p.ratingNow), 0.0) FROM TrainerCareerPlayer p WHERE " +
            "p.trainerCareerPlayer_pk.trainerCareerPK.careerId = :careerId AND " +
            "p.trainerCareerPlayer_pk.trainerCareerPK.clubId = :clubId AND " +
            "p.positionInLineup != at.htlkaindorf.backend.pojos.PositionInLineup.B")
    Double findAvgRatingFromTrainerCareer(@Param("careerId") Long careerId, @Param("clubId") Long clubId);

    @Query("SELECT p.ratingNow FROM TrainerCareerPlayer p WHERE p.career.career_id = :careerId " +
            "AND p.club.club_id = :clubId AND p.player.position IN :positions " +
            "ORDER BY p.ratingNow DESC")
    List<Double> getTopRatingsFromTrainerCareer(
            @Param("careerId") Long careerId,
            @Param("clubId") Long clubId,
            @Param("positions") List<String> positions,
            Pageable pageable
    );

    @Query("SELECT COALESCE(count(p), 0) FROM TrainerCareerPlayer p WHERE p.positionInLineup != at.htlkaindorf.backend.pojos.PositionInLineup.B " +
            "AND p.career.careerName = :careername AND p.club.clubName = :clubname")
    Integer findPlayersInStartingEleven(@Param("careername") String careername,
                                        @Param("clubname") String clubname);

    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.player.player_Id IN (" +
            "SELECT s.trainerCareerPlayer.player.player_Id FROM SalesInquiryEntry s " +
            "WHERE s.trainerCareer.club.clubName = :clubname AND s.trainerCareer.career.careerName = :careername) " +
            "AND tcp.career.careerName = :careername")
    List<TrainerCareerPlayer> findPlayersOnWishlist(@Param("clubname") String clubname,
                                                    @Param("careername") String careername);
    @Query("SELECT tcp FROM TrainerCareerPlayer tcp WHERE tcp.player.player_Id IN (SELECT s.trainerCareerPlayer.player.player_Id FROM SalesInquiryEntry s WHERE s.trainerCareer.club.clubName = ?1 AND s.trainerCareer.career.careerName = ?2) AND tcp.career.careerName = ?2")
    List<TrainerCareerPlayer> findAllPlayersOnWishlist(String clubname, String careername);

    @Query("SELECT p FROM TrainerCareerPlayer p WHERE p.career.careerName = ?1 AND p.player.player_Id = ?2")
    TrainerCareerPlayer findPlayerFromCareerById(String careername, Long id);


    @Query("SELECT t FROM TrainerCareerPlayer t WHERE t.career.careerName = :careername AND t.player.player_Id = :playerId")
    Optional<TrainerCareerPlayer> findByCareernameAndPlayerId(@Param("careername") String careername, @Param("playerId") Long playerId);

}
