const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const port = 8999;
app.use(express.static('public'));

app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const apiKey = 'AIzaSyBXgQ0uKTO0rjF3PvGDsjGiczkCv5w5OP4'; // Replace with your actual YouTube Data API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=${encodeURIComponent(searchTerm)}&key=${apiKey}`;

    const response = await axios.get(apiUrl);
    if (response.data.items.length === 0) {
      throw new Error('No videos found for the given search term.');
    }

    const videoId = response.data.items[0].id.videoId;
    const info = await ytdl.getInfo(videoId);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioURL = audioFormats[0].url;

    res.json({ audioURL });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch the video' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
