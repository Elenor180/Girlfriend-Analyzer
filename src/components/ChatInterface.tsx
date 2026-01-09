import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { useTherapy } from '../context/TherapyContext';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  onComplete: () => void;
  apiKey?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete, apiKey }) => {
  const { sessionState, sendMessage, isLoading, error } = useTherapy();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);
  const minMessages = 10;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionState?.messages]);

  useEffect(() => {
    if (sessionState?.messages) {
      const userMessages = sessionState.messages.filter(m => m.role === 'user');
      setMessageCount(userMessages.length);
    }
  }, [sessionState?.messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, apiKey);
  };

  const canComplete = messageCount >= minMessages;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-effect-strong border-b border-white/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-zen-gray-100">
                Therapy Session
              </h2>
              <p className="text-sm text-zen-gray-400 mt-1">
                {messageCount} / {minMessages} exchanges minimum
              </p>
            </div>
            {canComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg px-4 py-2 font-medium transition-all shadow-lg text-sm md:text-base"
              >
                View Analysis
              </motion.button>
            )}
          </div>

          {sessionState && sessionState.redFlags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 glass-effect rounded-lg p-3 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-zen-gray-300">
                {sessionState.redFlags.length} concern
                {sessionState.redFlags.length !== 1 ? 's' : ''} identified
              </p>
            </motion.div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 glass-effect border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-medium">Error</p>
                <p className="text-sm text-zen-gray-300 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {sessionState?.messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
          </div>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-6"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full glass-effect-strong flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-zen-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="glass-effect rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zen-indigo-400 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-zen-indigo-400 rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-2 bg-zen-indigo-400 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="glass-effect-strong border-t border-white/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          {!canComplete && (
            <p className="text-xs text-center text-zen-gray-500 mt-3">
              Continue the conversation to unlock your risk analysis report
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};
