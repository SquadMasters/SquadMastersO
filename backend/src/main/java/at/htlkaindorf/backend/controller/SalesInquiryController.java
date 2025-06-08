package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.services.SalesInquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/salesInquiry")
@RequiredArgsConstructor
public class SalesInquiryController {

    private final SalesInquiryService salesInquiryService;

    @PostMapping("/sendOffer")
    public ResponseEntity<String> sendOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        return ResponseEntity.ok(salesInquiryService.sendOfferToPlayer(clubname, careername, playerId));
    }

    @DeleteMapping("/deleteSentOffers")
    public ResponseEntity<String> deleteSentOfferToPlayer(
            @RequestParam String username,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        salesInquiryService.deleteSentOffers(careername, playerId, username);
        return ResponseEntity.ok("Sent offers deleted successfully.");
    }

    @DeleteMapping("/deleteReceivedOffers")
    public ResponseEntity<String> deleteReceivedOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId) {
        salesInquiryService.deleteReceivedOffers(careername, playerId, clubname);
        return ResponseEntity.ok("Received offers deleted successfully.");
    }
}
