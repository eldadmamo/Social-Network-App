import { Server, Socket } from "socket.io";

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server){
    this.io = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log('Post socketio handler');
    })
  }
}
