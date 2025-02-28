import express, {Router,Request,Response} from 'express';
import moment from 'moment';
import axios from 'axios';
import { Performance } from 'perf_hooks';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@root/config';

class HealthRoutes {
  private router: Router;

  constructor(){
    this.router = express.Router();
  }

  public health(): Router {
    this.router.get('/health', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.OK).send(`Health: Server instance is healthy with process if ${process.pid} on ${moment().format('LL')}`);
    });

    return this.router;
  }

  public env(): Router {
    this.router.get('/env', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.OK).send(`This is the ${config.NODE_ENV} enviroment`);
    });

    return this.router;
  }

  public instance(): Router {
    this.router.get('/instance', async (req: Request, res: Response) => {
      const response = await axios({
        method: 'get',
        url: config.EC2_URL
      })
      res.status(HTTP_STATUS.OK).send(`server is running on EC2 Instance with id ${response.data} and process id ${process.pid} on ${moment().format('LL')}`);
    });

    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();

