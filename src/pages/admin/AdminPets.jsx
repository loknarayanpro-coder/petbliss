import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    description: '',
    image_url: '',
    status: 'Available'
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch pets');
      console.error(error);
    } else {
      setPets(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      return toast.error('Name and Breed are required');
    }

    setIsSubmitting(true);
    // Provide a default placeholder image if none is provided
    const petToInsert = {
      ...formData,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'
    };

    const { data, error } = await supabase
      .from('pets')
      .insert([petToInsert])
      .select();

    if (error) {
      toast.error('Failed to add pet. Did you run the SQL script?');
      console.error(error);
    } else {
      toast.success('Pet added successfully!');
      setPets([data[0], ...pets]);
      setShowAddForm(false);
      setFormData({
        name: '', breed: '', age: '', gender: 'Male', weight: '', description: '', image_url: '', status: 'Available'
      });
    }
    setIsSubmitting(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('pets')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Status updated to ${newStatus}`);
      setPets(pets.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm('Are you sure you want to remove this pet?')) return;
    
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete pet');
    } else {
      toast.success('Pet removed from system');
      setPets(pets.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Pets</h2>
          <p className="text-sm text-gray-500 mt-1">Add and manage animals available for adoption.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Pet'}
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Pet</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                <input type="text" name="breed" value={formData.breed} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="text" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 2 Months, 3 Years" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 15 lbs" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                  <option value="Available">Available</option>
                  <option value="Pending">Pending Adoption</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://unsplash.com/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Bio</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Pet'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Pets Grid */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading pets...</div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-gray-900">No pets in the system</p>
          <p className="text-sm text-gray-500">Click "Add Pet" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] w-full relative bg-gray-100">
                <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <select 
                    value={pet.status} 
                    onChange={(e) => updateStatus(pet.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1 rounded-full outline-none border-0 shadow-sm appearance-none cursor-pointer ${
                      pet.status === 'Available' ? 'bg-green-100 text-green-700' :
                      pet.status === 'Adopted' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                  <button onClick={() => deletePet(pet.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-primary mb-3">{pet.breed}</p>
                <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-gray-600">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">{pet.age}</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">{pet.gender}</span>
                  {pet.weight && <span className="bg-gray-100 px-2.5 py-1 rounded-md">{pet.weight}</span>}
                </div>
                {pet.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{pet.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPets;
