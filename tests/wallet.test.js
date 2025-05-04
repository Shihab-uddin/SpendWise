import request from 'supertest';
import app from '../src/app'; // Adjust if your Express app file is elsewhere
import { prisma } from '../src/prisma'; // Adjust import if needed

let authToken;
let testWalletId;

beforeAll(async () => {
  // Clear DB (optional, for test environment only)
  await prisma.user.deleteMany();
  await prisma.wallet.deleteMany();

  // Create a test user
  await request(app).post('/auth/register').send({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  });

  // Login to get token
  const loginRes = await request(app).post('/auth/login').send({
    email: 'testuser@example.com',
    password: 'password123',
  });

  authToken = loginRes.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Wallet API Tests', () => {
  it('should create a new wallet', async () => {
    const res = await request(app)
      .post('/wallet/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Wallet',
        description: 'My first test wallet',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Wallet');
    testWalletId = res.body.id;
  });

  it('should fetch all wallets for the user', async () => {
    const res = await request(app)
      .get('/wallet/list')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should not allow wallet access without token', async () => {
    const res = await request(app).get('/wallet/list');
    expect(res.statusCode).toBe(401);
  });

  it('should delete a wallet by ID', async () => {
    const res = await request(app)
      .delete(`/wallet/delete/${testWalletId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Wallet deleted successfully');
  });

  it('should return 404 for deleting non-existent wallet', async () => {
    const res = await request(app)
      .delete(`/wallet/delete/999999`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});
