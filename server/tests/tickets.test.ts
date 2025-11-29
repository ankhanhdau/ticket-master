import dotenv from 'dotenv';

// Load test environment variables before importing app and db
dotenv.config({ path: './.env' });

import app from '../src/app';
import request from 'supertest';
import db from '../src/db';

describe('Ticket API Endpoints', () => {
    it('retrieves all tickets', async () => {
        const res = await request(app)
            .get('/tickets')
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await db.end();
    });
});