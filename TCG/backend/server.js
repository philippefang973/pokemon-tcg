const express = require('express');
const cors = require('cors');
const pokemonapi = require('./pokemon.js');
const { Web3 } = require('web3');
const provider = 'http://localhost:8545';
const web3 = new Web3(provider);
var bodyParser = require('body-parser');
var deployedContract = null;
var owner = null;

//Deploy contract function
async function deployContract() {
  while (true) { //Retry if compilation/node init not finished
    try {
      const constractJson = require('../contracts/artifacts/contracts/Main.sol/Main.json');
      const contract = new web3.eth.Contract(constractJson.abi);
      const accounts = await web3.eth.getAccounts();
      console.log('Ethereum node accounts ready');
      owner = accounts[0].toLowerCase();
      deployedContract = await contract
        .deploy({
          data: constractJson.bytecode,
          arguments: [],
        })
        .send({
          from: owner
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

//Function get 5 random cards from sets
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

//Launch express server
async function launchServer() {
  const app = express();
  const allowedOrigins = ['http://localhost:3000'];

  //Only allow requests from frontend
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
  app.use(bodyParser.json()); //allow rendering json

  const pokemonsets = await pokemonapi.getSets(2); //Get sets from Pokemon API

  //Create collection + cards in contract
  for (const name of Object.keys(pokemonsets)) {
    const cardNames = pokemonsets[name].map(item => item.name);
    const cardURIs = pokemonsets[name].map(item => item.uri);
    const m1 = await deployedContract.methods.createCollection(name, pokemonsets[name].length).encodeABI();
    const m2 = await deployedContract.methods.createMultipleCards(name, cardNames, cardURIs).encodeABI();
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
    console.log("Creating collection "+name);
    await web3.eth.sendTransaction(tx);
    console.log("Adding cards for collection "+name);
    await web3.eth.sendTransaction(tx2);
  }

  //Routers
  app.post('/', (req, res) => { //Root router, send contract info
    //Render infos
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
    //If it's admin
    if (req.body.user==owner) {
      //Prepare json from URIs
      k = {}
      for (const key of Object.keys(pokemonsets)) {
        k[key] = []
        for (const elem of pokemonsets[key]) {
          var jsonStr = decodeURIComponent(elem.uri.split(',')[1]);
          var json = JSON.parse(jsonStr);
          k[key].push({set:json.set,name:json.name,images:json.images});
        }
      }
      res.json(k);
    } else { //If it's a normal user
      //Get NFT ids
      const m1 = await deployedContract.methods.ownBy(req.body.user).encodeABI();
      let tx = {
        from: owner,
        to: deployedContract.options.address,
        data: m1,
      };
      const result = await web3.eth.call(tx);
      const decodedResult = await web3.eth.abi.decodeParameters(['uint256[]'], result);
      //Prepare json
      k = {}
      for (const id of decodedResult[0]) {
        //Get URIs from ids
        const m2 = await deployedContract.methods.readCard(id).encodeABI();
        let tx2 = {
          from: owner,
          to: deployedContract.options.address,
          data: m2,
        };
        const result2 = await web3.eth.call(tx2);    
        const decodedResult2 = await web3.eth.abi.decodeParameters(['string'], result2);
        console.log(decodedResult2);
        var jsonStr = decodeURIComponent(decodedResult2[0].split(',')[1]);
        var json = JSON.parse(jsonStr);
        if (!k.hasOwnProperty(json.set)) k[json.set] = []
        k[json.set].push({set:json.set,name:json.name,images:json.images});
      }
      if (Object.keys(k).length>0) res.json(k);
      else res.json(null);
    }
  });

  app.post('/mint', async (req, res) => {
    console.log("router /mint"); //Mint nft for user (only admin)
    const postData = req.body; //{user:...,set:...,name:...}; 
    if (req.body.user!==owner && req.body.user.match(/^(0x)?[0-9a-fA-F]{40}$/)) { //check if valid address
      console.log(req.body);
      const m = await deployedContract.methods.assign(req.body.set, req.body.name, req.body.user).encodeABI();
      let tx = {
        from: req.body.owner,
        to: deployedContract.options.address,
        data: m,
      };
      await web3.eth.sendTransaction(tx);
      res.json("NFT mint to "+req.body.user);
    } else {
      res.json("Failed to mint");
    }
  });

  app.post('/booster', async (req, res) => {
    console.log("router /booster"); //Get Booster
    const postData = req.body; //{user:...};
    const boost = getBooster(pokemonsets);
    k = {}
    for (const key of Object.keys(boost)) {
      k[key] = [];
      cardNames = [];
      for (const elem of boost[key]) {
        var jsonStr = decodeURIComponent(elem.uri.split(',')[1]);
        var json = JSON.parse(jsonStr);
        k[key].push({set:json.set,name:json.name,images:json.images});
        cardNames.push(json.name);
      }
      //Mint booster cards
      const m = await deployedContract.methods.assignMultiple(key, cardNames, req.body.user).encodeABI();
        let tx = {
          from: req.body.owner,
          to: deployedContract.options.address,
          data: m,
        };
      await web3.eth.sendTransaction(tx);
    }
    res.json({msg:"Booster redeemed! Here are 5 new cards added to your wallet",booster:k});
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

deployContract();
