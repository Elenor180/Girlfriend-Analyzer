import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';
import { RiskAnalysis } from '../types';
import { RiskGauge } from './RiskGauge';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RedFlagsList } from './RedFlagsList';

interface RiskDashboardProps {
  analysis: RiskAnalysis;
  onReset: () => void;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ analysis, onReset }) => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                Relationship Risk Analysis
              </h1>
              <p className="text-zen-gray-400">
                Comprehensive insights from your therapy session
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="glass-effect-strong hover:bg-white/10 rounded-lg px-4 py-2 font-medium transition-all flex items-center gap-2 text-zen-gray-200"
              >
                <RotateCcw className="w-4 h-4" />
                New Session
              </motion.button>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect-strong rounded-2xl p-8"
          >
            <h2 className="text-xl font-semibold text-zen-gray-100 mb-6 text-center">
              Overall Risk Assessment
            </h2>
            <RiskGauge score={analysis.overallScore} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-effect-strong rounded-2xl p-8"
          >
            <h2 className="text-xl font-semibold text-zen-gray-100 mb-6">
              Category Breakdown
            </h2>
            <CategoryBreakdown categories={analysis.categories} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect-strong rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            {analysis.overallScore >= 50 ? (
              <TrendingUp className="w-6 h-6 text-orange-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-green-400" />
            )}
            <h2 className="text-xl font-semibold text-zen-gray-100">
              Investment Recommendation
            </h2>
          </div>
          <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getAdviceColor(analysis.investmentAdvice)}`}>
            <p className="font-semibold">{analysis.investmentAdvice}</p>
          </div>
          <p className="text-zen-gray-300 leading-relaxed">{analysis.recommendation}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect-strong rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-zen-gray-100">
              Recommended Next Steps
            </h2>
          </div>
          <div className="space-y-3">
            {analysis.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zen-indigo-500/20 flex items-center justify-center text-zen-indigo-400 text-sm font-semibold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-zen-gray-300 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-effect-strong rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold text-zen-gray-100 mb-6">
            Identified Concerns
          </h2>
          <RedFlagsList redFlags={analysis.redFlags} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-zen-gray-500">
            This analysis is for informational purposes only and does not replace professional therapy.
            If you're experiencing distress, please reach out to a licensed mental health professional.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const getAdviceColor = (advice: string): string => {
  if (advice.includes('Critical')) return 'bg-red-500/20 text-red-300';
  if (advice.includes('High')) return 'bg-orange-500/20 text-orange-300';
  if (advice.includes('Moderate')) return 'bg-yellow-500/20 text-yellow-300';
  return 'bg-green-500/20 text-green-300';
};
