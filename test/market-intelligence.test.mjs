import test from "node:test";
import assert from "node:assert/strict";
import { getEvidenceBasedMarketInsights } from "../lib/insights-service.ts";
import { fetchSocialTrendsForCategories } from "../lib/social-trends-actions.ts";

test("Market Intelligence - Evidence-Based Market Insights Synthesis", async () => {
  const insights = await getEvidenceBasedMarketInsights({
    categories: ["Fashion & Apparel", "Beauty & Personal Care"],
    country: "US",
    timeRange: "30d",
  });

  assert.ok(Array.isArray(insights), "Insights should be an array");
  assert.ok(insights.length >= 2, "Should return at least 2 synthesized insights");

  const first = insights[0];
  assert.ok(first.headline, "Opportunity must have a headline");
  assert.ok(first.topic, "Opportunity must have a topic");
  assert.ok(typeof first.opportunityScore === "number", "Opportunity must have numeric score");
  assert.ok(first.opportunityScore >= 0 && first.opportunityScore <= 100, "Score must be bounded between 0 and 100");
  assert.ok(first.observedSignals, "Opportunity must include observed signals object");
  assert.ok(first.relatedProduct, "Opportunity must include related marketplace product");
  assert.ok(first.relatedContent, "Opportunity must include related social media content");
  assert.ok(first.verificationDisclaimer, "Must include verification disclaimer preventing false claims");
});

test("Market Intelligence - Social Media Trends Fetching", async () => {
  const socialTrends = await fetchSocialTrendsForCategories({
    categories: ["Fashion & Apparel"],
    country: "US",
  });

  assert.ok(Array.isArray(socialTrends), "Social trends should be an array");
  // Each item if returned must follow the SocialContentItem schema
  for (const item of socialTrends) {
    assert.ok(item.id, "Must have an ID");
    assert.ok(["YOUTUBE", "TIKTOK"].includes(item.platform), "Platform must be YOUTUBE or TIKTOK");
    assert.ok(item.title, "Must have title");
    assert.ok(item.growthMetrics, "Must have growth metrics object");
    assert.ok(typeof item.growthMetrics.explanation === "string", "Must explain growth status");
  }
});
