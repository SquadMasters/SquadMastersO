package at.htlkaindorf.backend.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimulationUpdate {
    private String type;
    private Object data;
}
