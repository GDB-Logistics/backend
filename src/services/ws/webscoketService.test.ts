import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { handleConnection } from '../ws/websocketService';

import request from 'supertest';
import app from '../../server';

describe('WebSocket Tests', () => {
    const io: Server = new Server();
    let serverSocket: any;
    let clientSocket: any;
    const PORT = 3090;

    beforeAll((done) => {
        io.listen(PORT);
        console.log('WebSocket server is running');
        io.on('connection', handleConnection);
        done();
    });

    afterAll(() => {
        io.close();
    });

    beforeEach((done) => {
        clientSocket = Client(`ws://localhost:${PORT}`);
        clientSocket.on('connect', done);
    });

    afterEach(() => {
        clientSocket.close();
    });

    //** Tests

    beforeEach((done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        clientSocket.on('message', (data: { status: number }) => {
          expect(data).toEqual({ status: 200 });
          done();
      });
    });

    test('should handle login event', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        clientSocket.on('message', (data: { status: number }) => {
          expect(data).toEqual({ status: 200 });
          done();
      });
    });

    test('should handle completed event', (done) => {
        clientSocket.emit('completed', { userId: 'user1', work: 'task1' });
        clientSocket.on('message', (data: { status: number }) => {
          expect(data).toEqual({ status: 200 });
          done();
      });
    });
});
