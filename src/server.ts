import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"
import http from "http";
import apiRoute from "./routes/api";
import { setupWebSocketServer } from "./wsServer";

const app: Application = express();
const port = 8080;

const server = http.createServer(app);

setupWebSocketServer(server);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRoute);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
