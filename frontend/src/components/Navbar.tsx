import React, { useState } from 'react';
import { Plus, Bot, User, X, Eye, EyeOff } from 'lucide-react';

interface NavbarProps {
  onAddBounty: () => void;
  onAskAI: () => void;
  setConnectedAddress: (addr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAddBounty, onAskAI, setConnectedAddress }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    privateKey: '',
    network: 'ethereum'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    // Set user as registered
    setIsRegistered(true);
    setUserName(formData.name);
    setShowRegisterForm(false);
    
    // Reset form
    setFormData({
      name: '',
      privateKey: '',
      network: 'ethereum'
    });
  };

  const handleLogout = () => {
    setIsRegistered(false);
    setUserName('');
    setConnectedAddress('');
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-indigo-600">XBount</div>

            <div className="flex items-center space-x-6">
              <button
                onClick={onAddBounty}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bounty
              </button>

              <button
                onClick={onAskAI}
                className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Bot className="w-4 h-4 mr-2" />
                Ask AI
              </button>

              {!isRegistered ? (
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  Register
                </button>
              ) : (
                <div className="flex items-center bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-xl border border-green-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome, {userName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Register</h2>
              <button
                onClick={() => setShowRegisterForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Private Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showPrivateKey ? "text" : "password"}
                    name="privateKey"
                    value={formData.privateKey}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter existing private key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to create a new account
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="Base Mainnet">Base Mainnet</option>
                  <option value="Base Sepolia">Base Sepolia</option>
                  
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowRegisterForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};