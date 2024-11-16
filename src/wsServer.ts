import { Server, Socket } from 'socket.io';
import { handleConnection } from './services/ws/websocketService';

const io = new Server();
const PORT: number = Number(process.env.PORT) || 3020;

interface Client extends Socket {
    userId?: string;
    userType?: 'admin' | 'mobile' | 'desktop';
}

//Websocket setup
export const setupWebSocketServer = (server: any) => {
    io.listen(PORT);
    console.log('WebSocket server is running');

    io.on('connection', handleConnection);
};

export default setupWebSocketServer;
