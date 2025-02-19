import { IAuthJob } from "@root/features/auth/interfaces/auth.interface";
import { BaseQueue } from "./base.queue";

class AuthQueue extends BaseQueue {
  constructor(){
    super('auth');
  }

  public addAuthUserJob(name:string, data: IAuthJob): void{
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
