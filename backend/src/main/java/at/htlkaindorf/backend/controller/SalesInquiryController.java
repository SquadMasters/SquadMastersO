package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.SalesInquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling player transfer offers (sales inquiries).
 */
@RestController
@RequestMapping("/salesInquiry")
@RequiredArgsConstructor
public class SalesInquiryController {

    private final SalesInquiryService salesInquiryService;

    /**
     * Sends a transfer offer for a player from a club in a career.
     *
     * @param clubname   name of the offering club
     * @param careername name of the career
     * @param playerId   ID of the player being targeted
     * @return success message
     */
    @PostMapping("/sendOffer")
    public ResponseEntity<String> sendOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        return ResponseEntity.ok(salesInquiryService.sendOfferToPlayer(clubname, careername, playerId));
    }

    /**
     * Deletes a previously sent transfer offer.
     *
     * @param username   name of the user who sent the offer
     * @param careername career context
     * @param playerId   player offer to remove
     * @return confirmation message
     */
    @DeleteMapping("/deleteSentOffers")
    public ResponseEntity<String> deleteSentOfferToPlayer(
            @RequestParam String username,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        salesInquiryService.deleteSentOffers(careername, playerId, username);
        return ResponseEntity.ok("Sent offers deleted successfully.");
    }

    /**
     * Deletes a received transfer offer.
     *
     * @param clubname   name of the receiving club
     * @param careername career context
     * @param playerId   player related to the offer
     * @return confirmation message
     */
    @DeleteMapping("/deleteReceivedOffers")
    public ResponseEntity<String> deleteReceivedOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        salesInquiryService.deleteReceivedOffers(careername, playerId, clubname);
        return ResponseEntity.ok("Received offers deleted successfully.");
    }
}
