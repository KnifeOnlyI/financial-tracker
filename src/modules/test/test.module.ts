import {Module} from '../../core/module/module';
import getRoute from './routes/get.route';
import {Cron} from '../../core/cron/cron';

const testModule = new Module('ALL', ({services, crons}) => {
  services.add('module.name', 'test');
  crons.push(new Cron('* * * * *', ({services}) => {
    console.log('NODE_ENV :', services.get<string>('node.env'));
  }));
});

testModule.addRoute(getRoute);

export default testModule;
