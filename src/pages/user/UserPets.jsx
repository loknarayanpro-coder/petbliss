import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const UserPets = () => {
  const pets = [
    { id: 1, name: 'Luna', species: 'Dog', breed: 'Golden Retriever', age: '3 years', weight: '65 lbs' },
    { id: 2, name: 'Milo', species: 'Cat', breed: 'Siamese', age: '2 years', weight: '10 lbs' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-sm text-gray-500">Manage your furry family members</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gray-200 relative">
              {/* Placeholder image */}
              <img 
                src={pet.species === 'Dog' 
                  ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=60' 
                  : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60'} 
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                  {pet.species}
                </span>
              </div>
              <div className="space-y-1 mb-4 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Breed:</span> {pet.breed}</p>
                <p><span className="font-medium text-gray-900">Age:</span> {pet.age}</p>
                <p><span className="font-medium text-gray-900">Weight:</span> {pet.weight}</p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors hover:bg-gray-50 rounded-lg">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPets;
