const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Load .env file

const app = express();
const PORT = 3000;

// Serve static files (HTML/CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Weather API base URL and API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = process.env.WEATHER_API_KEY;

// Routes

// 1. Home Route (serve the HTML file)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Weather API Route
app.post('/weather', async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Celsius
      },
    });

    const { main, weather, name } = response.data;
    res.json({
      city: name,
      temperature: main.temp,
      description: weather[0].description,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'An error occurred' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
