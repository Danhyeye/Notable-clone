import axiosClient from './axiosClient';

const UserAPI = {
    login: async (email, password) => {
        try {
            const response = await axiosClient.post('/users/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('accessToken', response.data.token);
                localStorage.setItem('userId', response.data.id);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUser: async () => {
        try {
            const response = await axiosClient.get('/users/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosClient.post('/users/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post('/users/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    checkAuth: async (idToken) => {
        try {
            const response = await axiosClient.post('/users/check-auth', { idToken });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
    }
};

export default UserAPI;
