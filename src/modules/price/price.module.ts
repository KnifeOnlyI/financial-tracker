import {Module} from '../../core/module/module';
import {PriceService} from './price.service';
import {Route} from '../../core/routing/route';
import {Cron} from '../../core/cron/cron';
import {MailService} from '../mail/mail.service';
import Configuration from '../../core/configuration/configuration';
import {Services} from '../../core/services/services';

const priceModule = new Module('ALL', ({services}) => {
  services.add('price', new PriceService(services.get('fetch')));
});

/**
 * Send all prices to receivers
 *
 * @param configuration The configuration
 * @param services The services
 */
async function sendPrices(configuration: Configuration, services: Services): Promise<void> {
  const prices = new Array<{ isin: string, price: number }>();
  const isinList = configuration.get<Array<string>>('isin');

  // Get all prices
  for (let i = 0; i < isinList.length; i++) {
    prices.push({isin: isinList[i], price: await services.get<PriceService>('price').getPrice(isinList[i])});
  }

  // Build HTML
  let body = '<h1>Prices</h1><ul>';
  prices.forEach(price => {
    body += `<li>${price.isin} = ${price.price}</li>`;
  });
  body += '</ul>';

  // Send emails
  configuration.get<string>('emails.receivers').split(',').forEach(receiver => {
    services.get<MailService>('mail').sendMail(
      configuration.get<string>('emails.sender.from'),
      receiver,
      'Financial Tracker - NEWS',
      body
    );
  });
}

priceModule.addRoute(new Route(
  'DEV',
  'GET',
  '/send-prices',
  (request, response, {configuration, services}) => {
    sendPrices(configuration, services);

    return null;
  }
));

priceModule.addCron(new Cron(
  'ALL',
  '0 17 * * 1-5', // At 17:00 on every day-of-week from Monday through Friday.
  ({configuration, services}) => {
    sendPrices(configuration, services);
  }
));

export default priceModule;
