import {Module} from '../../core/module/module';
import {PriceService} from './price.service';
import {Cron} from '../../core/cron/cron';
import {MailService} from '../mail/mail.service';
import {Configuration} from '../../core/configuration/configuration';
import {DatabaseService} from '../database/database.service';
import {Route} from '../../core/routing/route';
import {StockModel} from './stock.model';
import {ReceiverModel} from './receiver.model';
import {TwigService} from '../twig/twig.service';

const priceModule = new Module('ALL', async ({services}) => {
  services.add('price', new PriceService(services.get('fetch')));

  // Add the 'price' twig filter
  services.get<TwigService>('twig').addFilter(
    'price',
    (left => left?.toFixed(3).replace('.', ','))
  );
});

priceModule.addRoute(new Route(
  'DEV',
  'GET',
  '/prices',
  async (request, response, {configuration, services}) => {
    sendPrices(configuration, services.get('database'), services.get('price'), services.get('mail'), services.get('twig'));

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
 * Send all prices to receivers
 *
 * @param configuration The configuration
 * @param databaseService The database service
 * @param priceService The price service
 * @param mailService The mail service
 * @param twigService The twig service
 */
async function sendPrices(
  configuration: Configuration,
  databaseService: DatabaseService,
  priceService: PriceService,
  mailService: MailService,
  twigService: TwigService
): Promise<void> {
  const stocks = await getStockPrices(databaseService, priceService);
  const receivers = await getReceivers(databaseService);

  if (stocks.length > 0) {
    // Send emails
    receivers.forEach(receiver => {
      mailService.sendMail(
        configuration.get<string>('emails.sender.from'),
        receiver.email,
        'Financial Tracker - NEWS',
        twigService.render('email/email.html.twig', {receiver, stocks})
      );
    });
  }
}

priceModule.addCron(new Cron(
  'ALL',
  '0 17 * * 1-5', // At 17:00 on every day-of-week from Monday through Friday.
  async ({configuration, services}) => {
    await sendPrices(configuration, services.get('database'), services.get('price'), services.get('mail'), services.get('twig'));
  }
));

export default priceModule;
