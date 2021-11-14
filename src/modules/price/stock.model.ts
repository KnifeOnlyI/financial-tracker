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
    public readonly id?: number,
    public readonly isin?: string,
    public readonly label?: string,
    public readonly price?: number
  ) {
  }
}
