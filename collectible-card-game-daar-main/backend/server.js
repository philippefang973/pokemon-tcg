const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend',)));

// API endpoint example
app.get('/api/data', (req, res) => {
  res.json({ message: 'API data response' });
});

// Handle other requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});