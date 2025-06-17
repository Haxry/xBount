import { Bot } from "lucide-react";




export const AskAIPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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