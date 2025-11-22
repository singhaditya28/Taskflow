import { formatDate, getStatusLabel } from '../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, canEdit, canDelete }) => {
    const handleStatusClick = (e) => {
        e.stopPropagation();
        if (onStatusChange) {
            const statuses = ['todo', 'in_progress', 'completed'];
            const currentIndex = statuses.indexOf(task.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            onStatusChange(task.id, nextStatus);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'todo': { color: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-600', label: 'To Do' },
            'in_progress': { color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'In Progress' },
            'completed': { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Done' }
        };
        return configs[status] || configs['todo'];
    };

    const statusConfig = getStatusConfig(task.status);

    const Avatar = ({ name }) => (
        <div
            className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shadow-sm"
            title={name}
        >
            {name?.charAt(0).toUpperCase()}
        </div>
    );

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-100 hover:-translate-y-1">
            {/* Hover Gradient Border Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 leading-snug text-[15px] group-hover:text-indigo-600 transition-colors">
                        {task.title}
                    </h3>
                </div>
                <button
                    onClick={handleStatusClick}
                    className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border border-transparent hover:border-${statusConfig.text.split('-')[1]}-200 ${statusConfig.bg} ${statusConfig.text}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.color}`}></span>
                    {statusConfig.label}
                </button>
            </div>

            {task.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-5 leading-relaxed font-normal">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-50">
                <div className="flex items-center -space-x-2 pt-2">
                    {task.assigned_to_name && <Avatar name={task.assigned_to_name} />}
                    {task.created_by_name && task.created_by_name !== task.assigned_to_name && (
                        <Avatar name={task.created_by_name} />
                    )}
                </div>

                <div className="flex items-center space-x-3 pt-2">
                    {task.due_date && (
                        <div className={`flex items-center text-xs font-medium transition-colors ${new Date(task.due_date) < new Date() && task.status !== 'completed'
                                ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded-md'
                                : 'text-gray-400'
                            }`}>
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {formatDate(task.due_date)}
                        </div>
                    )}

                    {(canEdit || canDelete) && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                            {canEdit && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
