import api from './api';

export const notificationApi = {
    getAll: () => api.get('/webadmin/notifications'),
    getUnreadCount: () => api.get('/webadmin/notifications/unread-count'),
    markRead: (id) => api.patch(`/webadmin/notifications/${id}/read`),
    markAllRead: () => api.patch('/webadmin/notifications/read-all'),
    delete: (id) => api.delete(`/webadmin/notifications/${id}`),
};