import {Services} from '../services/services';
import Configuration from '../configuration/configuration';
import {Cron} from '../cron/cron';

/**
 * Represent an application context
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class AppContext {
  /**
   * Create a new app context
   *
   * @param configuration The configuration
   * @param services The services
   * @param crons The list of cron jobs
   */
  constructor(
    public readonly configuration: Configuration,
    public readonly services: Services,
    public readonly crons: Array<Cron>
  ) {
  }
}
