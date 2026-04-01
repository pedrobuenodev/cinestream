module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'CineStream API',
    version: '1.0.0',
    description: 'REST API for CineStream — a Netflix-inspired movie streaming platform',
  },
  servers: [{ url: 'http://localhost:4000/api', description: 'Development' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Movie: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          year: { type: 'integer' },
          duration: { type: 'integer', description: 'Duration in minutes' },
          rating: { type: 'number', format: 'float' },
          poster_url: { type: 'string' },
          backdrop_url: { type: 'string' },
          trailer_url: { type: 'string' },
          type: { type: 'string', enum: ['movie', 'series'] },
          categoryId: { type: 'integer' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          avatar_url: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created, returns JWT token' },
          409: { description: 'Email already in use' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Returns JWT token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/movies': {
      get: {
        tags: ['Movies'],
        summary: 'List movies (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'category', in: 'query', schema: { type: 'integer' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['movie', 'series'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Paginated list of movies' } },
      },
      post: {
        tags: ['Movies'],
        summary: 'Create a movie (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Movie created' } },
      },
    },
    '/movies/{id}': {
      get: {
        tags: ['Movies'],
        summary: 'Get movie by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Movie details' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Movies'],
        summary: 'Update movie (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Movie updated' } },
      },
      delete: {
        tags: ['Movies'],
        summary: 'Delete movie (admin)',
        security: [{ bearerAuth: [] }],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/watchlist': {
      get: {
        tags: ['Watchlist'],
        summary: "Get user's watchlist",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of saved movies' } },
      },
    },
    '/watchlist/{movieId}': {
      post: {
        tags: ['Watchlist'],
        summary: 'Add movie to watchlist',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Added' }, 409: { description: 'Already in watchlist' } },
      },
      delete: {
        tags: ['Watchlist'],
        summary: 'Remove from watchlist',
        security: [{ bearerAuth: [] }],
        responses: { 204: { description: 'Removed' } },
      },
    },
  },
};
