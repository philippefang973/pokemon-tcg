This is a Pokémon NFT TCG project (DAAR project n°2)

Authors: Zaky ABDELLAOUI, Philippe FANG

# Contents
This project mainly contains:
- src/  : main code folder
    - src/backend/server.js : Backend Express.js server
    - src/frontend/src/*.js : Frontend React components
    - src/contracts/src/contracts/contracts/*.sol : Solidity contracts
- This ReadMe

The backend, frontend, contracts all have their own package.json

src/ has the main package.json which call all of them above

The ports used are respectively : 5000, 3000, 8545

# Install and Run
Go to src/ to do the following: 

Install dependencies: `yarn` and `yarn install`

Launch project : `yarn start`, then go to http://localhost:3000/.

