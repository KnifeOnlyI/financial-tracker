import {AppContext} from '../context/app-context';

/**
 * Represent a cron
 */
export class Cron {
  /**
   * Represent a cron job
   *
   * @param context The context
   * @param expression The cron expression : '* * * * *'
   * @param onTick The callback executed when cron job should be executed
   */
  constructor(
    public readonly context: 'ALL' | 'PROD' | 'DEV',
    public readonly expression: string,
    public readonly onTick: (context: AppContext) => void
  ) {
  }
}
