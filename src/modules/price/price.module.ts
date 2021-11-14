import {Module} from '../../core/module/module';
import {PriceService} from './price.service';
import {Cron} from '../../core/cron/cron';
import {MailService} from '../mail/mail.service';
import Configuration from '../../core/configuration/configuration';
import {DatabaseService} from '../database/database.service';
import {Route} from '../../core/routing/route';
import {StockModel} from './stock.model';
import {ReceiverModel} from './receiver.model';

const priceModule = new Module('ALL', async ({services}) => {
  services.add('price', new PriceService(services.get('fetch')));
});

priceModule.addRoute(new Route(
  'DEV',
  'GET',
  '/prices',
  async (request, response, {configuration, services}) => {
    sendPrices(configuration, services.get('database'), services.get('price'), services.get('mail'));

    return {};
  }
));

/**
 * Get stocks prices of the stocks in database
 *
 * @param databaseService The database service
 * @param priceService The price service
 *
 * @return The stocks prices
 */
async function getStockPrices(databaseService: DatabaseService, priceService: PriceService): Promise<Array<StockModel>> {
  const stocks = new Array<StockModel>();

  const isinList = await databaseService.query<StockModel>(
    'SELECT * FROM stock'
  );

  if (!isinList.rows) {
    throw isinList;
  }

  // Get all prices
  for (let i = 0; i < isinList.rows.length; i++) {
    stocks.push(new StockModel(
      isinList.rows[i].id,
      isinList.rows[i].isin,
      isinList.rows[i].label,
      await priceService.getPrice(isinList.rows[i].isin as string)
    ));
  }

  return stocks;
}

/**
 * Get all receivers
 *
 * @param databaseService The database service
 *
 * @return The receivers list
 */
async function getReceivers(databaseService: DatabaseService): Promise<Array<ReceiverModel>> {
  const results = await databaseService.query<ReceiverModel>('SELECT * FROM receiver');

  if (!results.rows) {
    throw results.error;
  }

  return results.rows;
}

/**
 * Build the HTML body for the email according to the specified stocks
 *
 * @param receiver The receiver
 * @param stocks The stocks
 *
 * @return The HTML
 */
function buildHTMLBody(receiver: ReceiverModel, stocks: Array<StockModel>): string {
  let rows = '';

  stocks.forEach(stock => {
    const formatedStockPrice = stock.price?.toFixed(3).replace('.', ',');

    rows += `<tr>
      <td>${stock.isin?.toUpperCase()}</td>
      <td>${stock.label?.toUpperCase()}</td>
      <td style="text-align: right; border-left: 1px solid black;">${formatedStockPrice} €</td>
    </tr>`;
  });

  return `
<p>Dear ${receiver.name},</p>
<table style="table-layout: fixed;width: 100%;border-collapse: collapse;border: 1px solid black;text-align:center;">
  <thead style="border-bottom: 1px solid black; background: yellow;">
    <tr>
      <th>ISIN</th>
      <th>Stock</th>
      <th style="text-align: center; border-left: 1px black solid;">Price</th>
    </tr>
  </thead>
  <tbody>
  ${rows}
  </tbody>
</table>
<p>Best regards.</p>
<hr>
<p>Financial tracker team</p>`;
}

/**
 * Send all prices to receivers
 *
 * @param configuration The configuration
 * @param databaseService The database service
 * @param priceService The price service
 * @param mailService The mail service
 */
async function sendPrices(configuration: Configuration, databaseService: DatabaseService, priceService: PriceService, mailService: MailService): Promise<void> {
  const stocks = await getStockPrices(databaseService, priceService);
  const receivers = await getReceivers(databaseService);

  if (stocks.length > 0) {
    // Send emails
    receivers.forEach(receiver => {
      mailService.sendMail(
        configuration.get<string>('emails.sender.from'),
        receiver.email,
        'Financial Tracker - NEWS',
        buildHTMLBody(receiver, stocks)
      );
    });
  }
}

priceModule.addCron(new Cron(
  'ALL',
  '0 17 * * 1-5', // At 17:00 on every day-of-week from Monday through Friday.
  async ({configuration, services}) => {
    await sendPrices(configuration, services.get('database'), services.get('price'), services.get('mail'));
  }
));

export default priceModule;
