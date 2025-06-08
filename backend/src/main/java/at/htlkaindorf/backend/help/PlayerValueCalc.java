package at.htlkaindorf.backend.help;

/**
 * Utility class for calculating the market value of a football player
 * based on age and rating.
 */
public class PlayerValueCalc {

    /**
     * Calculates the market value of a player using a non-linear formula.
     * Younger and higher-rated players are valued higher.
     *
     * @param age the player's age
     * @param rating the player's rating (expected scale: 0–100)
     * @return the estimated market value in euros, rounded to 2 decimal places
     */
    public static double calculateMarketValue(int age, int rating) {
        double maxValue = 120_000_000;
        double ageFactor;

        if (age <= 20) {
            ageFactor = 1.0;
        } else if (age <= 24) {
            ageFactor = 0.9;
        } else if (age <= 28) {
            ageFactor = 0.75;
        } else if (age <= 32) {
            ageFactor = 0.55;
        } else {
            ageFactor = 0.3;
        }

        double ratingFactor = Math.pow((rating / 10.0), 2);
        double marketValue = maxValue * ageFactor * ratingFactor;
        return Math.round(marketValue * 100.0) / 100.0;
    }
}
