import {FastifyReply, FastifyRequest} from 'fastify';
import {HTTPMethods} from 'fastify/types/utils';
import {AppContext} from '../context/app-context';

/**
 * Represent a route
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class Route {
  /**
   * Create a new route
   *
   * @param method The method
   * @param url The URL
   * @param handler The handler
   */
  constructor(
    public readonly method: HTTPMethods,
    public readonly url: string,
    public readonly handler: (request: FastifyRequest, response: FastifyReply, context: AppContext) => void
  ) {
  }
}
