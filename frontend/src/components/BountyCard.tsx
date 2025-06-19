
import React, { useState } from 'react';
import { User, Clock, Award } from 'lucide-react';
import { SolutionCard } from './SolutionCard';

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

export const BountyCard: React.FC<{
  bounty: Bounty;
  onSolve: (bountyId: string) => void;
  onAcceptSolution: (bountyId: string, solutionId: string) => void;
  connectedAddress: string;
}> = ({ bounty, onSolve, onAcceptSolution, connectedAddress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
console.log("BountyCard connectedAddress:", connectedAddress);
  const isOwner = bounty.submittedBy && connectedAddress === bounty.submittedBy.toLowerCase();


  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{bounty.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <User className="w-4 h-4 mr-1" />
              <span className="mr-4">{bounty.submittedBy}</span>
              <Clock className="w-4 h-4 mr-1" />
              <span>{bounty.submittedAt}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-indigo-600">
              <Award className="w-6 h-6 mr-1" />
              {bounty.price} ETH
            </div>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'} overflow-hidden`}>
          <p className="text-gray-700 mb-4">{bounty.description}</p>

          {isExpanded && (
            <div className="space-y-4">
              <button
                onClick={() => onSolve(bounty.id)}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Solve Challenge
              </button>

              {bounty.solutions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Submitted Solutions ({bounty.solutions.length})
                  </h4>
                  <div className="space-y-2">
                    {bounty.solutions.map((solution) => (
                      <SolutionCard
                        key={solution.id}
                        solution={solution}
                        onAccept={() => onAcceptSolution(bounty.id, solution.id)}
                        showAccept={isOwner}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
