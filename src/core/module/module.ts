import {Route} from '../routing/route';
import {AppContext} from '../context/app-context';
import {Cron} from '../cron/cron';

/**
 * Represent a module
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class Module {
  /**
   * Create a new module
   *
   * @param context The context
   * @param onInit The callback executed when the module initialized (TODO: Allow to user to register services into)
   * @param routes The routes
   * @param cron The cron
   */
  constructor(
    public context: 'ALL' | 'PROD' | 'DEV',
    public readonly onInit: (context: AppContext) => void = () => {
    },
    public readonly routes = new Array<Route>(),
    public readonly cron = new Array<Cron>()
  ) {
  }

  /**
   * Add the specified route to the module
   *
   * @param route The route to add
   */
  addRoute(route: Route): void {
    this.routes.push(route);
  }

  /**
   * Add the specified cron to the module
   *
   * @param cron The cron to add
   */
  addCron(cron: Cron): void {
    this.cron.push(cron);
  }
}
