export class WikipediaProvider {
  async searchWikipediaArticle(keyword: string, language: string = "id") {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&utf8=&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Wiki search failed");
    const data = await res.json();
    if (data.query?.search?.length > 0) {
      return { articleTitle: data.query.search[0].title };
    }
    return { articleTitle: null };
  }

  async getWikipediaPageviews(articleTitle: string, language: string, startStr: string, endStr: string) {
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${language}.wikipedia.org/all-access/user/${encodeURIComponent(articleTitle)}/daily/${startStr}/${endStr}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        return {
          keyword: articleTitle,
          article: articleTitle,
          language,
          fromCache: false,
          fetchedAt: new Date().toISOString(),
          totalViews: 0,
          peakViews: 0,
          peakDate: null,
          averageDailyViews: 0,
          dataPoints: [],
          provider: "WIKIPEDIA" as const,
          dataStatus: "NOT_FOUND",
          articleUrl: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}`,
          disclaimer: "Article found but no pageview data.",
        };
      }
      throw new Error(`Wiki API error: ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || [];
    
    const dataPoints = items.map((item: any) => ({
      date: item.timestamp.slice(0, 8),
      views: item.views,
      source: "WIKIPEDIA",
    }));

    let totalViews = 0;
    let peakViews = 0;
    let peakDate = null;
    
    for (const p of dataPoints) {
      totalViews += p.views;
      if (p.views > peakViews) {
        peakViews = p.views;
        peakDate = p.date;
      }
    }

    return {
      keyword: articleTitle,
      article: articleTitle,
      language,
      fromCache: false,
      fetchedAt: new Date().toISOString(),
      totalViews,
      peakViews,
      peakDate,
      averageDailyViews: items.length > 0 ? Math.round(totalViews / items.length) : 0,
      dataPoints,
      provider: "WIKIPEDIA" as const,
      dataStatus: "OBSERVED",
      articleUrl: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}`,
      disclaimer: "Measures article interest, not purchase intent.",
    };
  }
}
