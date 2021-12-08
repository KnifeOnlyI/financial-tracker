import {FetchService} from '../fetch/fetch.service';
import {StockModel} from './stock.model';
import {DatabaseService} from '../database/database.service';

/**
 * Service to manage stocks
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class StockService {
  /**
   * Create a new stock service
   *
   * @param databaseService The database service
   * @param fetchService The fetch service
   */
  constructor(private readonly databaseService: DatabaseService, private readonly fetchService: FetchService) {
  }

  /**
   * Get the current stock of the specified ISIN
   *
   * @param isin The ISIN
   *
   * @return The current stock
   */
  async getPrice(isin: string): Promise<number> {
    return this.fetchService.fetchHTML(`https://www.boursorama.com/cours/${isin}`).then((html) => {
      return Number(html.querySelector('.c-instrument--last')?.innerHTML);
    }).catch((error) => {
      throw new Error(`Cannot fetch stock for ISIN ${isin} because : ${error}`);
    });
  }

  /**
   * Get all stock data of the stock in the database (including prices)
   *
   * @return The all stock data
   */
  async getAll(): Promise<Array<StockModel>> {
    const stocks = new Array<StockModel>();
    let stocksPricesPromise = new Array<Promise<any>>();

    const isinList = await this.databaseService.query<StockModel>('SELECT * FROM stock');

    if (!isinList.rows) {
      throw isinList;
    }

    // Put all "getPrice" promises in array for waiting all settled
    // and create all needed stock (without prices)
    for (let i = 0; i < isinList.rows.length; i++) {
      stocksPricesPromise.push(this.getPrice(isinList.rows[i].isin as string));
      stocks.push(new StockModel(
        isinList.rows[i].id,
        isinList.rows[i].isin,
        isinList.rows[i].label
      ));
    }

    // Wait for all prices fetched and put the prices into stocks
    await Promise.allSettled(stocksPricesPromise).then((results) => {
      results.forEach((price: any, index) => {
        stocks[index].price = price.value as number;
      });
    }).catch((error) => {
      throw error;
    });

    return stocks;
  }
}
