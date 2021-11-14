import {App} from './core/app';
import path from 'path';
import priceModule from './modules/price/price.module';
import fetchModule from './modules/fetch/fetch.module';
import mailModule from './modules/mail/mail.module';

const app = new App(path.join(__dirname, '../config'));

app.addModule(mailModule);
app.addModule(fetchModule);
app.addModule(priceModule);

app.start();

