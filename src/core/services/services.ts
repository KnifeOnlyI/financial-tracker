/**
 * Represent all registered services
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class Services {
  /**
   * The handle services
   */
  private readonly _handle = new Map<string, any>();

  /**
   * Add the specified service to the services list (throw an error if already exists service)
   *
   * @param name The service name
   * @param service The service to add
   */
  add(name: string, service: any): void {
    const serviceName = name.toLowerCase();

    if (this._handle[serviceName]) {
      throw new Error(`The service already registered : ${serviceName}`);
    }

    if (!service) {
      throw new Error('A service CANNOT be null or undefined');
    }

    this._handle[serviceName] = service;


  }

  /**
   * Get a service by the specified name
   *
   * @param name The name of service to get
   */
  get<T>(name: string): T {
    const serviceName = name.toLowerCase();

    if (!this._handle[serviceName]) {
      throw new Error(`Not registered service : ${serviceName}`);
    }

    return this._handle[serviceName];
  }
}
