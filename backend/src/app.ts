import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from '@root/config';
import Logger from 'bunyan'

const log: Logger = config.createLogger('app');

class Application {
  public initialze(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
    Application.handleExit();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`There was an uncaught error: ${error}`)
      Application.shutDownProperly(1);
    })
    process.on('unhandleRejection', (reason: Error) => {
      log.error(`unhandled rejection at promise: ${reason}`)
      Application.shutDownProperly(2);
    })
    process.on('SIGTERM', () => {
      log.error(`Caught SIGTERM`)
      Application.shutDownProperly(2);
    })
    process.on('SIGINT', () => {
      log.error(`Caught SIGINT`)
      Application.shutDownProperly(2);
    })
    process.on('exit' , () => {
      log.error(`Exiting`)
      Application.shutDownProperly(2);
    })
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
    .then(()=> {
      log.info('shutdown complete');
      process.exit(exitCode);
    })
    .catch((error) => {
      log.error(`Error during shutdown ${error}`);
    })
  }
}

const application: Application = new Application();
application.initialze();
