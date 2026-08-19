import api from './api';

export const userService = {
  updateProfile: (data) => api.patch('/users/me', data).then((res) => res.data),
  uploadAvatar: (formData) =>
    api
      .post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  changePassword: (data) => api.patch('/users/me/password', data).then((res) => res.data),
  getById: (id) => api.get(`/users/${id}`).then((res) => res.data),
  deactivateAccount: () => api.delete('/users/me').then((res) => res.data),
};
