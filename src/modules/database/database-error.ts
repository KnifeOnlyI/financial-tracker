/**
 * Represent a database results error
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class DatabaseError {
  /**
   * Create a new error
   *
   * @param code The error code
   * @param message The message
   * @param severity The severity
   */
  constructor(
    public code: string,
    public message: string,
    public severity: string,
  ) {
  }
}
