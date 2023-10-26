const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');
const { Web3 } = require('web3');
const constractJson = require('../contracts/artifacts/contracts/Main.sol/Main.json');
const provider = 'http://localhost:8545';
const web3 = new Web3(provider);
var bodyParser = require('body-parser');
var deployedContract = null;
var owner = null;

async function deployContract() {
  const contract = new web3.eth.Contract(constractJson.abi);
  while (true) {
    try {
      const accounts = await web3.eth.getAccounts();
      console.log('Ethereum node accounts ready');
      owner = accounts[0].toLowerCase();
      deployedContract = await contract
        .deploy({
          data: constractJson.bytecode,
          arguments: [],
        })
        .send({
          from: owner,
          //gas: '3000000', 
        });
      console.log('Contract deployed at:', deployedContract.options.address);
      break;
    } catch (error) {
      console.log("Waiting for Ethereum node accounts...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

async function launchServer() {
  const app = express();
  const allowedOrigins = ['http://localhost:3000'];

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
  app.use(bodyParser.json());

  const pokemonsets = await pokemonapi.getSets(3);

  app.post('/', (req, res) => { //Root router, send contract info
 
    deployedContract.methods.createCollection('Base', pokemonsets['Base'].length).send({ from: owner });
    web3.eth.net.getId()
      .then(chainId => {
        data = {
          "contract": deployedContract.options.address,
          "chainId": "0x" + chainId.toString(16),
          "provider": provider
        };
        res.json(data);
      })
      .catch(error => {
        res.status(500).json({ error: 'Error getting chain ID' });
      });
  });

  app.post('/sets', (req, res) => { //Temporary router to showcase PokemonAPI results
    console.log("router /set")
    res.json(pokemonsets);
  });

  app.post('/conn', (req, res) => { //A user is connected, check if he's an admin
    console.log("router /conn");
    if (owner == req.body.user) res.json({ userType: "Administrator" })
    else res.json({ userType: "Normal" })
  });

  app.post('/all', (req, res) => {
    console.log("router /all"); //Get foreach set, all user and their possession
    const postData = req.body; //{user:...}
    console.log('Data received', postData);
    //...
  });

  app.post('/nft', (req, res) => {
    console.log("router /nft"); //Get infos of a NFT
    const postData = req.body; //{user:...,token:...};
    console.log('Data received', postData);
    //...
  });

  app.post('/user', (req, res) => {
    console.log("router /user"); //Get NFTs from user
    const postData = req.body; //{user:...};
    console.log('Data received', postData);
    //...
  });

  app.post('/mint', (req, res) => {
    console.log("router /mint"); //Mint nft for user (only admin)
    const postData = req.body; //{user:...,targetUser:...,token:...};
    console.log('Data received', postData);
    //...
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

deployContract();
launchServer();
