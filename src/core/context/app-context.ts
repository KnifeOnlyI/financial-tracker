import {Services} from '../services/services';
import {Configuration} from '../configuration/configuration';

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
   */
  constructor(
    public readonly configuration: Configuration,
    public readonly services: Services
  ) {
  }
}
