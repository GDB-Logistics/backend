import { Server, Socket } from "socket.io";
import { Request } from "express";

const adminClients = new Map<string | undefined, Client>();
const mobileClients = new Map<string | undefined, Client>();

interface Client extends Socket {
  userId: string;
  connectionType: "admin" | "mobile" | "desktop";
}

export const handleConnection = (io: Client, req: Request) => {
  // Handle login from client
  io.on("login", (message : string) => {});

  // Handle work completion
  io.on("completed", (message: string) => {});

  io.on("message", (message: string) => {
    const data = JSON.parse(message.toString());

    if (data.userId && data.connectionType) {
      io.userId = data.userId;
      io.connectionType = data.connectionType;
    }

    if (io.connectionType === "admin") {
      adminClients.set(io.userId, io);
      io.send("Welcome ADMIN!")!;
    } else if (io.connectionType === "mobile") {
      mobileClients.set(io.userId, io);
      io.send("Welcome MOBILE!")!;
    }
  });

  // Delete connection
  io.on("close", () => {
    if (io.connectionType === "admin") adminClients.delete(io.userId);
    if (io.connectionType === "mobile") mobileClients.delete(io.userId);
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
