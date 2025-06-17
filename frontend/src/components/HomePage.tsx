import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { BountyCard } from './BountyCard';
import { SolveModal } from './SolveModal';
// Assuming you have a sample data file

// Types
interface Solution {
  id: string;
  title: string;
  solution: string;
  submittedBy: string;
  submittedAt: string;
}

interface Bounty {
  id: string;
  title: string;
  description: string;
  price: number;
  submittedBy: string;
  submittedAt: string;
  solutions: Solution[];
}

// Sample data
const sampleBounties: Bounty[] = [
  {
    id: '1',
    title: 'Build a Smart Contract for NFT Marketplace',
    description: 'Create a Solidity smart contract that handles NFT trading with royalty payments and escrow functionality. Must include proper security measures and gas optimization.',
    price: 2.5,
    submittedBy: '0x742d35Cc9A0532C7b5C12b7fd8d5b1D1234567890',
    submittedAt: '2024-06-10',
    solutions: [
      {
        id: 's1',
        title: 'Complete NFT Marketplace Contract with Security Features',
        solution: 'I have implemented a comprehensive NFT marketplace smart contract using Solidity 0.8.19. The contract includes: automated royalty distribution, secure escrow system, reentrancy guards, and gas-optimized batch operations. All functions are thoroughly tested with 100% code coverage.',
        submittedBy: '0x8ba1f109551bD432803012645Hac189451c23890',
        submittedAt: '2024-06-12'
      },
      {
        id: 's2',
        title: 'Gas-Optimized NFT Trading Contract',
        solution: 'Built an efficient NFT marketplace contract focusing on gas optimization. Uses assembly for critical operations and implements merkle tree verification for batch operations.',
        submittedBy: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
        submittedAt: '2024-06-13'
      }
    ]
  },
  {
    id: '2',
    title: 'React Dashboard with Real-time Analytics',
    description: 'Develop a responsive dashboard using React and TypeScript that displays real-time cryptocurrency data with interactive charts and portfolio tracking.',
    price: 1.8,
    submittedBy: '0x456789abcdef0123456789abcdef0123456789ab',
    submittedAt: '2024-06-08',
    solutions: [
      {
        id: 's3',
        title: 'Complete Crypto Dashboard with WebSocket Integration',
        solution: 'Created a fully responsive React TypeScript dashboard with real-time crypto data using WebSocket connections. Features include interactive charts with Chart.js, portfolio tracking, price alerts, and dark/light theme support.',
        submittedBy: '0x9876543210fedcba9876543210fedcba98765432',
        submittedAt: '2024-06-11'
      }
    ]
  },
  {
    id: '3',
    title: 'Python ML Model for Price Prediction',
    description: 'Build a machine learning model using Python to predict cryptocurrency prices based on historical data and market indicators.',
    price: 3.2,
    submittedBy: '0xabcdef0123456789abcdef0123456789abcdef01',
    submittedAt: '2024-06-05',
    solutions: []
  }
];

export const HomePage: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
  const [bounties] = useState<Bounty[]>(sampleBounties);
  const [selectedBounty, setSelectedBounty] = useState<string | null>(null);

  const handleSolve = (bountyId: string) => {
    setSelectedBounty(bountyId);
  };

  const handleAcceptSolution = (bountyId: string, solutionId: string) => {
    console.log('Accepting solution:', { bountyId, solutionId });
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
    <Navbar onAddBounty={onAddBounty} onAskAI={onAskAI} />
    
    <div className="px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-indigo-600">XBount</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The premier bounty hunter platform where challenges meet solutions. 
          Post your toughest problems, solve exciting challenges, and earn rewards 
          in a thriving community of developers and problem solvers.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Active Bounties</h2>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          {bounties.map((bounty) => (
            <BountyCard
              key={bounty.id}
              bounty={bounty}
              onSolve={handleSolve}
              onAcceptSolution={handleAcceptSolution}
            />
          ))}
        </div>
      </div>
    </div>

    <SolveModal
      isOpen={selectedBounty !== null}
      onClose={() => setSelectedBounty(null)}
      bountyId={selectedBounty || ''}
    />
  </div>
  );
};