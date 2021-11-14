import {Module} from '../../core/module/module';
import {MailService} from './mail.service';

const mailModule = new Module('ALL', ({configuration, services}) => {
  services.add('mail', new MailService(configuration));
});

export default mailModule;
