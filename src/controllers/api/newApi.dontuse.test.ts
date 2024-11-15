import request from 'supertest';
import app from '../../server';

describe('API Tests', () => {
    test('POST /api/ - success', async () => {
        const response = await request(app).post('/api/').send({ order: 'testOrder' });
        expect(response.status).toBe(201);
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
        const response = await request(app).post('/api/nonexistent');
        expect(response.status).toBe(404);
    });
});
