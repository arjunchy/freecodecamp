
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
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
