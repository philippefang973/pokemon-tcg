const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');

async function launchServer () {
    const app = express();
    const allowedOrigins = ['http://localhost:3000']; // Add your frontend URLs here

    const corsOptions = {
      origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    app.use(cors(corsOptions));
    
    const pokemonsets = await pokemonapi.getSets(3);
    
    app.get('/sets', (req, res) => {
        console.log(pokemonsets)
        res.json(pokemonsets);
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

launchServer();
