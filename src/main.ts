import {App} from './core/app';
import path from 'path';
import priceModule from './modules/price/price.module';
import fetchModule from './modules/fetch/fetch.module';
import mailModule from './modules/mail/mail.module';
import databaseModule from './modules/database/database.module';
import initModule from './modules/init/init.module';
import migrationModule from './modules/migration/migration.module';
import twigModule from './modules/twig/twig.module';

const app = new App(path.join(__dirname, '../config'));

app.addModule(databaseModule);
app.addModule(migrationModule);
app.addModule(initModule);
app.addModule(fetchModule);
app.addModule(mailModule);
app.addModule(twigModule);
app.addModule(priceModule);

app.start();

