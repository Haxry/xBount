import React, { useState } from 'react';

export const AddBountyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting bounty:', { title, description, price });
    setTitle('');
    setDescription('');
    setPrice('');
    onBack();
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
    <div className="px-6 py-12 flex justify-center">
      <div className="w-full max-w-2xl">
        <button
          onClick={onBack}
          className="mb-8 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create New Bounty
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="bounty-title" className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Title
              </label>
              <input
                type="text"
                id="bounty-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter a clear and concise title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Provide detailed requirements and specifications..."
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Bounty Price (ETH)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.001"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              Create Bounty
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};