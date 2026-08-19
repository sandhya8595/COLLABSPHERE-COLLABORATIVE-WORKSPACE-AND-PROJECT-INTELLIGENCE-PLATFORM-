import api from './api';

export const workspaceService = {
  create: (data) => api.post('/workspaces', data).then((res) => res.data),
  join: (inviteCode) => api.post('/workspaces/join', { inviteCode }).then((res) => res.data),
  getMine: () => api.get('/workspaces').then((res) => res.data),
  getById: (id) => api.get(`/workspaces/${id}`).then((res) => res.data),
  update: (id, data) => api.patch(`/workspaces/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/workspaces/${id}`).then((res) => res.data),
  getDashboard: (id) => api.get(`/workspaces/${id}/dashboard`).then((res) => res.data),
  inviteMember: (id, data) => api.post(`/workspaces/${id}/invite`, data).then((res) => res.data),
  removeMember: (id, userId) =>
    api.delete(`/workspaces/${id}/members/${userId}`).then((res) => res.data),
  updateMemberRole: (id, userId, role) =>
    api.patch(`/workspaces/${id}/members/${userId}/role`, { role }).then((res) => res.data),
};
