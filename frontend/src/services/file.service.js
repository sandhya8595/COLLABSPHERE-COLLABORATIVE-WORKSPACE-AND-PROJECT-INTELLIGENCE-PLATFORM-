import api from './api';

export const fileService = {
  upload: (formData, onProgress) =>
    api
      .post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      })
      .then((res) => res.data),
  createFolder: (data) => api.post('/files/folders', data).then((res) => res.data),
  list: (workspaceId, folderId) =>
    api
      .get(`/files?workspaceId=${workspaceId}${folderId ? `&folderId=${folderId}` : ''}`)
      .then((res) => res.data),
  getDetails: (id) => api.get(`/files/${id}`).then((res) => res.data),
  uploadNewVersion: (id, formData) =>
    api
      .post(`/files/${id}/versions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data),
  restoreVersion: (id, versionId) =>
    api.post(`/files/${id}/versions/${versionId}/restore`).then((res) => res.data),
  toggleLock: (id) => api.patch(`/files/${id}/lock`).then((res) => res.data),
  share: (id, data) => api.post(`/files/${id}/share`, data).then((res) => res.data),
  trackDownload: (id) => api.get(`/files/${id}/download`).then((res) => res.data),
  remove: (id) => api.delete(`/files/${id}`).then((res) => res.data),
};
