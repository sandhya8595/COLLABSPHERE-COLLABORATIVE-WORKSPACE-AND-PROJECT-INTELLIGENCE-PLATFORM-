import api from './api';

export const notificationService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/notifications${query ? `?${query}` : ''}`).then((res) => res.data);
  },
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => api.patch('/notifications/read-all').then((res) => res.data),
  remove: (id) => api.delete(`/notifications/${id}`).then((res) => res.data),
};
