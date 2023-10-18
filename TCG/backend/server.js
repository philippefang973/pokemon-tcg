const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');

async function launchServer () {
    const app = express();
    app.use(cors());
    
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
