import {Module} from '../../core/module/module';
import {MigrationService} from './migration.service';
import {DatabaseService} from '../database/database.service';

const migrationModule = new Module('ALL', async ({services}) => {
  services.add('migration', new MigrationService(services.get<DatabaseService>('database')));
});

export default migrationModule;
