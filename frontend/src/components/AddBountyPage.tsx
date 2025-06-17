import React, { useState } from 'react';
import { createWalletClient, custom, getAddress, publicActions } from 'viem';
import { baseSepolia } from 'viem/chains';
import { exact } from 'x402/schemes';

const x402Version = 1;

export const AddBountyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);
    const endpoint= 'http://localhost:3000/question'
    try{
        const [account] = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });
      const address = getAddress(account);
      console.log('Selected account address:', address);

      const client = createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(window.ethereum!)
      }).extend(publicActions);

      const preflightRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title,description, price, submittedBy:address })
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
        body: JSON.stringify({ title, description, price, submittedBy:address })
      });

      const data = await paidRes.json();
      setResponse(data);



    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
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