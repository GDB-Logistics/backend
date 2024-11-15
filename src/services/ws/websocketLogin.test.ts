import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { handleConnection } from '../ws/websocketService';

describe('WebSocket Server', () => {
    const io: Server = new Server();
    let clientSocket: any;
    const PORT = 9000;

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

    test('should handle login event admin', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'admin' });
        clientSocket.on('message', (data: { status: number }) => {
            expect(data).toEqual({ status: 200 });
            done();
        });
    });

    test('should handle login event mobile', (done) => {
        clientSocket.emit('login', { userId: 'tamas', connectionType: 'mobile' });
        clientSocket.on('message', (data: { status: number }) => {
            expect(data).toEqual({ status: 200 });
            done();
        });
    });

    test('should handle login event error(Invalid request)', (done) => {
        const datas = [{ userId: 'user1' }, { connectionType: 'admin' }, {}];
        datas.forEach((loginData) => {
            clientSocket.emit('login', loginData);
            clientSocket.on('message', (data: any) => {
                    expect(data).toEqual({ status: 400, error: 'Invalid request' });
                });
            });
        done();
    });

    test('should handle login event error(Invalid connection type)', (done) => {
        clientSocket.emit('login', { userId: 'user1', connectionType: 'invalid' });
        clientSocket.on('message', (data: any) => {
            expect(data).toEqual({ status: 400, error: 'Invalid connection type' });
            done();
        });
    });
});
