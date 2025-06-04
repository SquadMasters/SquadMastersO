package at.htlkaindorf.backend.controller;

import at.htlkaindorf.backend.repositories.ClubRepository;
import at.htlkaindorf.backend.repositories.TrainerCareerRepository;
import at.htlkaindorf.backend.services.SalesInquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/salesInquiry")
@RequiredArgsConstructor
@Slf4j
public class SalesInquiryController {

    private final SalesInquiryService salesInquiryService;

    @PostMapping("/sendOffer")
    public String sendOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId
    ) {
        return salesInquiryService.sentOfferToPlayer(clubname, careername, playerId);
    }

    @DeleteMapping("/deleteSentOffers")
    public Boolean deleteSentOfferToPlayer(
            @RequestParam String username,
            @RequestParam String careername,
            @RequestParam Long playerId
    ) {
        return salesInquiryService.deleteSentOffers(careername, playerId, username);
    }

    @DeleteMapping("/deleteReceivedOffers")
    public Boolean deleteReceivedOfferToPlayer(
            @RequestParam String clubname,
            @RequestParam String careername,
            @RequestParam Long playerId
    ) {
        return salesInquiryService.deleteReceivedOffers(careername, playerId, clubname);
    }

}
