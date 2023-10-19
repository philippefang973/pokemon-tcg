const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,"../frontend/build"), {extensions: ['html','tsx']}));
app.use("/", (req,res) => {
  res.sendFile(path.join(__dirname,"../frontend/index.html"))
});

app.listen(port, () => {
  console.log('Server running at http://localhost:3000');
});

