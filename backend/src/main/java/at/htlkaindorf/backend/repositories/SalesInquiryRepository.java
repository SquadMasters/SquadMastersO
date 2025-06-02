package at.htlkaindorf.backend.repositories;

import at.htlkaindorf.backend.pk.SalesInquiryEntryPK;
import at.htlkaindorf.backend.pojos.SalesInquiryEntry;
import at.htlkaindorf.backend.pojos.TrainerCareerPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SalesInquiryRepository extends JpaRepository<SalesInquiryEntry, SalesInquiryEntryPK> {

    @Query("SELECT s FROM SalesInquiryEntry s WHERE s.trainerCareerPlayer.club.clubName = ?1 AND s.trainerCareerPlayer.career.careerName = ?2")
    List<SalesInquiryEntry> findAllPlayersWithOffer(String clubname, String careername);

    @Query("SELECT s FROM SalesInquiryEntry s WHERE s.trainerCareerPlayer.player.player_Id = ?2 AND s.trainerCareerPlayer.career.careerName = ?1 AND s.trainerCareer.user.userName = ?3")
    List<SalesInquiryEntry> findSaleInquiryFromPlayer(String careername, Long playerId, String username);

    @Query("SELECT s FROM SalesInquiryEntry s WHERE s.trainerCareerPlayer.player.player_Id = ?2 AND s.trainerCareerPlayer.career.careerName = ?1")
    List<SalesInquiryEntry> findAllSalesInquiryFromPlayer(String careername, Long playerId);

}
