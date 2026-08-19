import api from './api';

export const taskService = {
  createProject: (data) => api.post('/projects', data).then((res) => res.data),
  getProjects: (workspaceId) =>
    api.get(`/projects?workspaceId=${workspaceId}`).then((res) => res.data),
  getProjectById: (id) => api.get(`/projects/${id}`).then((res) => res.data),

  getBoard: (boardId) => api.get(`/boards/${boardId}`).then((res) => res.data),
  createColumn: (boardId, data) => api.post(`/boards/${boardId}/columns`, data).then((res) => res.data),

  createTask: (data) => api.post('/tasks', data).then((res) => res.data),
  getTask: (id) => api.get(`/tasks/${id}`).then((res) => res.data),
  updateTask: (id, data) => api.patch(`/tasks/${id}`, data).then((res) => res.data),
  deleteTask: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  moveTask: (id, data) => api.patch(`/tasks/${id}/move`, data).then((res) => res.data),
  addChecklistItem: (id, text) => api.post(`/tasks/${id}/checklist`, { text }).then((res) => res.data),
  toggleChecklistItem: (id, itemId) =>
    api.patch(`/tasks/${id}/checklist/${itemId}`).then((res) => res.data),
  addComment: (id, data) => api.post(`/tasks/${id}/comments`, data).then((res) => res.data),
};
