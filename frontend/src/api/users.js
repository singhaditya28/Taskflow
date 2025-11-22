import axiosInstance from './axios';

export const getUsers = async (params = {}) => {
    const response = await axiosInstance.get('/api/users', { params });
    return response.data;
};

export const getUser = async (userId) => {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await axiosInstance.put(`/api/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/api/users/${userId}`);
    return response.data;
};
