import {Module} from '../../core/module/module';
import {MigrationService} from '../migration/migration.service';
import stockMigration from './0.0.1/stock.migration';
import receiverMigration from './0.0.1/receiver.migration';
import {DatabaseService} from '../database/database.service';

const initModule = new Module('ALL', async ({services}) => {
  await services.get<MigrationService>('migration').executeMigrations([
    stockMigration,
    receiverMigration,
  ]).catch((err) => {
    services.get<DatabaseService>('database').query('ROLLBACK');
    console.log('MIGRATION ERROR :', err);
  });
});

export default initModule;
