const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');
const { Web3 } = require('web3');
const provider = 'http://localhost:8545';
const web3 = new Web3(provider);
var bodyParser = require('body-parser');
var deployedContract = null;
var cardContractAddress = null;
var owner = null;
var owner2 = null;

async function deployContract() {
  while (true) {
    try {
      const constractJson = require('../contracts/artifacts/contracts/Main.sol/Main.json');
      const contract = new web3.eth.Contract(constractJson.abi);
      const accounts = await web3.eth.getAccounts();
      console.log('Ethereum node accounts ready');
      owner = accounts[0].toLowerCase();
      owner2 = accounts[1].toLowerCase();
      deployedContract = await contract
        .deploy({
          data: constractJson.bytecode,
          arguments: [],
        })
        .send({
          from: owner
        })
        .on('receipt', function(receipt) {
          cardContractAddress = receipt.events.getCardContractAddress.returnValues.res;
        });
      console.log('Contract deployed at:', deployedContract.options.address);
      console.log(deployedContract.methods);
      break;
    } catch (error) {
      console.log("Waiting for Ethereum node accounts...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  launchServer();
};

function getBooster(sets) {
  var res = {};
  for (let i = 0; i < 5; i++) {
    const keys = Object.keys(sets);
    const randomName = keys[Math.floor(Math.random() * keys.length)];
    const selectedSet = sets[randomName];
    const randomCard = selectedSet[Math.floor(Math.random() * selectedSet.length)];
    if (randomName in res) res[randomName].push(randomCard);
    else res[randomName] = [randomCard];
  }
  return res;
}

function uriToJSON(uri) {
  fetch(uri).then (response => {
    if (response.ok) return response.json();
    else throw Error("can't get URI content");
  })
}

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

  for (const name of Object.keys(pokemonsets)) {
    const cardNames = pokemonsets[name].map(item => item.name);
    const cardURIs = pokemonsets[name].map(item => item.uri);
    const m1 = await deployedContract.methods.createCollection(name, pokemonsets[name].length).encodeABI();
    const m2 = await deployedContract.methods.createMultipleCards(name, cardNames, cardURIs).encodeABI();
    const m3 = await deployedContract.methods.assignMultiple(name, cardNames, owner).encodeABI();
    let tx = {
      from: owner,
      to: deployedContract.options.address,
      data: m1,
    };
    let tx2 = {
      from: owner,
      to: deployedContract.options.address,
      data: m2,
    };
    let tx3 = {
      from: owner,
      to: deployedContract.options.address,
      data: m3,
    };
    console.log("Creating collection "+name);
    await web3.eth.sendTransaction(tx);
    console.log("Adding cards for collection "+name);
    await web3.eth.sendTransaction(tx2);
    console.log("Mint to owner collection "+name);
    await web3.eth.sendTransaction(tx3);
  }


  app.post('/', (req, res) => { //Root router, send contract info
    //Render
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

  app.post('/user', async (req, res) => {
    console.log("router /user"); //Get NFTs from user
    const postData = req.body; //{user:...};
    const m1 = await deployedContract.methods.retrieveNFTs(req.body.user).encodeABI();
    let tx = {
      from: owner,
      to: deployedContract.options.address,
      data: m1,
    };
    await web3.eth.sendTransaction(tx).on('receipt', function(receipt) {
      console.log(receipt.events);
      console.log(receipt.events.getNFTs.returnValues.res);
    });
  });

  app.post('/mint', async (req, res) => {
    console.log("router /mint"); //Mint nft for user (only admin)
    const postData = req.body; //{user:...,set:...,name:...};
    const m = await deployedContract.methods.assign(req.body.set, req.body.name, req.body.user).encodeABI();
    let tx = {
      from: req.body.owner,
      to: deployedContract.options.address,
      data: m,
    };
    await web3.eth.sendTransaction(tx);
  });

  app.post('/booster', (req, res) => {
    console.log("router /booster"); //Get Booster
    const postData = req.body; //{user:...};
    console.log('Data received', postData);
    res.json(getBooster(pokemonsets));
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

deployContract();
