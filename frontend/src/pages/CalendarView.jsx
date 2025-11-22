import Layout from '../components/Layout';
import Calendar from '../components/Calendar';

const CalendarView = () => {
    return (
        <Layout>
            <div>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-gray-600 mt-1">View your tasks on a calendar</p>
                </div>

                <Calendar />
            </div>
        </Layout>
    );
};

export default CalendarView;
