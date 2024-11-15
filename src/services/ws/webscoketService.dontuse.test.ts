import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { setupWebSocketServer } from '../../wsServer';

describe('WebSocket Tests', () => {
    let io: Server;
    let serverSocket: any;
    let clientSocket: any;
    const PORT = 3090;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        setupWebSocketServer(httpServer);
        httpServer.listen(PORT, () => {
            clientSocket = Client(`http://localhost:${PORT}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    beforeEach((done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        serverSocket.on('login', (data: { status: number }) => {
            if (data.status === 200) {
                done();
            }
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('should handle login event', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        serverSocket.on('login', (data : {status : number}) => {
            expect(data).toEqual({ status : 200 });
            done();
        });
    });

    test('should handle completed event', (done) => {
        clientSocket.emit('completed', { userId: 'user1', work: 'task1' });
        serverSocket.on('completed', (data) => {
            expect(data).toEqual({ userId: 'user1', work: 'task1' });
            done();
        });
    });
});