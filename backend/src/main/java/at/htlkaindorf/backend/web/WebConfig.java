package at.htlkaindorf.backend.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for setting global CORS (Cross-Origin Resource Sharing) rules.
 * Allows frontend (e.g. React at localhost:5173) to interact with the backend.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Defines CORS mappings for all API endpoints. Enables requests from
     * http://localhost:5173 and allows common HTTP methods and headers.
     *
     * @param registry the CorsRegistry to configure
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
