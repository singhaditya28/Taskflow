import { useState, useEffect } from 'react';
import { getTasks } from '../api/tasks';

export const useTasks = (filters = {}) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasks(filters);
            setTasks(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [JSON.stringify(filters)]);

    return { tasks, loading, error, refetch: fetchTasks };
};
