import {Module} from '../../core/module/module';
import {FetchService} from './fetch.service';

const fetchModule = new Module('ALL', async ({services}) => {
  services.add('fetch', new FetchService());
});

export default fetchModule;
