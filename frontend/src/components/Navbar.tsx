import React, { useState } from 'react';
import { Plus, Bot, Wallet } from 'lucide-react';


export const Navbar: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setAddress('0x742d35Cc9A0532C7b5C12b7fd8d5b1D1234567890');
  };

  return (
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
            
            {isConnected ? (
              <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <Wallet className="w-4 h-4 mr-2" />
                <span className="text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};