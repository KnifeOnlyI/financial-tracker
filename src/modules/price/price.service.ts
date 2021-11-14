import {FetchService} from '../fetch/fetch.service';

/**
 * Service to manage prices
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class PriceService {
  /**
   * Create a new price service
   *
   * @param fetchService The fetch service
   */
  constructor(private readonly fetchService: FetchService) {
  }

  /**
   * Get the current price of the specified ISIN
   *
   * @param isin The ISIN
   *
   * @return The current price
   */
  async getPrice(isin: string): Promise<number> {
    return this.fetchService.fetchHTML(`https://www.boursorama.com/cours/${isin}`).then((html) => {
      return Number(html.querySelector('.c-instrument--last')?.innerHTML);
    }).catch((error) => {
      throw new Error(`Cannot fetch price for ISIN ${isin} because : ${error}`);
    });
  }
}
