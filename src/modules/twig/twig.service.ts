import Twig from 'twig';
import {Configuration} from '../../core/configuration/configuration';
import path from 'path';
import * as fs from 'fs';

/**
 * Service to manage Twig templates
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class TwigService {
  /**
   * The base template path
   */
  private readonly baseTemplatePath: string;

  constructor(configuration: Configuration) {
    this.baseTemplatePath = configuration.get('view.templates');
  }

  /**
   * Render the specified template and get string HTML results
   *
   * @param templateFilepath The template filepath
   * @param data The data
   *
   * @return The string HTML results
   */
  render(templateFilepath: string, data?: any): string {
    // FIXME: Actually cannot use {% includes %} blocks
    return Twig.twig({
      data: fs.readFileSync(path.resolve(`${this.baseTemplatePath}/${templateFilepath}`)).toString()
    }).render(data);
  }

  /**
   * Add a new filter
   *
   * @param name The filter name
   * @param definition The callback definition
   */
  addFilter(name: string, definition: (left: any, params: any[] | false) => string): void {
    Twig.extendFilter(name, definition);
  }
}
