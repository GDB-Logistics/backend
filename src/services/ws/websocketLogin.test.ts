import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { setupWebSocketServer } from '../../wsServer';

describe('WebSocket Login Tests', () => {
    let io: Server;
    let serverSocket: any;
    let clientSocket: any;
    const PORT = 3060;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        setupWebSocketServer(httpServer);
        httpServer.listen(PORT, () => {
            clientSocket = Client(`ws://localhost:${PORT}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('should handle login event', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });

        clientSocket.on('message', (data: { status: number }) => {
            expect(data.status).toBe(200);
            done();
        });
    });
});