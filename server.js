const express = require('express');
const app = express();
const port = 3000;

// Serve static HTML file for the front-end
app.use(express.static('public'));

// API route to handle date conversion
app.get('/api/:date', (req, res) => {
  let dateParam = req.params.date;

  // If no date is provided, use the current time
  if (!dateParam) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  }

  // Handle date conversion logic here
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
  const ipaddress = req.ip; // Get the IP address of the request
  const language = req.acceptsLanguages()[0]; // Get the preferred language
  const software = req.headers['user-agent']; // Get the user-agent (software) information

  // Return the response in the desired JSON format
  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
