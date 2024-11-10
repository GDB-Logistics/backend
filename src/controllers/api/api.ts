import { Request, Response } from "express";
import { broadcastToWebSocketClients } from "../../services/ws/websocketService";

export const newOrder = (req: Request, res: Response): void => {
  const userType = req.body.userType;
  const message = req.body.message;
  broadcastToWebSocketClients(userType, message);
  res.status(201).json({ message: "ok" });
};
