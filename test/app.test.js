import app from '#src/app.js';
import request from 'supertest';
describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Health is perfect');
      expect(res.body).toHaveProperty('status', 'Ok');
      expect(res.body).toHaveProperty('timestamps');
      expect(res.body).toHaveProperty('uptime');
    });
  });
  describe('GET /api', () => {
    it('should return API message ', async () => {
      const res = await request(app).get('/api');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Acquisition running perfectly');
    });
  });
  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent route ', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Route not found');
    });
  });
});
