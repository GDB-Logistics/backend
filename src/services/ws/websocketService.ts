import { Socket } from 'socket.io';
import { Request } from 'express';
import { removeCompletedWork } from '../../model/data';



const adminClients = new Map<string | undefined, Client>();
const mobileClients = new Map<string | undefined, Client>();

interface Client extends Socket {
    userId?: string;
    connectionType?: 'admin' | 'mobile';
    isAlive?: boolean;
}

export const handleConnection = (io: Client) => {

    // Handle login from client
    io.on('login', (data: { userId: string; connectionType: 'admin' | 'mobile' }) => {
        const { userId, connectionType } = data;

        if (connectionType === 'admin') {
            adminClients.set(userId, io);
        } else if (connectionType === 'mobile') {
            mobileClients.set(userId, io);
        }

        io.send({ status: 200 });
    });

    // Handle work completion
    io.on('completed', (data: { userId: string; work: string }) => {
        const { userId, work } = data;
        removeCompletedWork(userId, work);
        broadcastFinishedWork(work);
        io.send({ status: 200 });
    });

    // Delete connection
    io.on('close', () => {
        if (io.connectionType === 'admin') adminClients.delete(io.userId);
        if (io.connectionType === 'mobile') mobileClients.delete(io.userId);
    });
};

export const broadcastFinishedWork = (work: string): void => {
    adminClients.forEach((client) => {
        client.emit('workCompleted', work);
    });
};

export const broadcastNewWork = (userId: string, work: string) => {
    adminClients.forEach((client) => {
        client.emit('newWork', { userId, work });
    });

    mobileClients.get(userId)?.emit('newWork', work);
};
