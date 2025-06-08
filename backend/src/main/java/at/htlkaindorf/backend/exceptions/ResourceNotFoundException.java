package at.htlkaindorf.backend.exceptions;

/**
 * Custom exception thrown when a requested resource cannot be found.
 * Typically used in service or controller layers to indicate missing data.
 */
public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String resourceName, String identifier) {
    super(resourceName + " with identifier '" + identifier + "' was not found.");
  }
}
