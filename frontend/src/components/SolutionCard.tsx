import React, { useState } from 'react';
import { CheckCircle, User, Clock } from 'lucide-react';


interface Solution {
  id: string;
  title: string;
  solution: string;
  submittedBy: string;
  submittedAt: string;
}


export const SolutionCard: React.FC<{ solution: Solution; onAccept: () => void }> = ({ solution, onAccept }) => {
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
