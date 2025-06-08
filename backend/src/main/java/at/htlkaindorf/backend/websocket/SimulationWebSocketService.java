package at.htlkaindorf.backend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendUpdate(String careername, Object payload) {
        String destination = "/topic/simulation-updates/" + careername;
        messagingTemplate.convertAndSend(destination, payload);
    }
}
