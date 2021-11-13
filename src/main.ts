import {App} from './core/app';
import testModule from './modules/test/test.module';
import path from 'path';

const app = new App(path.join(__dirname, '../config'));

app.addModule(testModule);

app.start();
