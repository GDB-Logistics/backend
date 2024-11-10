import { Server, Socket } from 'socket.io';
import { handleConnection } from "./services/ws/websocketService";

const io = new Server(Server);


// interface Client extends Socket {
//   userId?: string;
//   userType?: "admin" | "mobile" | "desktop";
// }

//Websocket setup
export const setupWebSocketServer = (server: any) => {
  io.listen(3000);
  console.log("WebSocket server is running");

  io.on("connection", handleConnection);
};
