export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface RedFlag {
  id: string;
  category: 'Communication' | 'Trust' | 'Emotional Intelligence' | 'Future Alignment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  weight: number;
  detectedAt: Date;
}

export interface SessionState {
  sessionId: string;
  messages: Message[];
  redFlags: RedFlag[];
  riskScore: number;
  categories: CategoryScores;
  isComplete: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface CategoryScores {
  communication: number;
  trust: number;
  emotionalIntelligence: number;
  futureAlignment: number;
}

export interface RiskAnalysis {
  overallScore: number;
  categories: CategoryScores;
  redFlags: RedFlag[];
  recommendation: string;
  nextSteps: string[];
  investmentAdvice: 'High Risk - Proceed with Caution' | 'Moderate Risk - Address Concerns' | 'Low Risk - Healthy Foundation' | 'Critical Risk - Consider Ending';
}
