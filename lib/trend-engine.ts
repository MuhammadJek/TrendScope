import { TrendSnapshot, KeywordMetric } from "@prisma/client"; // assuming types are generated

export interface ScoredTrend {
  keyword: string;
  baseScore: number;       // 0 - 100
  momentumScore: number;   // 0 - 100 (short term growth)
  competitionPenalty: number;
  finalScore: number;
  label: "EXPLODING" | "STEADY" | "DECLINING" | "NEW";
}

/**
 * Trend Engine: Normalizes disparate data sources into a proprietary 0-100 TrendScore.
 */
export class TrendEngine {
  
  /**
   * Calculate a normalized score based on historical snapshots and keyword metrics.
   */
  public calculateScore(
    snapshots: TrendSnapshot[], 
    keywordMetric?: KeywordMetric
  ): ScoredTrend {
    if (!snapshots || snapshots.length === 0) {
      return this.defaultScore();
    }

    // Sort chronologically
    snapshots.sort((a, b) => a.date.getTime() - b.date.getTime());

    const values = snapshots.map(s => s.value);
    const latestValue = values[values.length - 1];
    
    // 1. Base Score (Volume / Current Interest normalized)
    // Assumes snapshot values are usually 0-100 (like Google Trends)
    const baseScore = Math.min(100, Math.max(0, latestValue));

    // 2. Momentum (Growth over recent periods)
    // Compare last 3 days average vs previous 10 days average
    const momentumScore = this.calculateMomentum(values);

    // 3. Competition Penalty (from Google Ads)
    let competitionPenalty = 0;
    if (keywordMetric) {
      if (keywordMetric.competition === "HIGH") competitionPenalty = 15;
      else if (keywordMetric.competition === "MEDIUM") competitionPenalty = 5;
      else if (keywordMetric.competition === "LOW") competitionPenalty = 0;
    }

    // 4. Final Score Aggregation
    // Weight: 60% momentum, 40% base, minus penalty
    let finalScore = (momentumScore * 0.6) + (baseScore * 0.4) - competitionPenalty;
    finalScore = Math.min(100, Math.max(0, Math.round(finalScore)));

    // 5. Classification Label
    let label: ScoredTrend["label"] = "STEADY";
    if (finalScore >= 80 && momentumScore > 70) label = "EXPLODING";
    else if (momentumScore < 30 && finalScore < 40) label = "DECLINING";
    else if (snapshots.length < 5) label = "NEW";

    return {
      keyword: snapshots[0].keywordId,
      baseScore: Math.round(baseScore),
      momentumScore: Math.round(momentumScore),
      competitionPenalty,
      finalScore,
      label
    };
  }

  private calculateMomentum(values: number[]): number {
    if (values.length < 4) return 50; // Not enough data for momentum

    const recent = values.slice(-3); // Last 3 periods
    const older = values.slice(0, -3); // Everything before

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    if (olderAvg === 0 && recentAvg > 0) return 100; // infinite growth
    if (olderAvg === 0) return 0; // dead

    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

    // Map percentage change (-100% to +200%) to a 0-100 score
    // -50% change = 0 score
    // 0% change = 50 score
    // +100% change = 100 score
    let score = 50 + (percentChange / 2);
    
    return Math.min(100, Math.max(0, score));
  }

  private defaultScore(): ScoredTrend {
    return {
      keyword: "unknown",
      baseScore: 0,
      momentumScore: 0,
      competitionPenalty: 0,
      finalScore: 0,
      label: "NEW"
    };
  }
}

