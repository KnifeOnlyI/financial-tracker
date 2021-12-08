/**
 * Represent a stock model
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class StockModel {
  /**
   * Represent a stock
   *
   * @param id The ID
   * @param isin The ISIN
   * @param label The label
   * @param price The price
   */
  constructor(
    public id?: number,
    public isin?: string,
    public label?: string,
    public price?: number
  ) {
  }
}
