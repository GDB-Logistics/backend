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
        console.log('login', userId, connectionType);
        if (!userId || !connectionType) {
            io.emit('login-response', { status: 400, error: 'Invalid request' });
            return;
        }

        if (connectionType === 'admin') {
            adminClients.set(userId, io);
        } else if (connectionType === 'mobile') {
            mobileClients.set(userId, io);
        } else {
            io.emit('login-response', { status: 400, error: 'Invalid connection type' });
            return;
        }

        io.userId = userId;
        io.connectionType = connectionType;
        io.emit('login-response', { status: 200 });
    });

    // Handle work completion
    io.on('completed', (data: { userId: string; work: string }) => {
        try {
            const { userId, work } = data;

            if (!userId || !work) {
                io.emit('completed-response', { status: 400, error: 'Invalid request' });
                return;
            }

            removeCompletedWork(userId, work);
            broadcastFinishedWork(userId, work);
            io.emit('completed-response', { status: 200 });
        } catch (e) {
            io.emit('completed-response', { status: 500, error: 'Internal Server Error' });
        }
    });

    // Delete connection
    io.on('close', () => {
        if (io.connectionType === 'admin') adminClients.delete(io.userId);
        if (io.connectionType === 'mobile') mobileClients.delete(io.userId);
    });
};

export const broadcastFinishedWork = (userId: string, work: string): void => {
    adminClients.forEach((client) => {
        client.emit('workCompleted', {userId:userId, work: work });
    });
};

//? bug a mobile kuldesben nem talalja a testekben
export const broadcastNewWork = (userId: string, work: string) => {
    console.log(`Broadcasting new work: ${work} to admin and user: ${userId}`);
    adminClients.forEach((client) => {
        client.emit('newWork-admin', { userId: userId, work: work });
    });

    mobileClients.get(userId)?.emit('newWork-mobile', { work: work });
};
