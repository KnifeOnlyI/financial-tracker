import {DatabaseService} from '../database/database.service';
import {MigrationModel} from './migration.model';

;

/**
 * Service to manage migrations
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class MigrationService {
  /**
   * Create a new migration service
   *
   * @param databaseService The database service
   */
  constructor(private readonly databaseService: DatabaseService) {
  }

  /**
   * Execute the specified migrations
   *
   * @param migrations The migrations to executed
   */
  async executeMigrations(migrations: Array<MigrationModel>): Promise<void> {
    await this.databaseService.query('BEGIN;');

    const results = await this.databaseService.query(
      'CREATE TABLE IF NOT EXISTS table_migration (id VARCHAR(255) PRIMARY KEY UNIQUE);'
    );

    if (results.error) {
      await this.databaseService.query('ROLLBACK;');

      throw results.error;
    }

    for (let migration of migrations) {
      if (migration) {
        if (!(await this.migrationAlreadyExists(migration.id))) {
          await this.executeMigration(migration);
        }
      }
    }

    await this.databaseService.query('COMMIT;');
  }

  /**
   * Execute the specified migration
   *
   * @param migration The migration to execute
   */
  private async executeMigration(migration: { id: string, queries: Array<string> }): Promise<void> {
    // Execute all queries in the migration
    for (let query of migration.queries) {
      const queryResults = await this.databaseService.query(query);

      if (queryResults.error) {
        await this.databaseService.query('ROLLBACK;');

        throw queryResults.error;
      }
    }

    // Save migration ID into the database
    const insertIntoMigration = await this.databaseService.query(
      'INSERT INTO table_migration (id) VALUES ($1)',
      [migration.id]
    );

    if (insertIntoMigration.error) {
      await this.databaseService.query('ROLLBACK;');

      throw insertIntoMigration.error;
    }
  }

  /**
   * Check if a migration with the specified id already exists in the database
   *
   * @param id The migration ID to check
   *
   * @return TRUE if the migration already exists, FALSE otherwise
   */
  private async migrationAlreadyExists(id: string): Promise<boolean> {
    const nbMigrationResults = await this.databaseService.query<Array<number>>(
      'SELECT COUNT(*) AS nb_migration FROM table_migration WHERE id = $1', [id]
    );

    if (!nbMigrationResults.rows) {
      await this.databaseService.query('ROLLBACK;');

      throw nbMigrationResults.error;
    }

    return Number(nbMigrationResults.rows[0]['nb_migration']) > 0;
  }
}
