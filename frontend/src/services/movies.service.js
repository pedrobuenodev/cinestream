import api from './api';

export const moviesService = {
  getAll: (params = {}) => api.get('/movies', { params }).then((r) => r.data),
  getById: (id) => api.get(`/movies/${id}`).then((r) => r.data.data),
  getFeatured: () => api.get('/movies/featured').then((r) => r.data.data),
  create: (data) => api.post('/movies', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/movies/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`/movies/${id}`),
};

export const categoriesService = {
  getAll: () => api.get('/categories').then((r) => r.data.data),
};

export const watchlistService = {
  getAll: () => api.get('/watchlist').then((r) => r.data.data),
  add: (movieId) => api.post(`/watchlist/${movieId}`),
  remove: (movieId) => api.delete(`/watchlist/${movieId}`),
  check: (movieId) => api.get(`/watchlist/${movieId}/check`).then((r) => r.data.inWatchlist),
};

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data.user),
};
