const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const shortid = require('shortid');
const app = express();
const port = 3000;

// In-memory storage for the URLs
const urlDatabase = {};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static HTML file for the front-end
app.use(express.static('public'));

// API route to handle date conversion (existing route)
app.get('/api/:date', (req, res) => {
  let dateParam = req.params.date;

  if (!dateParam) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  }

  const date = new Date(dateParam);
  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// API route to handle /api/whoami (Request Header Parser Microservice)
app.get('/api/whoami', (req, res) => {
  const ipaddress = req.ip;
  const language = req.acceptsLanguages()[0];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

// API route to shorten URLs (URL Shortener Microservice)
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Validate URL format
  const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\/.*)?$/;
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Use DNS lookup to validate if the URL exists
  const host = new URL(url).hostname;
  dns.lookup(host, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Generate a short URL
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = url;

    // Return the original URL and the short URL
    res.json({
      original_url: url,
      short_url: shortUrl
    });
  });
});

// API route to redirect from short URL to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  // Check if short URL exists in the database
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl); // Redirect to the original URL
  } else {
    res.json({ error: 'No short URL found for this code' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
