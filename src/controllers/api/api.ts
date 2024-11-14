import { Request, Response } from 'express';
import { pushNewWork } from '../../model/data';
import { broadcastNewWork } from '../../services/ws/websocketService';

export const newOrder = (req: Request, res: Response): void => {
  const order = req.body.order;

  const numberOfWorker = pushNewWork(order);
  broadcastNewWork(numberOfWorker, order);
  res.status(201).json({ message: "ok" });
};
