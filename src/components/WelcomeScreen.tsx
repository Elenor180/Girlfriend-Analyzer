import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, TrendingUp, AlertCircle, Key } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (apiKey?: string) => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isLoading }) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleStart = () => {
    if (showApiKeyInput && apiKey.trim()) {
      onStart(apiKey.trim());
    } else if (!showApiKeyInput) {
      onStart();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="glass-effect-strong rounded-3xl p-8 md:p-12 shadow-2xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-zen-indigo-500 to-purple-500 mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Relational Risk Insight
            </h1>
            <p className="text-lg text-zen-gray-300">
              A therapeutic AI companion for relationship clarity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4 mb-8"
          >
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Safe Space"
              description="Confidential, judgment-free therapeutic conversation"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Risk Analysis"
              description="Data-driven insights into relationship health patterns"
            />
            <FeatureCard
              icon={<AlertCircle className="w-6 h-6" />}
              title="Red Flag Detection"
              description="Identify concerning patterns across key relationship dimensions"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4"
          >
            {showApiKeyInput && (
              <div className="glass-effect rounded-xl p-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-zen-gray-300 mb-2">
                  <Key className="w-4 h-4" />
                  OpenAI API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-zen-gray-100 placeholder-zen-gray-500 focus:outline-none focus:ring-2 focus:ring-zen-indigo-500"
                />
                <p className="text-xs text-zen-gray-500 mt-2">
                  Your API key is only used for this session and never stored
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-zen-indigo-600 to-purple-600 hover:from-zen-indigo-500 hover:to-purple-500 text-white rounded-xl px-8 py-4 font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {isLoading ? 'Starting Session...' : 'Begin Therapy Session'}
            </motion.button>

            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="w-full text-sm text-zen-gray-400 hover:text-zen-gray-300 transition-colors"
            >
              {showApiKeyInput ? 'Hide' : 'Have your own'} OpenAI API key?
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-xs text-center text-zen-gray-500 mt-6"
          >
            This tool provides insights, not professional therapy. For serious concerns,
            please consult a licensed therapist.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-effect rounded-xl p-4 flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zen-indigo-500/20 flex items-center justify-center text-zen-indigo-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-zen-gray-100 mb-1">{title}</h3>
        <p className="text-sm text-zen-gray-400">{description}</p>
      </div>
    </div>
  );
};
