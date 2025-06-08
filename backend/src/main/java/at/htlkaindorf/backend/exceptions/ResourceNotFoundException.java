package at.htlkaindorf.backend.exceptions;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String resourceName, String identifier) {
    super(resourceName + " with identifier '" + identifier + "' was not found.");
  }
}
