const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const User = require('../models/user.model');

// Use in-memory SQLite for tests
beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  await User.destroy({ where: {}, truncate: true });
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Pedro Test',
      email: 'pedro@test.com',
      password: 'secret123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'pedro@test.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should reject registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'pedro@test.com',
    });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('error', 'Validation failed');
  });

  it('should reject duplicate email', async () => {
    const payload = { name: 'Pedro', email: 'dup@test.com', password: 'secret123' };

    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Pedro Test',
      email: 'login@test.com',
      password: 'secret123',
    });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'secret123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('should return profile with valid token', async () => {
    const { body } = await request(app).post('/api/auth/register').send({
      name: 'Pedro Test',
      email: 'me@test.com',
      password: 'secret123',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'me@test.com');
  });

  it('should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
