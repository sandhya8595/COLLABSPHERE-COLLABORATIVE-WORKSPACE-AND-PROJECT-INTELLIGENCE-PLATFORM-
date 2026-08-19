import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }).then((res) => res.data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`).then((res) => res.data),
  googleLoginUrl: () => `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
};
