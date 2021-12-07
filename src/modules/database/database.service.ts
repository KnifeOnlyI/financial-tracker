import {Pool} from 'pg';
import {Configuration} from '../../core/configuration/configuration';
import {DatabaseResults} from './database-results';
import {DatabaseError} from './database-error';

/**
 * Service to manage database
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class DatabaseService {
  /**
   * The main handle pool
   */
  public readonly mainPool: Pool;

  /**
   * The flag indicates if the queries must be logged
   */
  private readonly logQueries: boolean;

  /**
   * Create a new database service
   *
   * @param configuration The configuration
   */
  constructor(configuration: Configuration) {
    this.mainPool = new Pool({
      host: configuration.get('database.host'),
      port: configuration.get('database.port'),
      database: configuration.get('database.name'),
      user: configuration.get('database.user'),
      password: configuration.get('database.password'),
    });

    this.logQueries = configuration.get('database.logs');
  }

  /**
   * Perform a query
   *
   * @param query The query
   * @param params The params
   *
   * @return The response (rows or error)
   */
  async query<T>(query: string, params: any = undefined): Promise<DatabaseResults<T>> {
    const results = new DatabaseResults<T>();

    if (params && this.logQueries) {
      let logQuery = query;

      params.forEach((param: any, index: number) => {
        logQuery = logQuery.replace(
          new RegExp(`\\$${index + 1}`, 'g'),
          !param ? 'null' : param.toString()
        );
      });

      console.log('SQL QUERY :', logQuery);
    }

    return this.mainPool.query(query, params).then(res => {
      results.rows = res.rows;

      return results;
    }).catch(err => {
      this.mainPool.query('ROLLBACK;');

      results.error = new DatabaseError(err.code, err.message, err.severity);

      return results;
    });
  }
}
