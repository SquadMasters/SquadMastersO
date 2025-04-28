package at.htlkaindorf.backend.json;

import at.htlkaindorf.backend.pojos.Club;
import at.htlkaindorf.backend.pojos.Player;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.util.List;

public class Json_Access {

    public static List<Club> readJson() throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        return mapper.readerForListOf(Club.class).readValue(Json_Access.class.getResource("/trainers_with_clubs_and_players.json"));
    }

}
