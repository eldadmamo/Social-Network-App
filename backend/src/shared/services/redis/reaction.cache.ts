import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { find } from 'lodash';
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
        this.removePostReactionToCache(key, reaction.username, postReactions);
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

  public async removePostReactionToCache(
    key: string,
    username: string,
    postReactions: IReactions
  ): Promise<void> {

    try{
      if(!this.client.isOpen){
        await this.client.connect();
      }

      // call remove reaction
      const response: string[] = await this.client.LRANGE(`reactions:${key}`, 0, -1);
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction: IReactionDocument = this.getPreviousReaction(response, username) as IReactionDocument;
      multi.LREM(`reactions:${key}`,1, JSON.stringify(userPreviousReaction));
      await multi.exec();

      const dataToSave: string[] = [`reactions`, JSON.stringify(postReactions)];
        await this.client.HSET(`posts:${key}`, dataToSave);
    } catch(error){
      log.error(error);
      throw new ServerError('Server Error. Try again Please')
    }
  }

  private getPreviousReaction(response: string[], username: string): IReactionDocument | undefined {
    const list: IReactionDocument[] = [];
    for(const item of response){
      list.push(Helpers.parseJson(item) as IReactionDocument);
    }
    return find(list, (listItem:IReactionDocument) => {
      return listItem.username === username;
    })
  }

}
