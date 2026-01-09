import React, { useState } from 'react';
import { TherapyProvider, useTherapy } from './context/TherapyContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { RiskDashboard } from './components/RiskDashboard';

type AppState = 'welcome' | 'chat' | 'results';

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [apiKey, setApiKey] = useState<string | undefined>();
  const { startSession, completeSession, resetSession, isLoading, riskAnalysis } = useTherapy();

  const handleStartSession = async (key?: string) => {
    setApiKey(key);
    await startSession();
    setAppState('chat');
  };

  const handleCompleteSession = async () => {
    const analysis = await completeSession();
    if (analysis) {
      setAppState('results');
    }
  };

  const handleReset = () => {
    resetSession();
    setAppState('welcome');
    setApiKey(undefined);
  };

  return (
    <>
      {appState === 'welcome' && (
        <WelcomeScreen onStart={handleStartSession} isLoading={isLoading} />
      )}

      {appState === 'chat' && (
        <ChatInterface onComplete={handleCompleteSession} apiKey={apiKey} />
      )}

      {appState === 'results' && riskAnalysis && (
        <RiskDashboard analysis={riskAnalysis} onReset={handleReset} />
      )}
    </>
  );
};

function App() {
  return (
    <TherapyProvider>
      <AppContent />
    </TherapyProvider>
  );
}

export default App;
