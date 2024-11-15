import { Request, Response } from 'express';
import { pushNewWork } from '../../model/data';
import { broadcastNewWork } from '../../services/ws/websocketService';

export const newOrder = (req: Request, res: Response): void => {
    try{
        const order : string = req.body.order;
        if(!order) {res.status(400).json({ message: 'order is required' }); return;}
        if(typeof order !== 'string') {res.status(400).json({ message: 'order must be a string' }); return;}
    
        const numberOfWorker = pushNewWork(order);
        broadcastNewWork(numberOfWorker, order);
        res.status(201).json({ message: 'ok' });
    }catch(e){
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
