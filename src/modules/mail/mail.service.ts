import nodemailer, {Transporter} from 'nodemailer';
import Configuration from '../../core/configuration/configuration';

/**
 * Service to manage a mails
 *
 * @author Dany Pignoux (dany.pignoux@outlook.fr)
 */
export class MailService {
  /**
   * The handle transporter
   */
  private readonly _transporter: Transporter;

  /**
   * Create a new mail service
   *
   * @param configuration The configuration
   */
  constructor(configuration: Configuration) {
    this._transporter = nodemailer.createTransport({
      port: configuration.get('emails.sender.port'),
      host: configuration.get('emails.sender.host'),
      auth: {
        user: configuration.get('emails.sender.username'),
        pass: configuration.get('emails.sender.password')
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Send an email
   *
   * @param from From email
   * @param to To email
   * @param subject The subject
   * @param body The body
   */
  sendMail(from: string, to: string, subject: string, body: string) {
    this._transporter.sendMail({from, to, subject, text: body, html: body}, error => {
      if (error) {
        throw new Error(`Cannot send email because : ${error}`);
      }
    });
  }
}
