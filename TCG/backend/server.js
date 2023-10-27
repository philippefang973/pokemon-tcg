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
var owner2 = null;

async function deployContract() {
  while (true) {
    try {
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
          from: owner,
          //gas: '3000000', 
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

  console.log(owner);
  console.log(owner2);

  let tx = {
    from: owner,
    to: deployedContract.options.address,
    data: await deployedContract.methods.createCollection('Base', pokemonsets['Base'].length).encodeABI()
  };
  const result = await web3.eth.sendTransaction(tx)
    .then(function (receipt) {
      console.log(receipt);
    });
  console.log(result);

  let tx2 = {
    from: owner,
    to: deployedContract.options.address,
    data: await deployedContract.methods.createCard('Base', pokemonsets['Base'][0].name, pokemonsets['Base'][0].id).encodeABI()
  };
  const result2 = await web3.eth.sendTransaction(tx2)
    .then(function (receipt) {
      console.log(receipt);
    });
  console.log(result2);
  /*
  //Create Collection
  await deployedContract.methods.createCollection('Base', pokemonsets['Base'].length).send({ from: owner })
  .on('transactionHash', function(hash) {
    console.log('createCollection Transaction Hash:', hash);
  })
  .on('receipt', function(receipt) {
    console.log(receipt.status);
    console.log(receipt);
  })
  .on('error', function(error) {
    console.error('Error:', error);
  });
  //CreateCard
  await deployedContract.methods.createCard('Base', pokemonsets['Base'][0].name,pokemonsets['Base'][0].id).send({ from: owner })
  .on('transactionHash', function(hash) {
    console.log('createCard Transaction Hash:', hash);
  })
  .on('receipt', function(receipt) {
    console.log(receipt.status);
    console.log(receipt);
  })
  .on('error', function(error) {
    console.error('Error:', error);
  });

  //Mint
  await deployedContract.methods.assign('Base', pokemonsets['Base'][0].name,owner2).send({ from: owner })
  .on('transactionHash', function(hash) {
    console.log('assign Transaction Hash:', hash);
  })
  .on('receipt', function(receipt) {
    console.log(receipt.status);
    console.log(receipt.events.Received.returnValues);
  })
  .on('error', function(error) {
    console.error('Error:', error);
  });

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
  });*/

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
    if (owner == req.body.user) res.json(pokemonsets)
    else res.json(null)
  });

  app.post('/mint', (req, res) => {
    console.log("router /mint"); //Mint nft for user (only admin)
    const postData = req.body; //{user:...,targetUser:...,token:...};
    console.log('Data received', postData);
    //...
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
