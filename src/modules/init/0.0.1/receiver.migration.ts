import {MigrationModel} from '../../migration/migration.model';

const receiverMigration = new MigrationModel('receiver-create');

receiverMigration.addQuery(
  'CREATE TABLE "receiver" (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, name VARCHAR(255) NOT NULL);'
);

export default receiverMigration;
