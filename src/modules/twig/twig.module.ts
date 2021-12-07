import {Module} from '../../core/module/module';
import {TwigService} from './twig.service';

const twigModule = new Module('ALL', async ({configuration, services}) => {
  services.add('twig', new TwigService(configuration));
});

export default twigModule;
