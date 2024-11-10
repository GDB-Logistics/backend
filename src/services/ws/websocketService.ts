import { WebSocket } from "ws";
import { Request } from "express";

const adminClients = new Map<string | undefined, Client>();
const mobileClients = new Map<string | undefined, Client>();

interface Client extends WebSocket {
  userId: string;
  connectionType: "admin" | "mobile" | "desktop";
}

export const handleConnection = (ws: Client, req: Request) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.userId && data.connectionType) {
      ws.userId = data.userId;
      ws.connectionType = data.connectionType;
    }

    if (ws.connectionType === "admin") {
      adminClients.set(ws.userId, ws);
      ws.send("Welcome ADMIN!")!;
    } else if (ws.connectionType === "mobile") {
      mobileClients.set(ws.userId, ws);
      ws.send("Welcome MOBILE!")!;
    }
  });

  // Delete connection
  ws.on("close", () => {
    if (ws.connectionType === "admin") adminClients.delete(ws.userId);
    if (ws.connectionType === "mobile") mobileClients.delete(ws.userId);
  });
};

export const broadcastToWebSocketClients = (
  userType: "admin" | "mobile",
  userId: string,
  message: string
) => {
  adminClients.forEach((client) => {
    client.send(`Assigned ${message} order to: ${client.userId}`);
  });

  if (userType == "mobile") {
    mobileClients.get(userId)?.send(message);
  }
};
