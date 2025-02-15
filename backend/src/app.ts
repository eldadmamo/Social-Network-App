import express, {Express} from 'express'
import { ChattyServer } from './setupServer'
import databaseConnection from './setupDatabase'

class Application {
    public initialze(): void {
        databaseConnection();
        const app: Express = express();
        const server: ChattyServer = new ChattyServer(app);
        server.start();
    }
}

const application: Application = new Application();
application.initialze();