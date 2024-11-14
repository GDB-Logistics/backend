import request from 'supertest';
import app from '../../server';

describe('API Tests', () => {
    test('GET /api/ - success', async () => {
        const response = await request(app).get('/api/');
        expect(response.status).toBe(200);
    });

    test('GET /api/endpoint - not found', async () => {
        const response = await request(app).get('/api/nonexistent');
        expect(response.status).toBe(404);
    });

    test('POST /api/endpoint - success', async () => {
        const response = await request(app).post('/api/endpoint').send({ key: 'value' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
    });
});
