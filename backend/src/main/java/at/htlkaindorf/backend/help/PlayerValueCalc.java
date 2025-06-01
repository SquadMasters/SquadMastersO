package at.htlkaindorf.backend.help;

public class PlayerValueCalc {

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
