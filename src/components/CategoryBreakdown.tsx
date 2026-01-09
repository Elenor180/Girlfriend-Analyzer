import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Brain, Target } from 'lucide-react';
import { CategoryScores } from '../types';

interface CategoryBreakdownProps {
  categories: CategoryScores;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  const categoryData = [
    {
      name: 'Communication',
      score: categories.communication,
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Trust',
      score: categories.trust,
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Emotional Intelligence',
      score: categories.emotionalIntelligence,
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Future Alignment',
      score: categories.futureAlignment,
      icon: Target,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="space-y-4">
      {categoryData.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="glass-effect rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-zen-gray-100">{category.name}</h3>
            </div>
            <span className={`text-lg font-bold ${getScoreColor(category.score)}`}>
              {Math.round(category.score)}%
            </span>
          </div>

          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${category.score}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${category.color} rounded-full`}
              style={{
                boxShadow: `0 0 10px ${category.color}40`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const getScoreColor = (score: number): string => {
  if (score >= 75) return 'text-red-400';
  if (score >= 50) return 'text-orange-400';
  if (score >= 25) return 'text-yellow-400';
  return 'text-green-400';
};
