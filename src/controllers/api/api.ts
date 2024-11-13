import { Request, Response } from 'express';
import { pushNewWork } from '../../model/data';
import { broadcastNewWork } from '../../services/ws/websocketService';

export const newOrder = (req: Request, res: Response): void => {
    const userType = req.body.userType;
    const message = req.body.message;

    const numberOfWorker = pushNewWork(message);
    broadcastNewWork(numberOfWorker, message);
    res.status(201).json({ message: 'ok' });
};
