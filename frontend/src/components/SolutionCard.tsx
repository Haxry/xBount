import React, { useState } from 'react';
import { CheckCircle, User, Clock, Loader2, ExternalLink, Check, X } from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  solution: string;
  submittedBy: string;
  submittedAt: string;
}

interface TransactionResult {
  transactionHash: string;
  status: string;
}

export const SolutionCard: React.FC<{ solution: Solution; onAccept: () => void }> = ({ solution, onAccept }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/prize/0.01', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTransactionResult(result);
      onAccept(); // Call the original onAccept callback
    } catch (err) {
      console.error('Transaction failed:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Success') {
      return <Check className="w-4 h-4 text-green-600" />;
    } else {
      return <X className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Success' ? 'text-green-600' : 'text-red-600';
  };

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

          {/* Transaction Result Display */}
          {transactionResult && (
            <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h6 className="font-medium text-gray-800">Transaction Details</h6>
                <div className="flex items-center">
                  {getStatusIcon(transactionResult.status)}
                  <span className={`ml-1 text-sm font-medium ${getStatusColor(transactionResult.status)}`}>
                    {transactionResult.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-2">Hash:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {transactionResult.transactionHash.slice(0, 10)}...{transactionResult.transactionHash.slice(-8)}
                  </code>
                  <a
                    href={`https://sepolia.basescan.org/tx/${transactionResult.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    title="View on Block Explorer"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs text-gray-500">
                  Prize: 0.01 USDC sent successfully
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <div className="flex items-center text-red-700">
                <X className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Transaction Failed</span>
              </div>
              <p className="text-red-600 text-xs mt-1">{error}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleAccept}
          disabled={isProcessing || transactionResult !== null}
          className={`ml-4 px-3 py-1 rounded-md transition-colors text-sm font-medium flex items-center ${
            transactionResult 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : isProcessing
              ? 'bg-green-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Processing...
            </>
          ) : transactionResult ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Accepted
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </>
          )}
        </button>
      </div>
    </div>
  );
};



// import React, { useState } from 'react';
// import { CheckCircle, User, Clock } from 'lucide-react';


// interface Solution {
//   id: string;
//   title: string;
//   solution: string;
//   submittedBy: string;
//   submittedAt: string;
// }


// export const SolutionCard: React.FC<{ solution: Solution; onAccept: () => void }> = ({ solution, onAccept }) => {
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

// import React, { useState } from 'react';
// import { User, Clock, CheckCircle } from 'lucide-react';

// interface Solution {
//   id: string;
//   title: string;
//   solution: string;
//   submittedBy: string;
//   submittedAt: string;
// }

// export const SolutionCard: React.FC<{
//   solution: Solution;
//   onAccept: () => void;
//   showAccept: boolean;
// }> = ({ solution, onAccept, showAccept }) => {
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

//         {showAccept && (
//           <button
//             onClick={onAccept}
//             className="ml-4 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
//           >
//             <CheckCircle className="w-4 h-4 mr-1" />
//             Accept
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
