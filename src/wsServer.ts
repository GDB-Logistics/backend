import { Server, Socket } from 'socket.io';
import { handleConnection } from './services/ws/websocketService';

const io = new Server();
// Remove the PORT constant as it is no longer needed

interface Client extends Socket {
    userId?: string;
    userType?: 'admin' | 'mobile' | 'desktop';
}

//Websocket setup
export const setupWebSocketServer = (server: any) => {
    io.attach(server);
    console.log('WebSocket server is running on the same port as the HTTP server');

    io.on('connection', handleConnection);
};

export default setupWebSocketServer;
