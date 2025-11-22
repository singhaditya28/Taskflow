import axiosInstance from './axios';

export const signup = async (userData) => {
    const response = await axiosInstance.post('/api/auth/signup', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
};
