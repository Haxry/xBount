// import React, { useState } from 'react';
// import { ChevronDown, Plus, Bot, Wallet, Award, Clock, User, CheckCircle } from 'lucide-react';


// // Types
// interface Solution {
//   id: string;
//   title: string;
//   solution: string;
//   submittedBy: string;
//   submittedAt: string;
// }

// interface Bounty {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   submittedBy: string;
//   submittedAt: string;
//   solutions: Solution[];
// }

// // Sample data
// const sampleBounties: Bounty[] = [
//   {
//     id: '1',
//     title: 'Build a Smart Contract for NFT Marketplace',
//     description: 'Create a Solidity smart contract that handles NFT trading with royalty payments and escrow functionality. Must include proper security measures and gas optimization.',
//     price: 2.5,
//     submittedBy: '0x742d35Cc9A0532C7b5C12b7fd8d5b1D1234567890',
//     submittedAt: '2024-06-10',
//     solutions: [
//       {
//         id: 's1',
//         title: 'Complete NFT Marketplace Contract with Security Features',
//         solution: 'I have implemented a comprehensive NFT marketplace smart contract using Solidity 0.8.19. The contract includes: automated royalty distribution, secure escrow system, reentrancy guards, and gas-optimized batch operations. All functions are thoroughly tested with 100% code coverage.',
//         submittedBy: '0x8ba1f109551bD432803012645Hac189451c23890',
//         submittedAt: '2024-06-12'
//       },
//       {
//         id: 's2',
//         title: 'Gas-Optimized NFT Trading Contract',
//         solution: 'Built an efficient NFT marketplace contract focusing on gas optimization. Uses assembly for critical operations and implements merkle tree verification for batch operations.',
//         submittedBy: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
//         submittedAt: '2024-06-13'
//       }
//     ]
//   },
//   {
//     id: '2',
//     title: 'React Dashboard with Real-time Analytics',
//     description: 'Develop a responsive dashboard using React and TypeScript that displays real-time cryptocurrency data with interactive charts and portfolio tracking.',
//     price: 1.8,
//     submittedBy: '0x456789abcdef0123456789abcdef0123456789ab',
//     submittedAt: '2024-06-08',
//     solutions: [
//       {
//         id: 's3',
//         title: 'Complete Crypto Dashboard with WebSocket Integration',
//         solution: 'Created a fully responsive React TypeScript dashboard with real-time crypto data using WebSocket connections. Features include interactive charts with Chart.js, portfolio tracking, price alerts, and dark/light theme support.',
//         submittedBy: '0x9876543210fedcba9876543210fedcba98765432',
//         submittedAt: '2024-06-11'
//       }
//     ]
//   },
//   {
//     id: '3',
//     title: 'Python ML Model for Price Prediction',
//     description: 'Build a machine learning model using Python to predict cryptocurrency prices based on historical data and market indicators.',
//     price: 3.2,
//     submittedBy: '0xabcdef0123456789abcdef0123456789abcdef01',
//     submittedAt: '2024-06-05',
//     solutions: []
//   }
// ];

// // Components
// const BountyCard: React.FC<{ bounty: Bounty; onSolve: (bountyId: string) => void; onAcceptSolution: (bountyId: string, solutionId: string) => void }> = ({ bounty, onSolve, onAcceptSolution }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div 
//       className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
//       onMouseEnter={() => setIsExpanded(true)}
//       onMouseLeave={() => setIsExpanded(false)}
//     >
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1">
//             <h3 className="text-xl font-bold text-gray-900 mb-2">{bounty.title}</h3>
//             <div className="flex items-center text-sm text-gray-600 mb-3">
//               <User className="w-4 h-4 mr-1" />
//               <span className="mr-4">{bounty.submittedBy}</span>
//               <Clock className="w-4 h-4 mr-1" />
//               <span>{bounty.submittedAt}</span>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="flex items-center text-2xl font-bold text-indigo-600">
//               <Award className="w-6 h-6 mr-1" />
//               {bounty.price} ETH
//             </div>
//           </div>
//         </div>
        
//         <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'} overflow-hidden`}>
//           <p className="text-gray-700 mb-4">{bounty.description}</p>
          
//           {isExpanded && (
//             <div className="space-y-4">
//               <button
//                 onClick={() => onSolve(bounty.id)}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//               >
//                 Solve Challenge
//               </button>
              
