import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Tag, Check, X, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_code: '',
    is_active: true
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch offers');
      console.error(error);
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      return toast.error('Title is required');
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('offers')
      .insert([formData])
      .select();

    if (error) {
      toast.error('Failed to create offer. Ensure you ran the SQL script!');
      console.error(error);
    } else {
      toast.success('Offer created successfully!');
      setOffers([data[0], ...offers]);
      setShowAddForm(false);
      setFormData({ title: '', description: '', discount_code: '', is_active: true });
    }
    setIsSubmitting(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const { error } = await supabase
      .from('offers')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      setOffers(offers.map(o => o.id === id ? { ...o, is_active: !currentStatus } : o));
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete offer');
    } else {
      toast.success('Offer deleted');
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Offers</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage dynamic promotional banners for the public website.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'New Offer'}
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Offer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Special: 20% Off Yoga Classes!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code (Optional)</label>
                <input
                  type="text"
                  name="discount_code"
                  value={formData.discount_code}
                  onChange={handleInputChange}
                  placeholder="e.g. SUMMER20"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Details about the offer..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700 font-medium">
                Set active immediately (will appear on homepage)
              </label>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Offer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promo Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading offers...</td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Percent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No offers found</p>
                    <p className="text-sm">Click "New Offer" to create one.</p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{offer.title}</p>
                      {offer.description && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{offer.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {offer.discount_code ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-semibold border border-blue-100">
                          <Tag className="w-3 h-3" />
                          {offer.discount_code}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(offer.id, offer.is_active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                          offer.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {offer.is_active ? (
                          <><Check className="w-3 h-3" /> Active</>
                        ) : (
                          <><X className="w-3 h-3" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => deleteOffer(offer.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
