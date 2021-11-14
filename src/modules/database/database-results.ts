import {DatabaseError} from './database-error';

/**
 * Represent a database results
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class DatabaseResults<T> {
  /**
   * Create a new error
   *
   * @param rows The rows (null if error)
   * @param error The error (null if no error)
   */
  constructor(
    public rows?: Array<T>,
    public error?: DatabaseError
  ) {
  }
}
