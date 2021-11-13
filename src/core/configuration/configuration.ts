import * as fs from 'fs';

/**
 * Represent a cache entry
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
interface CacheEntry {
  path: string,
  value: any
}

/**
 * Represent a configuration
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export default class Configuration {
  /** The execution environment */
  public readonly env: string;

  /** The raw values */
  private readonly _values: any;

  /** Cache for configuration values */
  private readonly _cache = new Array<CacheEntry>();

  /**
   * Constructor
   *
   * @param configPath The configuration files path
   * @param nodeEnv The node env value
   */
  constructor(configPath: string, nodeEnv: string) {
    this.env = nodeEnv.toLowerCase();

    this._values = JSON.parse(
      fs.readFileSync(`${configPath}/config-${this.env}.json`)
        .toString('utf-8')
    );
  }

  /**
   * Get a configuration value from path with this format : <root>.<sub1>.<sub2>...
   *
   * Example : database.security.user.name
   *
   * @param path The path of value to get
   */
  get(path: string): any {
    let valueIndex = this._cache.findIndex((entry) => {
      return path === entry.path;
    });

    let value;

    if (valueIndex !== -1) {
      value = this._cache[valueIndex].value;
    } else {
      const pathElements = path.split('.');
      value = this._values;

      for (let i = 0; i < pathElements.length; i++) {
        value = value[pathElements[i]];

        if (value === undefined) {
          throw Error(`No configuration key : ${path}`);
        }
      }

      // If it's a env variable, fetch it from user env
      if (value && value.length > 0 && value[0] === '%' && value[value.length - 1] === '%') {
        value = process.env[value.substring(1, value.length - 1)];
      }

      this._cache.push({path, value});
    }

    return value;
  }
}
