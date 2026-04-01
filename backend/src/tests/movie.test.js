const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const Movie = require('../models/movie.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');

let adminToken;
let userToken;
let categoryId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });

  const category = await Category.create({ name: 'Action', slug: 'action' });
  categoryId = category.id;

  // Criar usuário e promover a admin via Sequelize (não raw SQL)
  await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
  });
  await User.update({ role: 'admin' }, { where: { email: 'admin@test.com' } });

  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: 'admin123',
  });
  adminToken = adminLogin.body.token;

  const userRes = await request(app).post('/api/auth/register').send({
    name: 'User',
    email: 'user@test.com',
    password: 'user123',
  });
  userToken = userRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

const moviePayload = () => ({
  title: 'Inception',
  description: 'A mind-bending thriller about dreams within dreams.',
  year: 2010,
  duration: 148,
  rating: 8.8,
  type: 'movie',
  categoryId,
});

describe('GET /api/movies', () => {
  it('should return paginated movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
  });

  it('should filter by type', async () => {
    await Movie.create(moviePayload());
    const res = await request(app).get('/api/movies?type=movie');
    expect(res.status).toBe(200);
    res.body.data.forEach((m) => expect(m.type).toBe('movie'));
  });
});

describe('POST /api/movies', () => {
  it('should create movie as admin', async () => {
    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(moviePayload());
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('title', 'Inception');
  });

  it('should reject creation without auth', async () => {
    const res = await request(app).post('/api/movies').send(moviePayload());
    expect(res.status).toBe(401);
  });

  it('should reject creation as regular user', async () => {
    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${userToken}`)
      .send(moviePayload());
    expect(res.status).toBe(403);
  });
});

describe('GET /api/movies/:id', () => {
  it('should return movie by id', async () => {
    const movie = await Movie.create(moviePayload());
    const res = await request(app).get(`/api/movies/${movie.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(movie.id);
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).get('/api/movies/99999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/movies/:id', () => {
  it('should update movie as admin', async () => {
    const movie = await Movie.create(moviePayload());
    const res = await request(app)
      .put(`/api/movies/${movie.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Inception Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Inception Updated');
  });
});

describe('DELETE /api/movies/:id', () => {
  it('should delete movie as admin', async () => {
    const movie = await Movie.create(moviePayload());
    const res = await request(app)
      .delete(`/api/movies/${movie.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
