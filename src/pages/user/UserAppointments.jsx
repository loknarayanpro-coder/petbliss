import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';
import { Calendar } from 'lucide-react';

const UserAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.phone) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('phone', user.phone)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You have no appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center min-w-[4rem]">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    {new Date(apt.booking_date).toLocaleDateString(undefined, { month: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {new Date(apt.booking_date).getDate()}
                  </p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{apt.yoga_service}</h4>
                  <p className="text-sm text-gray-500">For {apt.pet_name}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-bold text-gray-900">{apt.booking_time}</p>
                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 capitalize">
                    {apt.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointments;
