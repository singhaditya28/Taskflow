import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getTasks } from '../api/tasks';
import { getStatusLabel } from '../utils/helpers';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const tasks = await getTasks();

            const calendarEvents = tasks
                .filter(task => task.due_date)
                .map(task => ({
                    id: task.id,
                    title: task.title,
                    start: task.due_date,
                    // We'll handle styling in renderEventContent, so we make default styles transparent
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    classNames: ['custom-calendar-event'],
                    extendedProps: { ...task }
                }));

            setEvents(calendarEvents);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        setSelectedTask(info.event.extendedProps);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const renderEventContent = (eventInfo) => {
        const statusConfig = {
            'todo': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400' },
            'in_progress': { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
            'completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' }
        };

        const config = statusConfig[eventInfo.event.extendedProps.status] || statusConfig['todo'];

        return (
            <div className={`w-full px-2 py-1 rounded-md flex items-center gap-2 overflow-hidden transition-all hover:brightness-95 cursor-pointer ${config.bg}`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
                <span className={`text-xs font-medium truncate ${config.text}`}>
                    {eventInfo.event.title}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <style>{`
                .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
                .fc-col-header-cell-cushion { color: #64748b; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 16px 0 !important; }
                .fc-daygrid-day-number { color: #334155; font-weight: 500; padding: 8px 12px !important; }
                .fc-daygrid-day.fc-day-today { background-color: #f8fafc !important; }
                
                /* Toolbar Buttons */
                .fc-button-primary { 
                    background-color: white !important; 
                    border: 1px solid #e2e8f0 !important; 
                    color: #475569 !important; 
                    font-weight: 500 !important; 
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
                    padding: 8px 16px !important;
                    text-transform: capitalize !important;
                }
                .fc-button-primary:hover { background-color: #f8fafc !important; border-color: #cbd5e1 !important; color: #1e293b !important; }
                .fc-button-active { background-color: #f1f5f9 !important; border-color: #cbd5e1 !important; color: #0f172a !important; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05) !important; }
                .fc-button-primary:focus { box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important; }
                
                .fc-toolbar-title { font-size: 1.5rem !important; font-weight: 700 !important; color: #1e293b; letter-spacing: -0.025em; }
                
                /* Events */
                .fc-daygrid-event { background: transparent !important; border: none !important; margin-top: 4px !important; }
                .fc-daygrid-event:hover { background: transparent !important; }
            `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                }}
                events={events}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                height="auto"
                dayMaxEvents={3}
            />

            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedTask.title}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                    ${selectedTask.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        selectedTask.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            'bg-slate-50 text-slate-700 border-slate-100'}`}>
                                    {getStatusLabel(selectedTask.status)}
                                </span>
                            </div>

                            {selectedTask.description && (
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedTask.description}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                {selectedTask.assigned_to_name && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Assigned to</p>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                {selectedTask.assigned_to_name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{selectedTask.assigned_to_name}</span>
                                        </div>
                                    </div>
                                )}
                                {selectedTask.due_date && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Due Date</p>
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-sm font-medium">
                                                {new Date(selectedTask.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
