const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');
const { Web3 } = require('web3');
const constractJson = require('../contracts/artifacts/contracts/Main.sol/Main.json');
const web3 = new Web3('http://localhost:8545');
var deployedContract = null;

async function deployContract () {
  const contract = new web3.eth.Contract(constractJson.abi);
  while(true) {
    try {
      const accounts = await web3.eth.getAccounts();
      console.log('Ethereum node accounts ready');
      deployedContract = await contract
        .deploy({
          data: constractJson.bytecode,
          arguments: [],
        })
        .send({
          from: accounts[0], // Use the sender's address
          gas: '3000000', // Adjust the gas limit as needed
        });
      console.log('Contract deployed at:', deployedContract.options.address);
      break;  
    } catch (error) {
      console.log("Waiting for Ethereum node accounts...");
      await new Promise(resolve => setTimeout(resolve,5000));
    }
  }
};

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

    app.post('/',(req,res) => {
      res.json(deployedContract.options.address)
    });
    
    app.post('/sets', (req, res) => { //Temporary router to showcase PokemonAPI results
        console.log("router /set")
        res.json(pokemonsets);
    });

    app.post('/all', (req, res) => {
      console.log("router /all"); //Get foreach set, all user and their possession
      //...
    });

    app.post('/nft', (req, res) => {
      console.log("router /nft"); //Get infos of a NFT
      const postData = req.body;
      console.log('Data received',postData);
      //...
    });

    app.post('/user', (req, res) => {
      console.log("router /user"); //Get NFTs from user
      const postData = req.body;
      console.log('Data received',postData);
      //...
    });

    app.post('/mint', (req, res) => {
      console.log("router /mint"); //Mint nft for user (only admin)
      const postData = req.body;
      console.log('Data received',postData);
      //...
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

deployContract();
launchServer();
