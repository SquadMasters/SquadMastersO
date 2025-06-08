package at.htlkaindorf.backend.json;

import at.htlkaindorf.backend.pojos.Club;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.util.List;

public class Json_Access {

    public static List<Club> readJson() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        var inputStream = Json_Access.class.getResourceAsStream("/trainers_with_clubs_and_players.json");
        if (inputStream == null) {
            throw new IOException("JSON file '/trainers_with_clubs_and_players.json' not found in resources.");
        }

        return mapper.readerForListOf(Club.class).readValue(inputStream);
    }
}
