import React, { useState,useEffect } from 'react';
import { Navbar } from './Navbar';
import { BountyCard } from './BountyCard';
import { SolveModal } from './SolveModal';


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


export const HomePage: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
  const [bounties,setBounties] = useState<Bounty[]>([]);
  const [selectedBounty, setSelectedBounty] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const fetchBounties = async () => {
    try {
      const res = await fetch('http://localhost:3000/bounties'); // replace with your actual backend URL
      const data = await res.json();
      setBounties(data);
    } catch (err) {
      console.error('Error fetching bounties:', err);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handleSolve = (bountyId: string) => {
    setSelectedBounty(bountyId);
  };

  const handleAcceptSolution = (bountyId: string, solutionId: string) => {
    console.log('Accepting solution:', { bountyId, solutionId });
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
    <Navbar onAddBounty={onAddBounty} onAskAI={onAskAI} setConnectedAddress={setAddress} />
    
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
              connectedAddress={address || '0xfake1234567890abcdef1234567890abcdef1234'}
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