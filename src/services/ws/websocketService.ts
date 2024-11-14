import { Socket } from 'socket.io';
import { Request } from 'express';
import { removeCompletedWork } from '../../model/data';

// const PING_INTERVAL = 30000;

const adminClients = new Map<string | undefined, Client>();
const mobileClients = new Map<string | undefined, Client>();

interface Client extends Socket {
    userId?: string;
    connectionType?: 'admin' | 'mobile';
}

export const handleConnection = (io: Client) => {
    // Keeping connection alive
    // io.isAlive = true;

    // io.on('pong', () => {
    //     io.isAlive = true;
    // });

    // const interval = setInterval(() => {
    //     if (!io.isAlive) {
    //         clearInterval(interval);
    //         io.terminate();
    //         return;
    //     }

    //     io.isAlive = false;
    //     io.ping();
    // }, PING_INTERVAL);

    // io.on('close', () => {
    //     clearInterval(interval);
    // });


    // Handle login from client
    io.on('login', (data: { userId: string; connectionType: 'admin' | 'mobile' }) => {
      console.log("login event")
        const { userId, connectionType } = data;

        if (io.connectionType === 'admin') {
            adminClients.set(io.userId, io);
            io.send('Welcome ADMIN!')!;
        } else if (io.connectionType === 'mobile') {
            mobileClients.set(io.userId, io);
            io.send('Welcome MOBILE!')!;
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
        client.send(`${work} is finsihed!`);
    });
};

export const broadcastNewWork = (userId: string, work: string) => {
    adminClients.forEach((client) => {
        client.send(`Assigned ${work} order to: ${userId}`);
    });

    mobileClients.get(userId)?.send(work);
};
