import fastify from 'fastify';
import {Module} from './module/module';
import {Route} from './routing/route';
import {Services} from './services/services';
import ConfigurationService from './configuration/configuration';
import {AppContext} from './context/app-context';
import fastifyCron from 'fastify-cron';
import {Cron} from './cron/cron';

/**
 * Represent the application
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class App {
  /**
   * Represent the current executed profile
   */
  private readonly _nodeEnv: 'DEV' | 'PROD';

  /**
   * The handle fastify server
   */
  private readonly _server;

  /**
   * The application context
   */
  private readonly _context: AppContext;

  /**
   * The port on which the server must listen
   */
  private readonly _serverPortListening: number;

  /**
   * The modules list
   */
  private readonly _modules = new Array<Module>();

  /**
   * The all cron jobs
   */
  private readonly _cronJobs = new Array<Cron>();

  /**
   * Create a new app
   *
   * @param configPath The configuration path
   */
  constructor(configPath: string) {
    const nodeEnv = (!process.env.NODE_ENV ? 'DEV' : process.env.NODE_ENV).toUpperCase().trim();

    if (nodeEnv !== 'DEV' && nodeEnv !== 'PROD') {
      throw new Error(`Invalid NODE_ENV value (MUST be 'DEV' or 'PROD') : ${nodeEnv}`);
    }

    this._nodeEnv = nodeEnv;
    this._server = fastify({logger: false});

    this._context = new AppContext(
      new ConfigurationService(configPath, this._nodeEnv),
      new Services()
    );

    this._serverPortListening = this._context.configuration.get('port');
  }

  /**
   * Add the specified service
   *
   * @param name The name of the service to add
   * @param service The service to add
   */
  addService(name: string, service: any): void {
    this._context.services.add(name, service);
  }

  /**
   * Add the specified module
   *
   * @param module The module to add
   * @param context The overwritten context
   */
  addModule(module: Module, context: 'ALL' | 'PROD' | 'DEV' | null = null): void {
    if (context) {
      module.context = context;
    }

    this._modules.push(module);
  }

  start(): void {
    (() => {
      try {
        this.registerServices();
        this.registerModules();
        this.registerCronJobs();

        this._server.listen(this._serverPortListening, '0.0.0.0', () => {
        });

        console.log(`Server listening on port : ${this._serverPortListening}`);
      } catch (err) {
        this._server.log.error('Error :', err);
      }
    })();
  }

  /**
   * Register services
   */
  private registerServices(): void {
    this.addService('node.env', this._nodeEnv);
  }

  /**
   * Register all cron jobs
   */
  private registerCronJobs(): void {
    const jobs: any = [];

    this._cronJobs.forEach(cron => {
      jobs.push({
        cronTime: cron.expression,
        onTick: async () => cron.onTick(this._context),
        startWhenReady: true
      });
    });

    this._server.register(fastifyCron, {jobs});
  }

  /**
   * Register all modules
   */
  private registerModules(): void {
    this._modules.forEach(module => {
      if (module.context == 'ALL' || module.context.toUpperCase() == this._nodeEnv) {
        module.onInit(this._context);

        module.routes.forEach(route => {
          if (route.context == 'ALL' || route.context.toUpperCase() == this._nodeEnv) {
            this.registerRoute(route);
          }
        });

        module.cron.forEach(cron => {
          if (cron.context == 'ALL' || cron.context.toUpperCase() == this._nodeEnv) {
            this._cronJobs.push(cron);
          }
        });
      }
    });
  }

  /**
   * Register the specified route
   *
   * @param route The route to register
   */
  private registerRoute(route: Route): void {
    this._server.route({
      method: route.method,
      url: route.url,
      handler: async (request, response) => {
        return route.handler(request, response, this._context);
      }
    });
  }
}
