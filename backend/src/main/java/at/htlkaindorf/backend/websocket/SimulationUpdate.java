package at.htlkaindorf.backend.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimulationUpdate {
    private String type;  // z.B. "USER_READY", "SIMULATION_STARTED", "SEASON_ENDED"
    private Object data;  // z.B. Username, Boolean für erste Hälfte etc.
}
