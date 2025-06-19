import { Bot, MessageCircle, Send, X, Code, Database, Wrench, Brain, Shield, Globe, Zap, Cpu, FileText, ExternalLink, Check, AlertCircle, DollarSign } from "lucide-react";
import { useState } from "react";

const agents = [
  {
    id: 1,
    title: "Operating Systems Expert",
    description: "Specialized in Linux, Windows, macOS troubleshooting and optimization",
    icon: <Cpu className="w-8 h-8" />,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    title: "Blockchain Developer",
    description: "On-chain actions, smart contracts, DeFi protocols, and DApps",
    icon: <Globe className="w-8 h-8" />,
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    title: "Rust Programming",
    description: "Rust development, performance optimization, and systems programming",
    icon: <Code className="w-8 h-8" />,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 4,
    title: "Database Architect",
    description: "SQL, NoSQL, database design, usage and performance tuning",
    icon: <Database className="w-8 h-8" />,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    description: "CI/CD, containerization, cloud infrastructure, and automation",
    icon: <Wrench className="w-8 h-8" />,
    color: "from-red-500 to-red-600"
  },
  {
    id: 6,
    title: "Machine Learning",
    description: "ML models, data science, neural networks, and AI research",
    icon: <Brain className="w-8 h-8" />,
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: 7,
    title: "Cybersecurity",
    description: "Security audits, penetration testing, threat analysis and mitigation",
    icon: <Shield className="w-8 h-8" />,
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: 8,
    title: "Performance Optimizer",
    description: "Code optimization, profiling, and system performance tuning",
    icon: <Zap className="w-8 h-8" />,
    color: "from-pink-500 to-pink-600"
  },
  {
    id: 9,
    title: "Technical Writer",
    description: "Documentation, API guides, and technical communication",
    icon: <FileText className="w-8 h-8" />,
    color: "from-teal-500 to-teal-600"
  }
];

export const AskAIPage = ({ onBack }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUseAgent = (agent) => {
    setSelectedAgent(agent);
    setMessages([
      {
        id: 1,
        text: `Hello! I'm your ${agent.title}. How can I help you today?`,
        sender: "agent",
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const agentPrompt = `You are a ${selectedAgent.title}. ${selectedAgent.description}. 
      
 Please respond to the following user query with expertise in your domain:
 ${currentMessage}`;
      
      const res = await fetch("http://localhost:3000/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: agentPrompt 
        }),
      });

      const data = await res.json();
      console.log(" agent responded with", data);
      console.log(" answer", data.bounty.response);
      console.log(" payment details", data.paymentDetails);
        
      const agentMessage = {
        id: messages.length + 2,
        text: data.bounty.response || "I'm processing your request. This is a placeholder response until the backend is connected.",
        sender: "agent",
        timestamp: new Date(),
        paymentDetails: data.paymentDetails // Include payment details in the message
      };

      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error('Error calling backend:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: "agent",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const closeChatbox = () => {
    setSelectedAgent(null);
    setMessages([]);
    setInputMessage("");
  };

  const TransactionDetails = ({ paymentDetails }) => {
    if (!paymentDetails) return null;

    const { success, transaction } = paymentDetails;

    return (
      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Payment Transaction</span>
          </div>
          <div className="flex items-center space-x-1">
            {success ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">Success</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-600">Failed</span>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-800">0.01 USDC</span>
          </div>
          
          {transaction && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Transaction:</span>
              <div className="flex items-center space-x-1">
                <code className="bg-white px-2 py-1 rounded text-xs font-mono border">
                  {transaction.slice(0, 6)}...{transaction.slice(-4)}
                </code>
                <a
                  href={`https://sepolia.basescan.org/tx/${transaction}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  title="View on Block Explorer"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 italic">
            Payment processed for AI consultation
          </div>
        </div>
      </div>
    );
  };

  if (selectedAgent) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedAgent.color} text-white`}>
              {selectedAgent.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedAgent.title}</h2>
              <p className="text-sm text-gray-600">{selectedAgent.description}</p>
            </div>
          </div>
          <button
            onClick={closeChatbox}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                } px-4 py-2 rounded-2xl`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {/* Transaction Details - only show for agent messages */}
                {message.sender === 'agent' && message.paymentDetails && (
                  <TransactionDetails paymentDetails={message.paymentDetails} />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 shadow-sm border max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Processing payment & generating response...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={onBack}
          className="mb-8 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-12">
          <Bot className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Specialist Agents</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our expert AI agents, each specialized in different domains to help solve your specific challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${agent.color} text-white mb-6`}>
                {agent.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {agent.title}
              </h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {agent.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">0.01</span>
                  <span className="text-sm text-gray-600">USDC per query</span>
                </div>
              </div>

              <button
                onClick={() => handleUseAgent(agent)}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Use Agent</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};