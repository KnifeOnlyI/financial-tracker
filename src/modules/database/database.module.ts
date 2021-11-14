import {Module} from '../../core/module/module';
import {DatabaseService} from './database.service';

const databaseModule = new Module('ALL', async ({configuration, services}) => {
  services.add('database', new DatabaseService(configuration));
});

export default databaseModule;
