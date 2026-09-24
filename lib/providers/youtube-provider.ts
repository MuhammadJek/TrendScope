export class YouTubeQuotaError extends Error {}
export class YouTubeApiError extends Error {}

export class YouTubeProvider {
  constructor(private apiKey: string) {}

  async checkYouTubeHealth() {
    try {
      const res = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&type=video&key=" + this.apiKey);
      if (!res.ok) {
        if (res.status === 403) return { status: "RATE_LIMITED", message: "Quota exceeded or invalid key" };
        return { status: "ERROR", message: "HTTP " + res.status };
      }
      return { status: "CONNECTED", message: "OK" };
    } catch (e: any) {
      return { status: "ERROR", message: e.message };
    }
  }

  async searchYouTubeVideos(params: { query: string, regionCode: string, maxResults: number, order: string }) {
    const searchUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=" + encodeURIComponent(params.query) + "&regionCode=" + params.regionCode + "&maxResults=" + params.maxResults + "&order=" + params.order + "&key=" + this.apiKey;
    
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      if (searchRes.status === 403) throw new YouTubeQuotaError();
      throw new YouTubeApiError("Search failed: " + searchRes.status);
    }
    const searchData = await searchRes.json();
    const items = searchData.items || [];
    
    if (items.length === 0) {
      return {
        query: params.query,
        fromCache: false,
        fetchedAt: new Date().toISOString(),
        totalResults: searchData.pageInfo?.totalResults || 0,
        videos: [],
        provider: "YOUTUBE" as const,
        dataStatus: "OBSERVED",
      };
    }

    const videoIds = items.map((i: any) => i.id.videoId).join(",");
    const statsUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=" + videoIds + "&key=" + this.apiKey;
    
    const statsRes = await fetch(statsUrl);
    if (!statsRes.ok) throw new YouTubeApiError("Stats failed: " + statsRes.status);
    const statsData = await statsRes.json();

    const statsMap = new Map();
    for (const item of statsData.items || []) {
      statsMap.set(item.id, item);
    }

    const videos = items.map((item: any) => {
      const stat = statsMap.get(item.id.videoId);
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        videoUrl: "https://youtube.com/watch?v=" + item.id.videoId,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || null,
        duration: stat?.contentDetails?.duration || null,
        metrics: {
          viewCount: stat?.statistics?.viewCount ? Number(stat.statistics.viewCount) : null,
          likeCount: stat?.statistics?.likeCount ? Number(stat.statistics.likeCount) : null,
          commentCount: stat?.statistics?.commentCount ? Number(stat.statistics.commentCount) : null,
        },
        dataStatus: "OBSERVED" as const,
        source: "YOUTUBE" as const,
        fetchedAt: new Date().toISOString(),
      };
    });

    return {
      query: params.query,
      fromCache: false,
      fetchedAt: new Date().toISOString(),
      totalResults: searchData.pageInfo?.totalResults || 0,
      videos,
      provider: "YOUTUBE" as const,
      dataStatus: "OBSERVED",
    };
  }
}
