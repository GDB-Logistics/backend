import request from 'supertest';
import { app, createServer } from '../../server';

describe('API Tests', () => {
    const PORT = 9000;
    let server: any = createServer(PORT);

    beforeAll((done) => {
        done();
    });

    afterAll((done) => {
        server.close(done);
    });

    test('POST /api/ - success', async () => {
        const response = await request(app).post('/api/').send({ order: 'testOrder' });
        console.log(response.status);
        expect(response.status).toEqual(201);
    });

    test('POST /api/ - missing order', async () => {
        const response = await request(app).post('/api/').send({});
        expect(response.status).toBe(400);
    });

    test('POST /api/ - not string', async () => {
        const response = await request(app).post('/api/').send({ order: {} });
        expect(response.status).toBe(400);
    });

    test('GET /api/endpoint - not found', async () => {
        const response = await request(app).get('/api/nonexistent');
        expect(response.status).toBe(404);
    });
});
