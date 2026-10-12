export interface RawTrendSignals {
  title: string;
  category: string;
  country: string;
  searchVolumeDeltaPct?: number | null; // e.g. +35%
  viewGrowthVelocityPct?: number | null; // e.g. +85%
  competitorPriceRange?: { min: number; max: number; avg: number } | null;
  listingCount?: number | null; // market supply / competition
  inStockRatio?: number | null; // e.g. 0.85 (lower in-stock can indicate unmet demand gap)
  crossSourceConfirmations: string[]; // ["AMAZON", "YOUTUBE", "TIKTOK"]
  observationPeriodDays: number;
}

export interface ScoringWeights {
  viewMomentum: number; // default 0.30
  searchVelocity: number; // default 0.25
  supplyOpportunity: number; // default 0.20
  crossPlatformBonus: number; // default 0.25
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  viewMomentum: 0.30,
  searchVelocity: 0.25,
  supplyOpportunity: 0.20,
  crossPlatformBonus: 0.25,
};

export interface CalculatedOpportunityScore {
  title: string;
  category: string;
  opportunityScore: number; // 0 - 100
  confidenceScore: number; // 0.0 - 1.0 based on available data completeness
  dataCoverage: "HIGH" | "MEDIUM" | "PARTIAL" | "LOW";
  signals: {
    viewMomentumScore: number;
    searchVelocityScore: number;
    supplyOpportunityScore: number;
    crossPlatformScore: number;
  };
  evidence: {
    supportingSources: string[];
    periodAnalyzed: string;
    whyIdentified: string[];
    missingData: string[];
    dataCoverageDescription: string;
  };
}

/**
 * Deterministic, explainable server-side opportunity scoring algorithm.
 * Accounts for missing data and does NOT treat missing metrics as negative performance.
 */
export function calculateOpportunityScore(
  signals: RawTrendSignals,
  customWeights?: Partial<ScoringWeights>
): CalculatedOpportunityScore {
  const weights: ScoringWeights = {
    ...DEFAULT_SCORING_WEIGHTS,
    ...(customWeights || {}),
  };

  const whyIdentified: string[] = [];
  const missingData: string[] = [];
  let availableWeightSum = 0;
  let weightedScoreAccumulator = 0;

  // 1. Social View Momentum Signal
  let viewScore = 50; // neutral fallback
  if (signals.viewGrowthVelocityPct != null) {
    availableWeightSum += weights.viewMomentum;
    // Map -50%..+150% to 10..100
    const normalized = Math.min(100, Math.max(10, 50 + signals.viewGrowthVelocityPct * 0.4));
    viewScore = Math.round(normalized);
    weightedScoreAccumulator += viewScore * weights.viewMomentum;

    if (signals.viewGrowthVelocityPct > 25) {
      whyIdentified.push(
        `High social view velocity: +${signals.viewGrowthVelocityPct.toFixed(0)}% growth observed in content views.`
      );
    }
  } else {
    missingData.push("Social content view acceleration trajectory (collecting multi-day observations)");
  }

  // 2. Search Interest Movement Signal
  let searchScore = 50;
  if (signals.searchVolumeDeltaPct != null) {
    availableWeightSum += weights.searchVelocity;
    const normalized = Math.min(100, Math.max(10, 50 + signals.searchVolumeDeltaPct * 0.5));
    searchScore = Math.round(normalized);
    weightedScoreAccumulator += searchScore * weights.searchVelocity;

    if (signals.searchVolumeDeltaPct > 15) {
      whyIdentified.push(
        `Rising search queries: +${signals.searchVolumeDeltaPct.toFixed(0)}% movement in buyer search queries.`
      );
    }
  } else {
    missingData.push("Verified search engine query historical delta");
  }

  // 3. Supply & Competition Opportunity Signal
  let supplyScore = 50;
  if (signals.listingCount != null) {
    availableWeightSum += weights.supplyOpportunity;
    // Lower competition or out-of-stock gap provides higher market opportunity
    let compScore = 60;
    if (signals.listingCount < 25) {
      compScore = 85; // Low saturation gap
      whyIdentified.push("Low marketplace saturation: less than 25 competitive listings currently indexed.");
    } else if (signals.listingCount > 100) {
      compScore = 45; // High saturation
    }

    if (signals.inStockRatio != null && signals.inStockRatio < 0.8) {
      compScore += 10;
      whyIdentified.push(
        `Supply shortage indicator: ${(100 - signals.inStockRatio * 100).toFixed(0)}% of rival listings are currently out-of-stock.`
      );
    }

    supplyScore = Math.min(100, Math.max(15, compScore));
    weightedScoreAccumulator += supplyScore * weights.supplyOpportunity;
  } else {
    missingData.push("Active marketplace seller stock & inventory levels");
  }

  // 4. Cross-Platform Trend Confirmation
  availableWeightSum += weights.crossPlatformBonus;
  const sourcesCount = signals.crossSourceConfirmations.length;
  let crossScore = 30;
  if (sourcesCount >= 3) {
    crossScore = 95;
    whyIdentified.push(
      `Strong multi-source confirmation: Verified across ${signals.crossSourceConfirmations.join(", ")}.`
    );
  } else if (sourcesCount === 2) {
    crossScore = 75;
    whyIdentified.push(
      `Dual-source signal: Corroborated between ${signals.crossSourceConfirmations.join(" and ")}.`
    );
  } else if (sourcesCount === 1) {
    crossScore = 50;
  }
  weightedScoreAccumulator += crossScore * weights.crossPlatformBonus;

  // Normalize final score based strictly on available weights (missing data does not drag down score artificially)
  const finalScore =
    availableWeightSum > 0
      ? Math.round(weightedScoreAccumulator / availableWeightSum)
      : 50;

  // Confidence & Data Coverage Calculation
  const confidenceScore = parseFloat(
    Math.min(0.95, Math.max(0.2, (availableWeightSum / 1.0) * (sourcesCount > 1 ? 1.0 : 0.75))).toFixed(2)
  );

  let dataCoverage: "HIGH" | "MEDIUM" | "PARTIAL" | "LOW" = "PARTIAL";
  if (confidenceScore >= 0.8) dataCoverage = "HIGH";
  else if (confidenceScore >= 0.6) dataCoverage = "MEDIUM";
  else if (confidenceScore >= 0.4) dataCoverage = "PARTIAL";
  else dataCoverage = "LOW";

  const periodAnalyzed = `${signals.observationPeriodDays} days (${signals.country})`;

  return {
    title: signals.title,
    category: signals.category,
    opportunityScore: Math.min(99, Math.max(5, finalScore)),
    confidenceScore,
    dataCoverage,
    signals: {
      viewMomentumScore: viewScore,
      searchVelocityScore: searchScore,
      supplyOpportunityScore: supplyScore,
      crossPlatformScore: crossScore,
    },
    evidence: {
      supportingSources: signals.crossSourceConfirmations,
      periodAnalyzed,
      whyIdentified:
        whyIdentified.length > 0
          ? whyIdentified
          : ["Baseline market activity detected across primary data source."],
      missingData,
      dataCoverageDescription: `${(confidenceScore * 100).toFixed(0)}% data coverage across connected data sources.`,
    },
  };
}
