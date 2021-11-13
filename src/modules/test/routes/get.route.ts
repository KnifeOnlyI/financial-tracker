import {Route} from '../../../core/routing/route';

const getRoute = new Route(
  'GET',
  '/',
  (request, response, {configuration, services}) => {
    return {
      NODE_ENV: services.get<string>('node.env'),
      MODULE_NAME: services.get<string>('module.name'),
      APP_TOKEN: configuration.get('appToken')
    };
  }
);

export default getRoute;
