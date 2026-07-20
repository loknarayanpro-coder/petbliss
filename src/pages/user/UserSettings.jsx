import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const UserSettings = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    try {
      await updateUser({ name: formData.name, email: formData.email });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl transition-all duration-300">
        <h2 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Profile Information</h2>
        
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 font-medium text-lg"
                />
              ) : (
                <p className="text-xl font-bold text-gray-900">{user?.name || 'Pet Lover'}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Registered Phone Number</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 opacity-80 cursor-not-allowed">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium tracking-wide">+91 {user?.phone}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">Phone number cannot be changed as it is used for login.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Email Address</label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 font-medium text-base"
                  placeholder="Enter email address"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{user?.email || <span className="text-gray-400 italic">No email provided</span>}</span>
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={handleSave}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
