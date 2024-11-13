import { Request, Response } from 'express';
import { pushNewWork } from '../../model/data';
import { broadcastToWebSocketClients } from '../../services/ws/websocketService';

export const newOrder = (req: Request, res: Response): void => {
    const userType = req.body.userType;
    const message = req.body.message;

    const numberOfWorker = pushNewWork(message);
    broadcastToWebSocketClients(numberOfWorker, message);
    res.status(201).json({ message: 'ok' });
};
