import {HTMLElement, parse} from 'node-html-parser';

/**
 * A service to manage fetch (like node-fetch)
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class FetchService {
  /**
   * The node fetch
   */
  private readonly nodeFetch = require('node-fetch');

  /**
   * Fetch the content delivered by the specified URL
   *
   * @param url The URL
   *
   * @return The response
   */
  async fetch(url: string): Promise<Response> {
    return this.nodeFetch(url).then(async (results: Response) => {
      return results;
    }).catch((error: any) => {
      throw new Error(`Fetch error : ${error}`);
    });
  }

  /**
   * Fetch the HTML content of the specified URL
   *
   * @param url The url
   *
   * @return The response
   */
  async fetchHTML(url: string): Promise<HTMLElement> {
    return this.fetch(url).then(async (results) => {
      return parse(await results.text());
    }).catch((error) => {
      throw new Error(`Fetch.toText() error : ${error}`);
    });
  }
}
