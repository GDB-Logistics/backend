import { Server } from 'socket.io';
import Client from 'socket.io-client';
import request from 'supertest';
import { createServer } from '../../server';
import { handleConnection } from '../ws/websocketService';
import { resetData } from '../../model/data';

import { pushNewWork } from '../../model/data';
import {broadcastNewWork} from '../../services/ws/websocketService';

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
            clientSocket.on('newWork-mobile', (data: { work: string }) => {
                expect(data).toEqual({ work: 'testOrder' });
                done();
            });
        });
    });

    test('should handle completed work', (done) => {
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
            clientSocket.emit('completed', { userId: 'abraham', work: 'testOrder' });
        });
        clientSocket.on('completed-response', (data: { status: number }) => {
            expect(data).toEqual({ status: 200 });
            done();
        });
    });
});

describe('WebSocket Tests for multiple clients', () => {
    let io: Server;
    let clientSocketAdmin: any;
    let clientSocketAbraham: any;
    let clientSocketEndre: any;
    let clientSocketTamas: any;
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
        jest.setTimeout(30000);
        clientSocketAdmin = Client(`http://localhost:${PORT}`);
        clientSocketAdmin.on('connect', () => {
            clientSocketAbraham = Client(`http://localhost:${PORT}`);
            clientSocketAbraham.on('connect', () => {
                clientSocketEndre = Client(`http://localhost:${PORT}`);
                clientSocketEndre.on('connect', () => {
                    clientSocketTamas = Client(`http://localhost:${PORT}`);
                    clientSocketTamas.on('connect', () => {
                        clientSocketAdmin.emit('login', {
                            userId: 'user1',
                            connectionType: 'admin',
                        });
                        clientSocketAbraham.emit('login', {
                            userId: 'abraham',
                            connectionType: 'mobile',
                        });
                        clientSocketEndre.emit('login', {
                            userId: 'endre',
                            connectionType: 'mobile',
                        });
                        clientSocketTamas.emit('login', {
                            userId: 'tamas',
                            connectionType: 'mobile',
                        });
                        clientSocketTamas.on('login-response', () => {
                            done();
                        });
                    });
                });
            });
        });
    });

    afterEach((done) => {
        clientSocketAdmin.disconnect();
        clientSocketAbraham.disconnect();
        clientSocketEndre.disconnect();
        clientSocketTamas.disconnect();
        resetData();
        done();
    });

    test('should handle getting newWork to admin and the 3 cliens', (done) => {
        const sentData = ['testOrder1', 'testOrder2', 'testOrder3'];
        const datas: Array<{ userId: string; work: string }> = [];
        const expectedData = [
            { userId: 'abraham', work: 'testOrder1' },
            { userId: 'endre', work: 'testOrder2' },
            { userId: 'tamas', work: 'testOrder3' },
        ];

        clientSocketAbraham.on('newWork-mobile', (data: { work: string }) => {
            console.log('abraham', data);
            expect(data).toEqual({ work: 'testOrder1' });
        });
        clientSocketEndre.on('newWork-mobile', (data: { work: string }) => {
            console.log('endre', data);
            expect(data).toEqual({ work: 'testOrder2' });
        });
        clientSocketTamas.on('newWork-mobile', (data: { work: string }) => {
            console.log('tamas', data);
            expect(data).toEqual({ work: 'testOrder3' });
        });

        clientSocketAdmin.on('newWork-admin', (data: { userId: string; work: string }) => {
            console.log('admin', data);
            datas.push(data);
            if (datas.length === 3) {
                expect(datas).toEqual(expectedData);
                done();
            }
        });

        // Kikeruli az apit mivel a timing nem megfelelo a testekhez
        sentData.forEach((data) => {
            console.log('sending', data);
            // request(server).post('/api/').send({ order: data }).expect(201);
            broadcastNewWork(pushNewWork(data), data);
        });
    });

    test('should handle getting newWork to admin and the 3 cliens and sending compleated events', (done) => {
        const sentData = ['testOrder1', 'testOrder2', 'testOrder3'];
        const datas: Array<{ userId: string; work: string }> = [];
        const expectedData = [
            { userId: 'abraham', work: 'testOrder1' },
            { userId: 'endre', work: 'testOrder2' },
            { userId: 'tamas', work: 'testOrder3' },
            { userId: 'tamas', work: 'testOrder4' },
        ];

        clientSocketAbraham.on('newWork-mobile', (data: { work: string }) => {
            console.log('abraham', data);
            expect(data).toEqual({ work: 'testOrder1' });
        });
        clientSocketEndre.on('newWork-mobile', (data: { work: string }) => {
            console.log('endre', data);
            expect(data).toEqual({ work: 'testOrder2' });
        });
        clientSocketTamas.on('newWork-mobile', (data: { work: string }) => {
            console.log('tamas', data);
            expect(data).toEqual({ work: 'testOrder3' });
            clientSocketTamas.emit('completed', { userId: 'tamas', work: 'testOrder3' });
        });

        clientSocketAdmin.on('newWork-admin', (data: { userId: string; work: string }) => {
            console.log('admin', data);
            datas.push(data);
            if (datas.length === 4) {
                expect(datas).toEqual(expectedData);
                done();
            }
        });

        clientSocketAdmin.on('workCompleted', (data: {userId:string, work: string }) => {
            expect(data).toEqual({ userId: 'tamas', work: 'testOrder3' });
            broadcastNewWork(pushNewWork("testOrder4"), "testOrder4");
        });

        // Kikeruli az apit mivel a timing nem megfelelo a testekhez
        sentData.forEach((data) => {
            console.log('sending', data);
            // request(server).post('/api/').send({ order: data }).expect(201);
            broadcastNewWork(pushNewWork(data), data);
        });
    });
});
