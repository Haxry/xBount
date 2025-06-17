import React, { useState } from 'react';
import { AskAIPage } from './components/AskAIPage';
import { AddBountyPage } from './components/AddBountyPage';
import { HomePage } from './components/HomePage';

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
