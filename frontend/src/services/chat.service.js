import api from './api';

export const chatService = {
  create: (data) => api.post('/chats', data).then((res) => res.data),
  getMine: (workspaceId) => api.get(`/chats?workspaceId=${workspaceId}`).then((res) => res.data),
  getMessages: (chatId, before) =>
    api
      .get(`/chats/${chatId}/messages${before ? `?before=${before}` : ''}`)
      .then((res) => res.data),
  getThreadReplies: (messageId) =>
    api.get(`/chats/messages/${messageId}/thread`).then((res) => res.data),
  deleteMessage: (messageId) => api.delete(`/chats/messages/${messageId}`).then((res) => res.data),
  deleteMessageForMe: (messageId) =>
    api.post(`/chats/messages/${messageId}/delete-for-me`).then((res) => res.data),
  clearChatForMe: (chatId) =>
    api.post(`/chats/${chatId}/clear-for-me`).then((res) => res.data),
};
