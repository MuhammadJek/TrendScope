export interface TiktokVideoResult {
  videoId: string;
  authorName: string;
  description: string;
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  url: string;
}

export interface TiktokTrendResult {
  keyword: string;
  totalViewsEstimate: number;
  videos: TiktokVideoResult[];
}

/**
 * Service untuk mem-fetch data TikTok.
 * Karena TikTok sulit di-scrape, kita gunakan 2 layer strategi:
 * 1. RapidAPI (Jika tersedia & limit belum habis)
 * 2. Mock Data Generator (Sangat realistis untuk testing/demo)
 */
export async function fetchTiktokData(keyword: string): Promise<TiktokTrendResult> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (apiKey) {
    try {
      // Menggunakan tiktok-scraper7 sesuai request terbaru
      const url = `https://tiktok-scraper7.p.rapidapi.com/feed/search?count=15&region=id&cursor=0&publish_time=0&sort_type=0&keywords=${encodeURIComponent(keyword)}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
        }
      };

      const res = await fetch(url, options);
      
      if (res.ok) {
        const responseData = await res.json();
        
        // tiktok-scraper7 biasanya meletakkan array video di responseData.data.videos
        let items: any[] = [];
        if (responseData.data && Array.isArray(responseData.data.videos)) {
          items = responseData.data.videos;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          items = responseData.data;
        } else if (responseData.items && Array.isArray(responseData.items)) {
          items = responseData.items;
        }
        
        // Smart fallback jika struktur json masih berbeda
        if (items.length === 0) {
          for (const key in responseData) {
            if (Array.isArray(responseData[key])) {
              items = responseData[key];
              break;
            }
          }
        }

        if (items.length > 0) {
          const videos: TiktokVideoResult[] = items.map((item: any) => {
            const author = item.author || {};
            const stats = item.statistics || item.stats || item; // tiktok-scraper7 menaruh stats di root (item)

            // tiktok-scraper7 sometimes puts an alphanumeric proxy token in 'aweme_id' and the real numeric ID in 'video_id'
            const videoId = item.video_id || item.aweme_id || item.id || `vid_${Math.random()}`;
            const uniqueId = author.unique_id || author.sec_uid || 'user';
            
            // tiktok-scraper7 menamai deskripsi sebagai 'title'
            const description = item.title || item.desc || item.content_desc || "";
            
            // Coba ambil share_url asli dari API agar link tidak rusak
            const realUrl = item.share_url || (item.share_info && item.share_info.share_url) || `https://www.tiktok.com/@${uniqueId}/video/${videoId}`;

            return {
              videoId: String(videoId),
              authorName: author.nickname || uniqueId || "TikTok User",
              description: description,
              viewsCount: Number(stats.play_count || stats.viewCount || stats.playCount || 0),
              likesCount: Number(stats.digg_count || stats.likeCount || stats.diggCount || 0),
              sharesCount: Number(stats.share_count || stats.shareCount || 0),
              commentsCount: Number(stats.comment_count || stats.commentCount || 0),
              url: realUrl
            };
          });

          // Hapus video yang tidak memiliki metrics valid
          const validVideos = videos.filter(v => v.viewsCount > 0 || v.likesCount > 0);

          if (validVideos.length > 0) {
            const totalViews = validVideos.reduce((acc, curr) => acc + curr.viewsCount, 0);

            return {
              keyword,
              totalViewsEstimate: totalViews,
              videos: validVideos
            };
          }
        }
      }
    } catch (error) {
      console.warn("Gagal memanggil RapidAPI TikTok, menggunakan fallback mock data...", error);
    }
  }

  // Lapis 2: Fallback Mock Data Gen-Z (Jika tidak ada API Key atau API Error / Limit Habis)
  return generateTiktokMockData(keyword);
}

function generateTiktokMockData(keyword: string): TiktokTrendResult {
  const genZNames = [
    "Dina TikTok", "Bang Rian ✌️", "Siscaa", "Koko Review", 
    "Andi Gadget", "Neng Mawar 🌸", "Reviewer Jujur", "Cari Diskon",
    "Racun TikTok", "Mas Bro Tech", "Bukan Sepuh", "Suhu Belanja"
  ];
  
  const hypeWords = ["Gila sih", "Wajib punya!", "Racun banget", "Sumpah ini bagus", "Jangan sampai kehabisan", "Murah meriah muntah", "Bikin nagih"];
  
  const videos: TiktokVideoResult[] = [];
  let totalViews = 0;

  // Generate 10-15 random videos
  const numVideos = Math.floor(Math.random() * 6) + 10; 

  for (let i = 0; i < numVideos; i++) {
    const isSuperViral = Math.random() > 0.8;
    const baseViews = isSuperViral ? (1000000 + Math.floor(Math.random() * 5000000)) : (50000 + Math.floor(Math.random() * 950000));
    const views = baseViews;
    const likes = Math.floor(views * (0.05 + Math.random() * 0.1)); // 5-15% dari views
    const comments = Math.floor(likes * (0.01 + Math.random() * 0.05)); // 1-5% dari likes
    const shares = Math.floor(likes * (0.02 + Math.random() * 0.08)); 
    
    totalViews += views;

    const creatorName = genZNames[Math.floor(Math.random() * genZNames.length)];
    const hype = hypeWords[Math.floor(Math.random() * hypeWords.length)];

    videos.push({
      videoId: `mock_vid_${Date.now()}_${i}`,
      authorName: creatorName,
      description: `${hype}!!! Review ${keyword} yang lagi viral banget. Langsung cek keranjang kuning! 👇🔥 #fyp #${keyword.replace(/\s+/g, '')} #racuntiktok`,
      viewsCount: views,
      likesCount: likes,
      sharesCount: shares,
      commentsCount: comments,
      url: `https://www.tiktok.com/search?q=${encodeURIComponent(keyword)}` // Dummy URL
    });
  }

  // Urutkan berdasarkan views (terbanyak di atas)
  videos.sort((a, b) => b.viewsCount - a.viewsCount);

  return {
    keyword,
    totalViewsEstimate: totalViews,
    videos
  };
}
