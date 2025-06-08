package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.dto.*;
import at.htlkaindorf.backend.services.SalesInquiryService;
import at.htlkaindorf.backend.services.TrainerCareerPlayerService;
import at.htlkaindorf.backend.services.TransferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for managing players in a trainer career.
 */
@RestController
@RequestMapping("/trainerCareerPlayer")
@RequiredArgsConstructor
@Slf4j
public class TrainerCareerPlayerController {

    private final TrainerCareerPlayerService trainerCareerPlayerService;
    private final SalesInquiryService salesInquiryService;
    private final TransferService transferService;

    /**
     * Returns all players for the current user in a given career.
     */
    @GetMapping("/allPlayersFromTrainerCareer")
    public ResponseEntity<List<TrainerCareerPlayerDTO>> getAllPlayersByTrainerCareer(
            @RequestParam String username,
            @RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerPlayerService.getAllPlayersByTrainerCareer(username, careername));
    }

    /**
     * Returns all players that could be shown on the transfer market.
     */
    @GetMapping("/allPlayersForTransfermarket")
    public ResponseEntity<List<TrainerCareerPlayerDTO>> getAllPlayersByCareer(
            @RequestParam String username,
            @RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerPlayerService.getAllPlayersForTransferMarketByCareer(username, careername));
    }

    /**
     * Returns all players from a career.
     */
    @GetMapping("/allPlayersFromCareer")
    public ResponseEntity<List<TrainerCareerPlayerDTO>> getAllPlayersByCareer(@RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerPlayerService.getAllPlayersByCareer(careername));
    }

    /**
     * Returns all players with a recent transfer from a career.
     */
    @GetMapping("/allPlayersFromCareerWithTransfer")
    public ResponseEntity<List<TransferPlayerDTO>> getAllPlayersByCareerWithTransfer(@RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerPlayerService.getAllPlayersByCareerWithTransfer(careername));
    }

    /**
     * Sets the start eleven for the user in a given career.
     */
    @PostMapping("/changeStartElevenPlayers")
    public ResponseEntity<Void> changeStartElevenPlayers(
            @RequestBody Map<String, List<Long>> requestBody,
            @RequestParam String username,
            @RequestParam String careername) {

        List<Long> ids = requestBody.get("ids");
        if (ids == null || ids.size() != 11) {
            throw new IllegalArgumentException("Exactly 11 player IDs must be provided.");
        }

        trainerCareerPlayerService.changeStartEleven(ids, username, careername);
        return ResponseEntity.ok().build();
    }

    /**
     * Returns all players that the user has placed on the wishlist.
     */
    @GetMapping("/allPlayersOnWishlist")
    public ResponseEntity<List<TrainerCareerPlayerDTO>> getAllPlayersOnWishlist(
            @RequestParam String username,
            @RequestParam String careername) {
        return ResponseEntity.ok(trainerCareerPlayerService.getAllPlayersByTrainerCareerOnWishlist(username, careername));
    }

    /**
     * Returns all players for whom the user has received offers.
     */
    @GetMapping("/allPlayersWithOffer")
    public ResponseEntity<List<SaleOfferDTO>> getAllPlayersWithOffer(
            @RequestParam String username,
            @RequestParam String careername) {
        return ResponseEntity.ok(salesInquiryService.getAllPlayersByTrainerCareerWithOffer(username, careername));
    }

    /**
     * Executes a transfer for a player to the specified club.
     */
    @PostMapping("/transferPlayer")
    public ResponseEntity<String> transferPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        transferService.transferPlayer(clubname, careername, playerId);
        return ResponseEntity.ok("Transfer completed successfully!");
    }

    /**
     * Updates certain attributes of a player.
     */
    @PatchMapping("/updateAttributes")
    public ResponseEntity<String> updatePlayerAttributes(
            @RequestParam String careername,
            @RequestParam Long playerId,
            @RequestBody Map<String, Object> updates) {
        try {
            trainerCareerPlayerService.updateAttributes(careername, playerId, updates);
            return ResponseEntity.ok("Spielerattribute erfolgreich aktualisiert.");
        } catch (Exception e) {
            log.error("Fehler beim Aktualisieren: {}", e.getMessage());
            return ResponseEntity.status(500).body("Fehler: " + e.getMessage());
        }
    }
}
