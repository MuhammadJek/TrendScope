import test from "node:test";
import assert from "node:assert/strict";

// Import compiled function or test logic directly
import { calculateOpportunityScore, DEFAULT_SCORING_WEIGHTS } from "../lib/scoring/opportunity-score.ts";

test("Opportunity Scoring Engine - High Multi-Source Signal", () => {
  const result = calculateOpportunityScore({
    title: "Minimalist Ergonomic Desk Lamp",
    category: "Home & Living",
    country: "US",
    searchVolumeDeltaPct: 45,
    viewGrowthVelocityPct: 120,
    listingCount: 18,
    inStockRatio: 0.75,
    crossSourceConfirmations: ["AMAZON", "EBAY", "YOUTUBE"],
    observationPeriodDays: 30,
  });

  assert.ok(result.opportunityScore >= 75, `Expected score >= 75, got ${result.opportunityScore}`);
  assert.equal(result.dataCoverage, "HIGH");
  assert.ok(result.confidenceScore >= 0.8);
  assert.ok(result.evidence.whyIdentified.length >= 3);
  assert.equal(result.evidence.supportingSources.length, 3);
});

test("Opportunity Scoring Engine - Missing Data Graceful Scaling", () => {
  const result = calculateOpportunityScore({
    title: "Eco Friendly Bamboo Straws",
    category: "Home & Living",
    country: "US",
    searchVolumeDeltaPct: null, // missing search
    viewGrowthVelocityPct: null, // missing view growth
    listingCount: 50,
    inStockRatio: 1.0,
    crossSourceConfirmations: ["EBAY"],
    observationPeriodDays: 7,
  });

  // Should NOT crash and should not treat missing as catastrophic negative
  assert.ok(result.opportunityScore > 20 && result.opportunityScore < 80);
  assert.ok(result.evidence.missingData.length >= 2);
  assert.equal(result.dataCoverage, "LOW");
});

test("Opportunity Scoring Engine - Custom Weights Application", () => {
  const defaultRes = calculateOpportunityScore({
    title: "Wireless Noise Cancelling Earbuds",
    category: "Electronics",
    country: "US",
    searchVolumeDeltaPct: 80,
    viewGrowthVelocityPct: 10,
    listingCount: 30,
    crossSourceConfirmations: ["AMAZON"],
    observationPeriodDays: 14,
  });

  const heavySearchRes = calculateOpportunityScore(
    {
      title: "Wireless Noise Cancelling Earbuds",
      category: "Electronics",
      country: "US",
      searchVolumeDeltaPct: 80,
      viewGrowthVelocityPct: 10,
      listingCount: 30,
      crossSourceConfirmations: ["AMAZON"],
      observationPeriodDays: 14,
    },
    { searchVelocity: 0.8, viewMomentum: 0.1, supplyOpportunity: 0.05, crossPlatformBonus: 0.05 }
  );

  assert.ok(
    heavySearchRes.opportunityScore > defaultRes.opportunityScore,
    "Heavy search weight should boost score when search growth is +80%"
  );
});
