package at.htlkaindorf.backend.json;

import at.htlkaindorf.backend.pojos.Club;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.util.List;

/**
 * Utility class for reading JSON data and mapping it to Java objects.
 * Specifically used to import a list of clubs (with players and metadata)
 * from a predefined JSON file in the resources' directory.
 */
public class Json_Access {

    /**
     * Reads the JSON file "/trainers_with_clubs_and_players.json" from resources
     * and deserializes it into a list of {@link Club} objects.
     *
     * @return list of deserialized Club objects
     * @throws IOException if the file cannot be read or is not found
     */
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
