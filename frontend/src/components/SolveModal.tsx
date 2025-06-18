import React, { useState } from 'react';
import { createWalletClient, custom, getAddress, publicActions } from 'viem';
import { baseSepolia } from 'viem/chains';
import { exact } from 'x402/schemes';

const x402Version = 1;

export const SolveModal: React.FC<{ isOpen: boolean; onClose: () => void; bountyId: string }> = ({ isOpen, onClose, bountyId }) => {
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!title || !solution) {
    alert("Please fill in both title and solution");
    return;
  }
  setLoading(true);
    setResponse(null);
    setError(null);

  try {
    const [account] = await window.ethereum!.request({
            method: 'eth_requestAccounts'
          });
          const address = getAddress(account);
          
          const client = createWalletClient({
                  account,
                  chain: baseSepolia,
                  transport: custom(window.ethereum!)
                }).extend(publicActions);
          const endpoint = `http://localhost:3000/answer/${bountyId}`;
                const preflightRes = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ title,solution, submittedBy:address })
                });
                 
                if (preflightRes.status !== 402) {
                  const data = await preflightRes.json();
                  setResponse(data);
                  setLoading(false);
                  return;
                }
          
                const { accepts } = await preflightRes.json();
                console.log('Payment requirements:', accepts);
          
                // Step 2: Create and settle payment
                const payment = await exact.evm.createPayment(client, x402Version, accepts[0]);
                console.log('Created payment:', payment);
          
                const paymentStatus = await exact.evm.settle(client, payment, accepts[0]);
                console.log('Payment status:', paymentStatus);
          
                // Encode the payment to base64
                const xPaymentHeader = window.btoa(unescape(encodeURIComponent(JSON.stringify(payment))));
          
                // Step 3: Actual request with X-PAYMENT header
                const paidRes = await fetch(endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-PAYMENT': xPaymentHeader,
                  },
                  body: JSON.stringify({ title, solution, submittedBy:address })
                });
                console.log("paidRes", paidRes);
          
                const data = await paidRes.json();
                setResponse(data);

    
    // const response = await fetch(`http://localhost:3000/answer/${bountyId}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     title,
    //     solution,
    //     submittedBy:address,
    //   }),
    // });

    // const data = await response.json();

    // if (!response.ok) {
    //   throw new Error(data.error || "Failed to submit solution");
    // }

    console.log("✅ Solution submitted:", data);
    alert("Solution submitted successfully!");
    setTitle("");
    setSolution("");
    onClose(); // Close modal
  } catch (err: any) {
    console.error("❌ Error submitting solution:", err);
    alert(err.message || "Something went wrong");
  }
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