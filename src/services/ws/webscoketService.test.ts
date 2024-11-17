import { Server } from 'socket.io';
import Client from 'socket.io-client';
import request from 'supertest';
import { createServer } from '../../server';
import { handleConnection } from '../ws/websocketService';

describe('WebSocket Tests for single client', () => {
    let io: Server;
    let clientSocket: any;
    const PORT = 9000;
    let server: any;

    beforeAll((done) => {
        console.log('beforeAll');
        server = createServer(PORT);
        io = new Server(server);
        io.on('connection', handleConnection);
        console.log('end beforeAll');
        done();
    });

    afterAll((done) => {
        console.log('afterAll');
        io.close();
        server.close(done);
        console.log('end afterAll');
    });

    beforeEach((done) => {
        console.log('beforeEach');
        clientSocket = Client(`ws://localhost:${PORT}`);
        clientSocket.on('connect', done);
        console.log('end beforeEach');
    });

    afterEach((done) => {
        console.log('afterEach');
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
        console.log('end afterEach');
        done();
    });

    test('should handle getting newWork to admin', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        clientSocket.on('login-response', (data: { status: number }) => {
            console.log('Received login-response from WebSocket:', data);
            request(server)
                .post('/api/')
                .send({ order: 'testOrder' })
                .expect(201)
                .end((err) => {
                    if (err) {
                        console.error('Error creating order:', err);
                        return done(err);
                    } else {
                        console.log('Order created successfully');
                    }
                });
        });
        clientSocket.on('newWork.admin', (data: { userId: string; work: string }) => {
            console.log(`newWork event received with userId: ${data.userId} and work: ${data.work}`);
            expect(data).toEqual({ userId: 'abraham', work: 'testOrder' });
            done();
        });
    }, 10000);

    test('should handle getting newWork to mobile', (done) => {
        clientSocket.emit('login', { userId: 'abraham', connectionType: 'mobile' });
        clientSocket.on('login-response', (data: { status: number }) => {
            console.log('Received login-response from WebSocket:', data);
            request(server)
                .post('/api/')
                .send({ order: 'testOrder' })
                .expect(201)
                .end((err) => {
                    if (err) {
                        console.error('Error creating order:', err);
                        return done(err);
                    } else {
                        console.log('Order created successfully');
                    }
                });
        });
        clientSocket.on('newWork-mobile', (data: { work: string }) => {
            console.log(`newWork event received the work: ${data.work}`);
            expect(data).toEqual({ work: 'testOrder' });
            done();
        });
    }, 10000);
});