import { RedFlag, CategoryScores, RiskAnalysis } from '../types';

const SEVERITY_WEIGHTS = {
  low: 1,
  medium: 2.5,
  high: 5,
  critical: 10,
};

export class ScoringEngine {
  calculateCategoryScore(redFlags: RedFlag[], category: string): number {
    const categoryFlags = redFlags.filter(flag =>
      flag.category.toLowerCase().replace(/\s+/g, '') === category.toLowerCase().replace(/\s+/g, '')
    );

    if (categoryFlags.length === 0) return 0;

    const totalWeight = categoryFlags.reduce((sum, flag) => {
      return sum + (flag.weight * SEVERITY_WEIGHTS[flag.severity]);
    }, 0);

    const maxPossibleScore = categoryFlags.length * 10 * SEVERITY_WEIGHTS.critical;

    return Math.min(100, (totalWeight / maxPossibleScore) * 100);
  }

  calculateOverallScore(categories: CategoryScores): number {
    const categoryWeights = {
      communication: 0.30,
      trust: 0.35,
      emotionalIntelligence: 0.20,
      futureAlignment: 0.15,
    };

    const weightedScore =
      categories.communication * categoryWeights.communication +
      categories.trust * categoryWeights.trust +
      categories.emotionalIntelligence * categoryWeights.emotionalIntelligence +
      categories.futureAlignment * categoryWeights.futureAlignment;

    return Math.round(weightedScore);
  }

  generateRecommendation(score: number, redFlags: RedFlag[]): string {
    const criticalFlags = redFlags.filter(f => f.severity === 'critical');
    const highFlags = redFlags.filter(f => f.severity === 'high');

    if (score >= 75 || criticalFlags.length > 0) {
      return "This relationship shows significant red flags that warrant serious consideration. The patterns identified suggest potential for emotional harm or incompatibility. It's important to prioritize your wellbeing and consider whether this relationship serves your best interests.";
    } else if (score >= 50 || highFlags.length >= 2) {
      return "There are notable concerns in this relationship that deserve attention and open communication. While not necessarily deal-breakers, these issues could escalate if left unaddressed. Consider having honest conversations about these patterns and observe whether meaningful change occurs.";
    } else if (score >= 25) {
      return "Your relationship shows some areas of concern, but these are common challenges that many couples face. With awareness and effort from both partners, these issues can be addressed constructively. Focus on strengthening communication and maintaining healthy boundaries.";
    } else {
      return "Based on our conversation, your relationship appears to have a relatively healthy foundation. While no relationship is perfect, the patterns discussed suggest mutual respect, good communication, and emotional maturity. Continue nurturing these positive dynamics.";
    }
  }

  generateNextSteps(_score: number, redFlags: RedFlag[]): string[] {
    const steps: string[] = [];
    const criticalFlags = redFlags.filter(f => f.severity === 'critical');
    const categories = new Set(redFlags.map(f => f.category));

    if (criticalFlags.length > 0) {
      steps.push("Consider reaching out to a licensed therapist or counselor who specializes in relationships");
      steps.push("Establish clear boundaries and communicate your non-negotiables");
      steps.push("Create a safety plan if you feel emotionally or physically unsafe");
    }

    if (categories.has('Communication')) {
      steps.push("Practice active listening and 'I' statements to express feelings without blame");
      steps.push("Schedule regular check-ins to discuss relationship health openly");
    }

    if (categories.has('Trust')) {
      steps.push("Identify specific trust issues and discuss them transparently with your partner");
      steps.push("Observe whether your partner's actions align with their words over time");
    }

    if (categories.has('Emotional Intelligence')) {
      steps.push("Notice how your partner responds to your emotions and needs");
      steps.push("Consider whether emotional validation is reciprocal in your relationship");
    }

    if (categories.has('Future Alignment')) {
      steps.push("Have honest conversations about long-term goals and values");
      steps.push("Discuss non-negotiables like children, location, career, and lifestyle preferences");
    }

    if (steps.length === 0) {
      steps.push("Continue fostering open communication and emotional connection");
      steps.push("Regularly check in with yourself about your happiness and fulfillment");
      steps.push("Celebrate the positive aspects of your relationship");
    }

    return steps.slice(0, 5);
  }

  getInvestmentAdvice(score: number): RiskAnalysis['investmentAdvice'] {
    if (score >= 75) return 'Critical Risk - Consider Ending';
    if (score >= 50) return 'High Risk - Proceed with Caution';
    if (score >= 25) return 'Moderate Risk - Address Concerns';
    return 'Low Risk - Healthy Foundation';
  }

  analyzeSession(redFlags: RedFlag[]): RiskAnalysis {
    const categories: CategoryScores = {
      communication: this.calculateCategoryScore(redFlags, 'communication'),
      trust: this.calculateCategoryScore(redFlags, 'trust'),
      emotionalIntelligence: this.calculateCategoryScore(redFlags, 'emotionalintelligence'),
      futureAlignment: this.calculateCategoryScore(redFlags, 'futurealignment'),
    };

    const overallScore = this.calculateOverallScore(categories);
    const recommendation = this.generateRecommendation(overallScore, redFlags);
    const nextSteps = this.generateNextSteps(overallScore, redFlags);
    const investmentAdvice = this.getInvestmentAdvice(overallScore);

    return {
      overallScore,
      categories,
      redFlags,
      recommendation,
      nextSteps,
      investmentAdvice,
    };
  }
}

export const scoringEngine = new ScoringEngine();
