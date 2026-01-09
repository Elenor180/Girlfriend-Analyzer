import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';
import { RedFlag } from '../types';

interface RedFlagsListProps {
  redFlags: RedFlag[];
}

export const RedFlagsList: React.FC<RedFlagsListProps> = ({ redFlags }) => {
  const groupedFlags = redFlags.reduce((acc, flag) => {
    if (!acc[flag.category]) {
      acc[flag.category] = [];
    }
    acc[flag.category].push(flag);
    return acc;
  }, {} as Record<string, RedFlag[]>);

  if (redFlags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-zen-gray-100 mb-2">
          No Major Concerns Detected
        </h3>
        <p className="text-zen-gray-400">
          Your conversation didn't reveal significant red flags. Continue nurturing healthy communication patterns.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedFlags).map(([category, flags], categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <h3 className="text-lg font-semibold text-zen-gray-100 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zen-indigo-500" />
            {category}
          </h3>
          <div className="space-y-3">
            {flags.map((flag, index) => (
              <motion.div
                key={flag.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                className={`glass-effect rounded-lg p-4 border-l-4 ${getSeverityBorderColor(flag.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-1 ${getSeverityIconColor(flag.severity)}`}>
                    {getSeverityIcon(flag.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${getSeverityTextColor(flag.severity)}`}>
                        {flag.severity}
                      </span>
                      <span className="text-xs text-zen-gray-500">
                        Weight: {flag.weight}/10
                      </span>
                    </div>
                    <p className="text-sm text-zen-gray-300 leading-relaxed">
                      {flag.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <XCircle className="w-5 h-5" />;
    case 'high':
      return <AlertTriangle className="w-5 h-5" />;
    case 'medium':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getSeverityBorderColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'border-red-500';
    case 'high':
      return 'border-orange-500';
    case 'medium':
      return 'border-yellow-500';
    default:
      return 'border-blue-500';
  }
};

const getSeverityIconColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'text-red-400';
    case 'high':
      return 'text-orange-400';
    case 'medium':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};

const getSeverityTextColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'text-red-400';
    case 'high':
      return 'text-orange-400';
    case 'medium':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};
