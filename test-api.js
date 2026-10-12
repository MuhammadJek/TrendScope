const fs = require('fs');

async function test() {
  const envFile = fs.readFileSync('.env', 'utf8');
  let apiKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('RAPIDAPI_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  }

  const keyword = "skincareviral";
  const url = `https://tiktok-scraper7.p.rapidapi.com/feed/search?count=15&region=id&cursor=0&publish_time=0&sort_type=0&keywords=${encodeURIComponent(keyword)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com'
    }
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    fs.writeFileSync('tiktok_api_response.json', JSON.stringify(json, null, 2));
    console.log("Response saved to tiktok_api_response.json");
  } catch(e) {
    console.error(e);
  }
}
test();

