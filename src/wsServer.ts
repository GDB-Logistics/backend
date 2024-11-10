import { WebSocketServer, WebSocket } from "ws";
import { handleConnection } from "./services/ws/websocketService";

interface Client extends WebSocket {
  userId?: string;
  userType?: "admin" | "mobile" | "desktop";
}

//Websocket setup
export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocketServer({ server });
  console.log("WebSocket server is running");

  wss.on("connection", handleConnection);
};
