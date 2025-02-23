import { IUserDocument } from '@root/features/user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import Logger from 'bunyan';
import { find } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@root/shared/globals/helpers/error.handler';
import { Helpers } from '@root/shared/globals/helpers/helpers';
import { IReactionDocument, IReactions } from '@root/features/reactions/interfaces/reaction.interface';

const log:Logger = config.createLogger('commentsCache')


export class CommentCache extends BaseCache {
  constructor(){
    super('commentsCache')
  }

  public async savePostCommentToCache(postId: string, value: string): Promise<void> {
    try{
      if(!this.client.isOpen){
        await this.client.connect();
      }
      await this.client.LPUSH(`comments:${postId}`, value);
      const commentsCount: string[] = await this.client.HMGET(`posts:${postId}`, 'commentsCache');
      let count: number = Helpers.parseJson(commentsCount[0]) as number;

    }catch(error){
      log.error(error);
      throw new ServerError('Server error. Try again')
    }
  }


}
