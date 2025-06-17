import React, { useState } from 'react';


export const SolveModal: React.FC<{ isOpen: boolean; onClose: () => void; bountyId: string }> = ({ isOpen, onClose, bountyId }) => {
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');

  const handleSubmit = () => {
    // Handle solution submission
    console.log('Submitting solution:', { bountyId, title, solution });
    setTitle('');
    setSolution('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Solution</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Solution Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Brief title for your solution"
            />
          </div>
          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              Solution Description
            </label>
            <textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe your solution in detail..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Submit Solution
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};