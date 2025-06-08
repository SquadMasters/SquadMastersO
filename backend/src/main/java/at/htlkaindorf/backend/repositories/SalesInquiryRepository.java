package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.SalesInquiryEntryPK;
import at.htlkaindorf.backend.pojos.SalesInquiryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SalesInquiryRepository extends JpaRepository<SalesInquiryEntry, SalesInquiryEntryPK> {

    @Query("SELECT s FROM SalesInquiryEntry s WHERE " +
            "s.trainerCareerPlayer.club.clubName = :clubname AND " +
            "s.trainerCareerPlayer.career.careerName = :careername")
    List<SalesInquiryEntry> findAllPlayersWithOffer(@Param("clubname") String clubname,
                                                    @Param("careername") String careername);

    @Query("SELECT s FROM SalesInquiryEntry s WHERE " +
            "s.trainerCareerPlayer.player.player_Id = :playerId AND " +
            "s.trainerCareerPlayer.career.careerName = :careername AND " +
            "s.trainerCareer.user.userName = :username")
    List<SalesInquiryEntry> findSaleInquirySentOffers(@Param("careername") String careername,
                                                      @Param("playerId") Long playerId,
                                                      @Param("username") String username);

    @Query("SELECT s FROM SalesInquiryEntry s WHERE " +
            "s.trainerCareerPlayer.player.player_Id = :playerId AND " +
            "s.trainerCareerPlayer.career.careerName = :careername AND " +
            "s.trainerCareerPlayer.club.clubName = :clubname")
    List<SalesInquiryEntry> findSaleInquiryReceivedOffers(@Param("careername") String careername,
                                                          @Param("playerId") Long playerId,
                                                          @Param("clubname") String clubname);

    @Query("SELECT s FROM SalesInquiryEntry s WHERE " +
            "s.trainerCareerPlayer.player.player_Id = :playerId AND " +
            "s.trainerCareerPlayer.career.careerName = :careername")
    List<SalesInquiryEntry> findAllSalesInquiryFromPlayer(@Param("careername") String careername,
                                                          @Param("playerId") Long playerId);

}
