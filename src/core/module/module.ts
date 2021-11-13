import {Route} from '../routing/route';
import {AppContext} from '../context/app-context';

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
   */
  constructor(
    public readonly context: 'ALL' | 'PROD' | 'DEV',
    public readonly onInit: (context: AppContext) => void = () => {
    },
    public readonly routes = new Array<Route>(),
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
}
