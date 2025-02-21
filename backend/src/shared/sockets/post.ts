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
      console.log('Post socketio handler');
    })
  }
}

