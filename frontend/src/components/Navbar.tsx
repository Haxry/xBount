import React, { useState } from 'react';
import { Plus, Bot, Wallet } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Navbar: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    // Disconnect if already connected
    if (isConnected) {
      setIsConnected(false);
      setAddress('');
      return;
    }

    // Otherwise, connect
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAddress(accounts[0]);
      } catch (err) {
        console.error('🛑 Wallet connection failed:', err);
        alert('Failed to connect wallet');
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask extension.');
    }
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

            <button
              onClick={connectWallet}
              className={`flex items-center ${isConnected ? 'bg-red-100 text-red-800' : 'bg-gray-600 text-white'} px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnected ? (
                <span className="text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
