import {Module} from '../../core/module/module';
import {Route} from '../../core/routing/route';
import {TwigService} from '../twig/twig.service';
import {StockService} from '../price/stock.service';

const indexModule = new Module('ALL');

indexModule.addRoute(new Route(
  'ALL',
  'GET',
  '/',
  async (request, response, {services}) => {
    response.header('Content-Type', 'text/html');

    return services.get<TwigService>('twig').render(
      'index/index.html.twig', {
        stocks: await services.get<StockService>('stock').getAll()
      }
    );
  }
));


export default indexModule;
