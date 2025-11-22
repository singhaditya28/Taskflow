import axiosInstance from './axios';

export const getTasks = async (params = {}) => {
    const response = await axiosInstance.get('/api/tasks', { params });
    return response.data;
};

export const getTask = async (taskId) => {
    const response = await axiosInstance.get(`/api/tasks/${taskId}`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axiosInstance.post('/api/tasks', taskData);
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await axiosInstance.put(`/api/tasks/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
    return response.data;
};
