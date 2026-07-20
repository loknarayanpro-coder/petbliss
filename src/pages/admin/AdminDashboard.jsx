import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Total Users', value: '0', change: '+0%', icon: Users, trend: 'up' },
    { name: 'Appointments', value: '0', change: '+0%', icon: Calendar, trend: 'up' },
    { name: 'Revenue', value: '₹0', change: '+0%', icon: DollarSign, trend: 'up' },
    { name: 'Active Pets', value: '0', change: '+0%', icon: Activity, trend: 'up' },
  ]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Calculate stats
      const totalAppointments = bookings.length;
      
      // Calculate revenue (assuming 500 INR per session for this example if amount not in table)
      // Since amount isn't in bookings table yet, we'll estimate 500 per booking for display
      const revenue = totalAppointments * 500;
      
      // Calculate unique users (by email)
      const uniqueEmails = new Set(bookings.map(b => b.email));
      const totalUsers = uniqueEmails.size;

      setStats([
        { name: 'Total Users (Booking)', value: totalUsers.toString(), change: '+12%', icon: Users, trend: 'up' },
        { name: 'Appointments', value: totalAppointments.toString(), change: '+5%', icon: Calendar, trend: 'up' },
        { name: 'Est. Revenue', value: `₹${revenue.toLocaleString()}`, change: '+8%', icon: DollarSign, trend: 'up' },
        { name: 'Active Pets', value: '1,892', change: '+15%', icon: Activity, trend: 'up' }, // Kept static until Pets CMS is done
      ]);

      // Set recent appointments
      setRecentAppointments(bookings.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stat.value}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-[300px] bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center p-6">
            <Activity className="w-12 h-12 text-gray-300 mb-2" />
            <span className="text-gray-400 font-medium">Analytics engine requires more data to generate trends.</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
            <Link to="/admin/appointments" className="text-primary text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading appointments...</p>
            ) : recentAppointments.length === 0 ? (
              <p className="text-sm text-gray-500">No recent appointments found.</p>
            ) : (
              recentAppointments.map((booking) => (
                <div key={booking.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold">
                    {booking.owner_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{booking.owner_name}</p>
                    <p className="text-xs text-gray-500 truncate">{booking.yoga_service} for {booking.pet_name}</p>
                  </div>
                  <div className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-1 rounded">
                    {new Date(booking.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