//               {bounty.solutions.length > 0 && (
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-3">Submitted Solutions ({bounty.solutions.length})</h4>
//                   <div className="space-y-2">
//                     {bounty.solutions.map((solution) => (
//                       <SolutionCard
//                         key={solution.id}
//                         solution={solution}
//                         onAccept={() => onAcceptSolution(bounty.id, solution.id)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const SolutionCard: React.FC<{ solution: Solution; onAccept: () => void }> = ({ solution, onAccept }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div 
//       className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-all duration-300"
//       onMouseEnter={() => setIsExpanded(true)}
//       onMouseLeave={() => setIsExpanded(false)}
//     >
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <h5 className="font-medium text-gray-900 mb-2">{solution.title}</h5>
//           <div className="flex items-center text-sm text-gray-600 mb-2">
//             <User className="w-3 h-3 mr-1" />
//             <span className="mr-3">{solution.submittedBy}</span>
//             <Clock className="w-3 h-3 mr-1" />
//             <span>{solution.submittedAt}</span>
//           </div>
//           {isExpanded && (
//             <div className="mt-3">
//               <p className="text-gray-700 text-sm">{solution.solution}</p>
//             </div>
//           )}
//         </div>
//         <button
//           onClick={onAccept}
//           className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
//         >
//           <CheckCircle className="w-4 h-4 mr-1" />
//           Accept
//         </button>
//       </div>
//     </div>
//   );
// };

// const SolveModal: React.FC<{ isOpen: boolean; onClose: () => void; bountyId: string }> = ({ isOpen, onClose, bountyId }) => {
//   const [title, setTitle] = useState('');
//   const [solution, setSolution] = useState('');

//   const handleSubmit = () => {
//     // Handle solution submission
//     console.log('Submitting solution:', { bountyId, title, solution });
//     setTitle('');
//     setSolution('');
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Solution</h2>
//         <div className="space-y-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//               Solution Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               placeholder="Brief title for your solution"
//             />
//           </div>
//           <div>
//             <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
//               Solution Description
//             </label>
//             <textarea
//               id="solution"
//               value={solution}
//               onChange={(e) => setSolution(e.target.value)}
//               rows={8}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               placeholder="Describe your solution in detail..."
//             />
//           </div>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleSubmit}
//               className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//             >
//               Submit Solution
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AddBountyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Submitting bounty:', { title, description, price });
//     setTitle('');
//     setDescription('');
//     setPrice('');
//     onBack();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       <div className="container mx-auto px-6 py-12">
//         <div className="max-w-2xl mx-auto">
//           <button
//             onClick={onBack}
//             className="mb-8 text-indigo-600 hover:text-indigo-800 font-medium"
//           >
//             ← Back to Home
//           </button>

//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//               Create New Bounty
//             </h1>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="bounty-title" className="block text-sm font-medium text-gray-700 mb-2">
//                   Challenge Title
//                 </label>
//                 <input
//                   type="text"
//                   id="bounty-title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter a clear and concise title"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                   Challenge Description
//                 </label>
//                 <textarea
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={8}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Provide detailed requirements and specifications..."
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
//                   Bounty Price (ETH)
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   step="0.001"
//                   min="0"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="0.00"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
//               >
//                 Create Bounty
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AskAIPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
//       <div className="container mx-auto px-6 py-12">
//         <button
//           onClick={onBack}
//           className="mb-8 text-indigo-600 hover:text-indigo-800 font-medium"
//         >
//           ← Back to Home
//         </button>
        
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-white rounded-2xl shadow-xl p-12">
//             <Bot className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Assistant</h1>
//             <p className="text-gray-600 text-lg">
//               Coming soon! Ask our AI assistant for help with your challenges.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Navbar: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState('');

//   const connectWallet = () => {
//     // Simulate wallet connection
//     setIsConnected(true);
//     setAddress('0x742d35Cc9A0532C7b5C12b7fd8d5b1D1234567890');
//   };

//   return (
//     <nav className="bg-white shadow-sm border-b border-gray-200">
//       <div className="container mx-auto px-6">
//         <div className="flex justify-between items-center h-16">
//           <div className="text-2xl font-bold text-indigo-600">XBount</div>
          
//           <div className="flex items-center space-x-6">
//             <button
//               onClick={onAddBounty}
//               className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Bounty
//             </button>
            
//             <button
//               onClick={onAskAI}
//               className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
//             >
//               <Bot className="w-4 h-4 mr-2" />
//               Ask AI
//             </button>
            
