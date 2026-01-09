import React, { createContext, useContext, useState, useCallback } from 'react';
import { SessionState, Message, RedFlag, RiskAnalysis } from '../types';
import { supabase } from '../lib/supabase';
import { scoringEngine } from '../lib/scoringEngine';

interface TherapyContextType {
  sessionState: SessionState | null;
  isLoading: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  sendMessage: (content: string, openaiApiKey?: string) => Promise<void>;
  completeSession: () => Promise<RiskAnalysis | null>;
  resetSession: () => void;
  riskAnalysis: RiskAnalysis | null;
}

const TherapyContext = createContext<TherapyContextType | undefined>(undefined);

export const useTherapy = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapy must be used within TherapyProvider');
  }
  return context;
};

export const TherapyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);

  const startSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          started_at: new Date().toISOString(),
          is_complete: false,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      const initialMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello, I'm here to help you reflect on your relationship. This is a safe, judgment-free space. Let's start with something simple: How long have you been in your current relationship?",
        timestamp: new Date(),
      };

      await supabase.from('messages').insert({
        session_id: session.id,
        role: initialMessage.role,
        content: initialMessage.content,
        timestamp: initialMessage.timestamp.toISOString(),
      });

      setSessionState({
        sessionId: session.id,
        messages: [initialMessage],
        redFlags: [],
        riskScore: 0,
        categories: {
          communication: 0,
          trust: 0,
          emotionalIntelligence: 0,
          futureAlignment: 0,
        },
        isComplete: false,
        startedAt: new Date(session.started_at),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string, openaiApiKey?: string) => {
    if (!sessionState) return;

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      await supabase.from('messages').insert({
        session_id: sessionState.sessionId,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: userMessage.timestamp.toISOString(),
      });

      const updatedMessages = [...sessionState.messages, userMessage];
      setSessionState(prev => prev ? { ...prev, messages: updatedMessages } : null);

      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/therapy-chat`;
      const headers: HeadersInit = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: conversationHistory,
          openaiApiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      await supabase.from('messages').insert({
        session_id: sessionState.sessionId,
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp.toISOString(),
      });

      const newRedFlags: RedFlag[] = [];
      if (data.redFlags && Array.isArray(data.redFlags)) {
        for (const flag of data.redFlags) {
          const redFlag: RedFlag = {
            id: crypto.randomUUID(),
            category: flag.category,
            severity: flag.severity,
            description: flag.description,
            weight: flag.weight,
            detectedAt: new Date(),
          };

          await supabase.from('red_flags').insert({
            session_id: sessionState.sessionId,
            category: redFlag.category,
            severity: redFlag.severity,
            description: redFlag.description,
            weight: redFlag.weight,
            detected_at: redFlag.detectedAt.toISOString(),
          });

          newRedFlags.push(redFlag);
        }
      }

      setSessionState(prev => {
        if (!prev) return null;
        const allRedFlags = [...prev.redFlags, ...newRedFlags];
        const categories = {
          communication: scoringEngine.calculateCategoryScore(allRedFlags, 'communication'),
          trust: scoringEngine.calculateCategoryScore(allRedFlags, 'trust'),
          emotionalIntelligence: scoringEngine.calculateCategoryScore(allRedFlags, 'emotionalintelligence'),
          futureAlignment: scoringEngine.calculateCategoryScore(allRedFlags, 'futurealignment'),
        };
        const riskScore = scoringEngine.calculateOverallScore(categories);

        return {
          ...prev,
          messages: [...prev.messages, assistantMessage],
          redFlags: allRedFlags,
          riskScore,
          categories,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionState]);

  const completeSession = useCallback(async (): Promise<RiskAnalysis | null> => {
    if (!sessionState) return null;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = scoringEngine.analyzeSession(sessionState.redFlags);

      await supabase
        .from('sessions')
        .update({
          is_complete: true,
          completed_at: new Date().toISOString(),
          risk_score: analysis.overallScore,
        })
        .eq('id', sessionState.sessionId);

      setSessionState(prev => prev ? { ...prev, isComplete: true, completedAt: new Date() } : null);
      setRiskAnalysis(analysis);

      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete session');
      console.error('Error completing session:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionState]);

  const resetSession = useCallback(() => {
    setSessionState(null);
    setRiskAnalysis(null);
    setError(null);
  }, []);

  return (
    <TherapyContext.Provider
      value={{
        sessionState,
        isLoading,
        error,
        startSession,
        sendMessage,
        completeSession,
        resetSession,
        riskAnalysis,
      }}
    >
      {children}
    </TherapyContext.Provider>
  );
};
