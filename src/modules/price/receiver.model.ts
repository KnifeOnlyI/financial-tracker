/**
 * Represent a receiver
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class ReceiverModel {
  /**
   * Create a new receiver
   *
   * @param id The ID
   * @param email The email
   * @param name The name
   */
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly name: string
  ) {
  }
}
