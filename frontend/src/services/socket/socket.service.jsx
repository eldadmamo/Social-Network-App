import {io} from 'socket.io-client'

class SocketService{
    socket;

    setupSocketConnection(){
        this.socket = io(import.meta.env.VITE_REACT_APP_BASE_ENDPOINT, {
            transports: [`websocket`],
            secure: true
        });
        this.socketConnectionEvents();
    }

    socketConnectionEvents(){
        this.socket.on('connect', ()=> {
            console.log('connected')
        })

        this.socket.on('disconnect', (reason)=> {
            console.log(`Reason: ${reason}`)
            this.socket.connect();
        })

        this.socket.on('connect error', (error)=> {
            console.log(`Reason: ${error}`)
            this.socket.connect();
        })
    }
}

export const socketService = new SocketService();