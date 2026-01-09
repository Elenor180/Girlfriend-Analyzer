import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 120;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const maxAngle = 270;

  const offset = circumference - (animatedScore / 100) * (circumference * (maxAngle / 360));

  const getColor = (score: number) => {
    if (score >= 75) return '#ef4444';
    if (score >= 50) return '#f97316';
    if (score >= 25) return '#eab308';
    return '#22c55e';
  };

  const getLabel = (score: number) => {
    if (score >= 75) return 'Critical Risk';
    if (score >= 50) return 'High Risk';
    if (score >= 25) return 'Moderate Risk';
    return 'Low Risk';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg className="transform -rotate-[135deg]" width="100%" height="100%" viewBox="0 0 240 240">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={getColor(animatedScore)} stopOpacity="0.3" />
              <stop offset="100%" stopColor={getColor(animatedScore)} stopOpacity="1" />
            </linearGradient>
          </defs>

          <circle
            cx="120"
            cy="120"
            r={normalizedRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * (maxAngle / 360)} ${circumference}`}
          />

          <motion.circle
            cx="120"
            cy="120"
            r={normalizedRadius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${getColor(animatedScore)}40)`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="text-5xl font-bold mb-2" style={{ color: getColor(animatedScore) }}>
              {Math.round(animatedScore)}%
            </div>
            <div className="text-sm text-zen-gray-400 uppercase tracking-wider">
              Risk Score
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 px-6 py-3 rounded-full glass-effect-strong"
      >
        <p className="text-lg font-semibold" style={{ color: getColor(animatedScore) }}>
          {getLabel(animatedScore)}
        </p>
      </motion.div>
    </div>
  );
};
