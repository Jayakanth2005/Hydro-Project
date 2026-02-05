import api from './api';

export const communityService = {
    getAllPosts: async () => {
        const response = await api.get('/community/posts');
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/community/posts', postData);
        return response.data;
    },

    updatePost: async (postId, postData) => {
        const response = await api.put(`/community/posts/${postId}`, postData);
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`/community/posts/${postId}`);
        return response.data;
    },

    toggleLike: async (postId) => {
        const response = await api.post(`/community/posts/${postId}/like`);
        return response.data;
    },

    addComment: async (postId, text) => {
        const response = await api.post(`/community/posts/${postId}/comment`, { text });
        return response.data;
    },
};