//             {isConnected ? (
//               <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
//                 <Wallet className="w-4 h-4 mr-2" />
//                 <span className="text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
//               </div>
//             ) : (
//               <button
//                 onClick={connectWallet}
//                 className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
//               >
//                 <Wallet className="w-4 h-4 mr-2" />
//                 Connect Wallet
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// const HomePage: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
//   const [bounties] = useState<Bounty[]>(sampleBounties);
//   const [selectedBounty, setSelectedBounty] = useState<string | null>(null);

//   const handleSolve = (bountyId: string) => {
//     setSelectedBounty(bountyId);
//   };

//   const handleAcceptSolution = (bountyId: string, solutionId: string) => {
//     console.log('Accepting solution:', { bountyId, solutionId });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       <Navbar onAddBounty={onAddBounty} onAskAI={onAskAI} />
      
//       <div className="container mx-auto px-6 py-12">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-gray-900 mb-6">
//             Welcome to <span className="text-indigo-600">XBount</span>
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             The premier bounty hunter platform where challenges meet solutions. 
//             Post your toughest problems, solve exciting challenges, and earn rewards 
//             in a thriving community of developers and problem solvers.
//           </p>
//         </div>

//         <div className="mb-12">
//           <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Active Bounties</h2>
//           <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
//             {bounties.map((bounty) => (
//               <BountyCard
//                 key={bounty.id}
//                 bounty={bounty}
//                 onSolve={handleSolve}
//                 onAcceptSolution={handleAcceptSolution}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       <SolveModal
//         isOpen={selectedBounty !== null}
//         onClose={() => setSelectedBounty(null)}
//         bountyId={selectedBounty || ''}
//       />
//     </div>
//   );
// };

// const App: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState<'home' | 'add-bounty' | 'ask-ai'>('home');

//   return (
//     <div>
//       {currentPage === 'home' && (
//         <HomePage
//           onAddBounty={() => setCurrentPage('add-bounty')}
//           onAskAI={() => setCurrentPage('ask-ai')}
//         />
//       )}
//       {currentPage === 'add-bounty' && (
//         <AddBountyPage onBack={() => setCurrentPage('home')} />
//       )}
//       {currentPage === 'ask-ai' && (
//         <AskAIPage onBack={() => setCurrentPage('home')} />
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { ChevronDown, Plus, Bot, Wallet, Award, Clock, User, CheckCircle } from 'lucide-react';

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

// Components
const BountyCard: React.FC<{ bounty: Bounty; onSolve: (bountyId: string) => void; onAcceptSolution: (bountyId: string, solutionId: string) => void }> = ({ bounty, onSolve, onAcceptSolution }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
                  <h4 className="font-semibold text-gray-900 mb-3">Submitted Solutions ({bounty.solutions.length})</h4>
                  <div className="space-y-2">
                    {bounty.solutions.map((solution) => (
                      <SolutionCard
                        key={solution.id}
                        solution={solution}
                        onAccept={() => onAcceptSolution(bounty.id, solution.id)}
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

const SolutionCard: React.FC<{ solution: Solution; onAccept: () => void }> = ({ solution, onAccept }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-all duration-300"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900 mb-2">{solution.title}</h5>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="w-3 h-3 mr-1" />
            <span className="mr-3">{solution.submittedBy}</span>
            <Clock className="w-3 h-3 mr-1" />
            <span>{solution.submittedAt}</span>
          </div>
          {isExpanded && (
            <div className="mt-3">
              <p className="text-gray-700 text-sm">{solution.solution}</p>
            </div>
          )}
        </div>
        <button
          onClick={onAccept}
          className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Accept
        </button>
      </div>
    </div>
  );
};

const SolveModal: React.FC<{ isOpen: boolean; onClose: () => void; bountyId: string }> = ({ isOpen, onClose, bountyId }) => {
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

const AddBountyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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

const AskAIPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="mb-8 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Home
        </button>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <Bot className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Assistant</h1>
            <p className="text-gray-600 text-lg">
              Coming soon! Ask our AI assistant for help with your challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
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

const HomePage: React.FC<{ onAddBounty: () => void; onAskAI: () => void }> = ({ onAddBounty, onAskAI }) => {
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'add-bounty' | 'ask-ai'>('home');

  return (
    <div className="w-full min-h-screen">
      {currentPage === 'home' && (
        <HomePage
          onAddBounty={() => setCurrentPage('add-bounty')}
          onAskAI={() => setCurrentPage('ask-ai')}
        />
      )}
      {currentPage === 'add-bounty' && (
        <AddBountyPage onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'ask-ai' && (
        <AskAIPage onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
};

export default App;
