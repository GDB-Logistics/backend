import { WebSocketServer, WebSocket } from "ws";
import express from "express";

import api from "../routes/api";

const EXPRESSPORT = 3000;
const WSPORT = 8080;
const app = express();
const wss = new WebSocketServer({ port: WSPORT });

console.log(`WebSocket server is running on ws://localhost:${WSPORT}`);

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

app.use("/api", api);

app.listen(EXPRESSPORT, () => {
  console.log(`server listens on port http://localhost:${EXPRESSPORT}`);
});
