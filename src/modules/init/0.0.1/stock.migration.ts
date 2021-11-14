import {MigrationModel} from '../../migration/migration.model';

const stockMigration = new MigrationModel('stock-create');

stockMigration.addQuery(
  'CREATE TABLE "stock" (id SERIAL PRIMARY KEY, isin VARCHAR(255) UNIQUE NOT NULL, label VARCHAR(255) NOT NULL);'
);

export default stockMigration;
