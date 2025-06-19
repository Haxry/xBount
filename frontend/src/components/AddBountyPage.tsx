import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Loader2, Copy, Check } from 'lucide-react';
 import { createWalletClient, custom, getAddress, publicActions } from 'viem';
 import { baseSepolia } from 'viem/chains';
 import { exact } from 'x402/schemes';
const x402Version = 1;
export const AddBountyPage = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);
    setPaymentStatus(null);
    
    const endpoint = 'http://localhost:3000/question';
    
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const address = getAddress(account);
      console.log('Selected account address:', address);

      const client = createWalletClient({
        account,
        chain: baseSepolia,
        transport: custom(window.ethereum)
      }).extend(publicActions);

      const preflightRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, price, submittedBy: address })
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

      const paymentStatusResult = await exact.evm.settle(client, payment, accepts[0]);
      console.log('Payment status:', paymentStatusResult);
      
      // Store payment status for display
      setPaymentStatus(paymentStatusResult);

      // Encode the payment to base64
      const xPaymentHeader = window.btoa(unescape(encodeURIComponent(JSON.stringify(payment))));

      // Step 3: Actual request with X-PAYMENT header
      const paidRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': xPaymentHeader,
        },
        body: JSON.stringify({ title, description, price, submittedBy: address })
      });

      const data = await paidRes.json();
      setResponse(data);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const getExplorerUrl = (hash, network) => {
    const baseUrls = {
      'base-sepolia': 'https://sepolia.basescan.org/tx/',
      'base': 'https://basescan.org/tx/',
      'ethereum': 'https://etherscan.io/tx/',
      'sepolia': 'https://sepolia.etherscan.io/tx/'
    };
    
    const baseUrl = baseUrls[network] || 'https://sepolia.basescan.org/tx/';
    return `${baseUrl}${hash}`;
  };

  const renderSubmitSection = () => {
    if (loading) {
      return (
        <div className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-lg">Processing Payment...</span>
        </div>
      );
    }

    if (paymentStatus) {
      return (
        <div className="w-full space-y-4">
          {/* Payment Status Card */}
          <div className={`border-2 rounded-lg p-6 ${
            paymentStatus.success 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {paymentStatus.success ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h3 className={`text-xl font-semibold ${
                  paymentStatus.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  Payment {paymentStatus.success ? 'Successful' : 'Failed'}
                </h3>
                <p className={`text-sm ${
                  paymentStatus.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  Network: {paymentStatus.network}
                </p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payer Address
                </label>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border">
                  <code className="text-sm text-gray-800 flex-1">
                    {paymentStatus.payer}
                  </code>
                  <button
                    onClick={() => copyToClipboard(paymentStatus.payer)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Hash
                </label>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border">
                  <code className="text-sm text-gray-800 flex-1">
                    {truncateHash(paymentStatus.transaction)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(paymentStatus.transaction)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <a
                    href={getExplorerUrl(paymentStatus.transaction, paymentStatus.network)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Success Actions */}
          {paymentStatus.success && (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setPrice('');
                  setPaymentStatus(null);
                  setResponse(null);
                  setError(null);
                }}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create Another Bounty
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Retry on Failure */}
          {!paymentStatus.success && (
            <button
              onClick={() => setPaymentStatus(null)}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full space-y-4">
          <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Error Occurred</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setPaymentStatus(null);
            }}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
      >
        Create Bounty
      </button>
    );
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

            <div className="space-y-6">
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
                  disabled={loading || paymentStatus}
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
                  disabled={loading || paymentStatus}
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
                  disabled={loading || paymentStatus}
                />
              </div>

              {renderSubmitSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};