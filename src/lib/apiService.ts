import { api } from "./api";

export const apiService = {
    updateSiteVisitStatus: async (id: string, status: string) => {
        return api.put(`/site-visits/${id}`, {
            status,
        });
    },

    getNotifications: async () => {
        return api.get('/notifications');
    },
};

export default apiService;