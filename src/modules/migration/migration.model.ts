/**
 * Represent a migration
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class MigrationModel {
  /**
   * Create a new migration
   *
   * @param id The migration ID
   * @param queries The queries
   */
  constructor(public readonly id: string, public readonly queries = new Array<string>()) {
  }

  /**
   * Add the specified query to the migration
   *
   * @param query The query to add
   */
  addQuery(query: string): void {
    this.queries.push(query);
  }
}
