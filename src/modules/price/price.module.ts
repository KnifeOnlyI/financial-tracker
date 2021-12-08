import {Module} from '../../core/module/module';
import {StockService} from './stock.service';
import {Cron} from '../../core/cron/cron';
import {MailService} from '../mail/mail.service';
import {Configuration} from '../../core/configuration/configuration';
import {DatabaseService} from '../database/database.service';
import {Route} from '../../core/routing/route';
import {StockModel} from './stock.model';
import {ReceiverModel} from './receiver.model';
import {TwigService} from '../twig/twig.service';

const priceModule = new Module('ALL', async ({services}) => {
  services.add('stock', new StockService(services.get('database'), services.get('fetch')));

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
  (request, response, {configuration, services}) => {
    sendPrices(configuration, services.get('database'), services.get('stock'), services.get('mail'), services.get('twig'));

    return {};
  }
));

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
 * @param stockService The price service
 * @param mailService The mail service
 * @param twigService The twig service
 */
async function sendPrices(
  configuration: Configuration,
  databaseService: DatabaseService,
  stockService: StockService,
  mailService: MailService,
  twigService: TwigService
): Promise<void> {
  Promise.allSettled([
    stockService.getAll(),
    getReceivers(databaseService)]
  ).then((results: Array<any>) => {
    const stocks = results[0].value as Array<StockModel>;
    const receivers = results[1].value as Array<ReceiverModel>;

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
  }).catch((error) => {
    console.error('Error', error);
  });
}

priceModule.addCron(new Cron(
  'ALL',
  '0 17 * * 1-5', // At 17:00 on every day-of-week from Monday through Friday.
  async ({configuration, services}) => {
    await sendPrices(configuration, services.get('database'), services.get('stock'), services.get('mail'), services.get('twig'));
  }
));

export default priceModule;
