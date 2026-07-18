import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, PawPrint, Clock, Activity } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'My Pets', value: '2', icon: PawPrint, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Upcoming Appts', value: '1', icon: Calendar, color: 'text-secondary', bg: 'bg-secondary/10' },
    { name: 'Past Appts', value: '4', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Book Appointment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                <p className="text-xs text-gray-500 font-bold uppercase">Aug</p>
                <p className="text-lg font-bold text-primary">24</p>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Wellness Exam</h4>
                <p className="text-sm text-gray-500">For Luna (Golden Retriever)</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">10:00 AM</p>
                <p className="text-xs text-gray-500">Dr. Smith</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Health Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Health Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Luna</h4>
                <p className="text-sm text-gray-500">All vaccinations up to date.</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
