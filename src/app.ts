import { WebSocketServer, WebSocket } from "ws";
import express from "express";

const PORT = 8080;
const app = express()
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  ws.send("Welcome to my websocket!");
  ws.on("message", (message: string) => {
    console.log(`Recived: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
