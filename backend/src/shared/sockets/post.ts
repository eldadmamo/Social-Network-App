import { ICommentDocument } from "@root/features/comment/interfaces/comment.interface";
import { IReactionDocument } from "@root/features/reactions/interfaces/reaction.interface";
import { Server, Socket } from "socket.io";


export let SocketIOPostObject: Server;

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server){
    this.io = io;
    SocketIOPostObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('reaction', (reaction: IReactionDocument) => {
        this.io.emit('update like', reaction);
      });

      socket.on('reaction', (data: ICommentDocument) => {
        this.io.emit('update comment', data);
      });
    })
  }
}

