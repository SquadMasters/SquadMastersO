package at.htlkaindorf.backend.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

/**
 * Utility class for generating JWT (JSON Web Token) tokens.
 * Used for authenticating users by generating a signed token
 * with an expiration time.
 */
public class JWTUtils {

    /** Secret key used for signing the JWT token. */
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /** Token expiration time in milliseconds (24 hours). */
    private static final long EXPIRATION_TIME = 86400000;

    /**
     * Generates a JWT token for the given username.
     *
     * @param username the username to embed in the token as subject
     * @return a signed JWT token as String
     */
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }
}
