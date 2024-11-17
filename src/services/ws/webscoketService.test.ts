import { Server } from 'socket.io';
import Client from 'socket.io-client';
import request from 'supertest';
import { createServer } from '../../server';
import { handleConnection } from '../ws/websocketService';
import {resetData} from '../../model/data';

describe('WebSocket Tests for single client', () => {
    let io: Server;
    let clientSocket: any;
    const PORT = 9000;
    let server: any;

    beforeAll((done) => {
        server = createServer(PORT);
        io = new Server(server);
        io.on('connection', handleConnection);
        done();
    });

    afterAll((done) => {
        io.close();
        server.close(done);
    });

    beforeEach((done) => {
        clientSocket = Client(`http://localhost:${PORT}`);
        clientSocket.on('connect', done);
    });

    afterEach((done) => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
        resetData();
        done();
    });

    test('should handle getting newWork to admin', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        clientSocket.on('login-response', (data: { status: number }) => {
            request(server)
                .post('/api/')
                .send({ order: 'testOrder' })
                .expect(201)
                .end((err) => {
                    if (err) {
                        console.error('Error creating order:', err);
                        return done(err);
                    }
                });
        });
        clientSocket.on('newWork-admin', (data: { userId: string; work: string }) => {
            expect(data).toEqual({ userId: 'abraham', work: 'testOrder' });
            done();
        });
    });

    test('should handle getting newWork to mobile', (done) => {
        clientSocket.emit('login', { userId: 'abraham', connectionType: 'mobile' });
        clientSocket.on('login-response', (data: { status: number }) => {
            request(server)
                .post('/api/')
                .send({ order: 'testOrder' })
                .expect(201)
                .end((err) => {
                    if (err) {
                        console.error('Error creating order:', err);
                        return done(err);
                    } else {
                    }
                });
        });
        clientSocket.on('newWork-mobile', (data: { work: string }) => {
            expect(data).toEqual({ work: 'testOrder' });
            done();
        });
    });
});
