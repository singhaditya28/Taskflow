import { useState } from 'react';
import { STATUS_OPTIONS } from '../utils/constants';

const TaskFilters = ({ onFilterChange, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setSelectedStatus(value);
        onFilterChange({ status: value || undefined });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('');
        onSearch('');
        onFilterChange({});
    };

    return (
        <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="input"
                    />
                </div>

                <div className="w-full md:w-48">
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="input"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {(searchTerm || selectedStatus) && (
                    <button
                        onClick={handleClearFilters}
                        className="btn btn-secondary whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskFilters;
