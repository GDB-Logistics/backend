import { Server, Socket } from 'socket.io';
import { handleConnection } from "./services/ws/websocketService";




 interface Client extends Socket {
   userId?: string;
   userType?: "admin" | "mobile" | "desktop";
}

//Websocket setup
export const setupWebSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // or specify your client's origin
      methods: ["GET", "POST"]
    }
  });

  io.listen(3000);
  console.log("WebSocket server is running");

  io.on("connection", handleConnection);
};
