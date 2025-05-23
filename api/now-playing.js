export default async function handler(req, res) {
  const LASTFM_API_KEY = "d74f9fdb9c79a50ffac2ca0700892ca1";
  const username = "yumenism";
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&extended=true&api_key=${LASTFM_API_KEY}&limit=1&user=${username}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const trackData = data.recenttracks.track[0];

    const trackName = trackData.name;
    const trackUrl = trackData.url;
    const artistName = trackData.artist.name;
    const artistUrl = trackData.artist.url;

    const svg = `
<svg width="305" height="50" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'UnifontExMono';
      src: url('/public/Unifontexmono-2vrqo.ttf');
    }

    text {
      font-family: 'UnifontExMono';
      font-size: 12px;
      fill: white;
      margin-left: 2px;
    }
    a {
      text-decoration: none;
    }
  </style>
  <a href="${trackUrl}" target="_blank">
    <text x="55" y="22">${trackName}</text>
  </a>
  <a href="${artistUrl}" target="_blank">
    <text x="55" y="38">${artistName}</text>
  </a>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).send(svg);
  } catch (error) {
    console.error("Error fetching Last.fm data:", error);
    res.status(500).send("Failed to fetch Last.fm data");
  }
} 
