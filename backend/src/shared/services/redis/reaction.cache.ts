import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@root/shared/globals/helpers/error.handler';
import { Helpers } from '@root/shared/globals/helpers/helpers';
import { IReactionDocument, IReactions } from '@root/features/reactions/interfaces/reaction.interface';

const log: Logger = config.createLogger('reactionsCache');

export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionsCache');
  }

  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReactions: IReactions,
    type: string,
    previousReaction: string
  ): Promise<void> {

    try{
      if(!this.client.isOpen){
        await this.client.connect();
      }

      // call remove reaction
      if (previousReaction){

      }

      if(type){
        await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction));
        const dataToSave: string[] = [`reactions`, JSON.stringify(postReactions)];
        await this.client.HSET(`posts:${key}`, dataToSave);
      }

    } catch(error){
      log.error(error);
      throw new ServerError('Server Error. Try again Please')
    }
  }

}
