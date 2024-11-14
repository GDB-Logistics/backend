import { Server, Socket } from 'socket.io';
import { handleConnection } from './services/ws/websocketService';

const io = new Server();
const PORT: number = Number(process.env.PORT) || 3030;

interface Client extends Socket {
    userId?: string;
    userType?: 'admin' | 'mobile' | 'desktop';
}

//Websocket setup
export const setupWebSocketServer = (server: any) => {
    io.listen(PORT);
    console.log('WebSocket server is running');
  const io = new Server(server, {
    cors: {
      origin: "*", // or specify your client's origin
      methods: ["GET", "POST"]
    }
  });

  io.listen(3000);
  console.log("WebSocket server is running");

    io.on('connection', handleConnection);
};
