import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { find } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@root/shared/globals/helpers/error.handler';

const log: Logger = config.createLogger('followersCache');

export class FollowerCache extends BaseCache {
  constructor() {
    super('followersCache');
  }

  public async saveFollowerToCache(key: string, value: string): Promise<void> {
   try{
    if(!this.client.isOpen){
          await this.client.connect();
      }

      await this.client.LPUSH(key, value);
    } catch(error){
      log.error(error);
      throw new ServerError('Server Error. Try again Please')
    }
  }

  public async removeFollowerFromCache(key: string, value: string): Promise<void> {
    try{
     if(!this.client.isOpen){
           await this.client.connect();
       }

       await this.client.LREM(key, 1, value);
     } catch(error){
       log.error(error);
       throw new ServerError('Server Error. Try again Please')
     }
   }

   public async updateFollowersCountInCache(userId: string, prop: string, value: number): Promise<void> {
    try{
     if(!this.client.isOpen){
           await this.client.connect();
       }
       await this.client.HINCRBY(`users:${userId}`, prop, value);
     } catch(error){
       log.error(error);
       throw new ServerError('Server Error. Try again Please')
     }
   }
}
