import React, { useState, useEffect } from 'react';
import CardSets from './CardSets';
import './App.css'
import axios from 'axios';


export const App = () => {
  const [net,retrieveNet] = useState(null);  //Var to store network, contract
  const [data,retrieveData] = useState(null); //Var to store response data
  const [user,setUser] = useState(null); //Var to store user
  
  //Auto launch in startup
  useEffect(() => {
    // Fetch network infos from backend
    const url = 'http://localhost:5000/';
    const req = {};
    axios.post(url,req)
    .then(response => retrieveNet(response.data))
    .catch(error => console.error(error));
  }, []);

  //Metamask Connection function
  const connect = async () => {
    try {
      const chain = await window.ethereum.request({method: "eth_chainId" });
      if (chain == net.chainId) {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts" });
        console.log(accounts);
        if (accounts.length>0) setUser(accounts[0]);
      } else {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts" })
        .then(() => {
          window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: net.chainId,
              rpcUrls: [net.provider],
              chainName: "Hardhat",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: null,
            }]
          })
        });
        if (accounts.length>0) setUser(accounts[0]);
      }
    } catch(err) {
      console.warn(`failed to connect..`);
    }
  };

  //Other button-trigger functions
  const getNFT = async () => {
    const url = 'http://localhost:5000/nft';
    const req = {user:user,token:"token"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const getUser = async () => {
    const url = 'http://localhost:5000/user';
    const req = {user:user,targetUser:"user"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const getAll = async () => {
    const url = 'http://localhost:5000/all';
    const req = {user:user};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const mint = async () => {
    const url = 'http://localhost:5000/mint';
    const req = {user:user,targetUser:"user",token:"token"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  //Rendering
  return (
    <div className="App">
      <img src={process.env.PUBLIC_URL+'/pokemonlogo.png'} width="30%" height="30%"/>
      <h1></h1>
      
      {(typeof window.ethereum == 'undefined') && (
        <b>MetaMask is not installed in browser, install it to connect to the network</b>
      )} 

      {(typeof window.ethereum !== 'undefined') && (
        <div>
        {!user && (        
          <div> 
            <h1>Connect to the network to check out the NFTs </h1>
          <button style={{padding: "10px"}} onClick={connect}>
          <b>MetaMask Connect</b>
          </button>
          </div>
        )}
  
        {user && (
          <div>
          {net && (
            <div>
              <small>
            <b>[RPC url]</b> <em>{net.provider}</em><br/>
            <b>[Chain ID]</b> <em>{net.chainId}</em><br/>
            <b>[Contract]</b> <em>{net.contract}</em><br/>
              </small>
            </div>
          )}
           <div style={{border:"solid", display: "inline-block", color:"green"}}>
              <b>Welcome back Metamask User!</b><br/>
              <small><b>[Connected address] </b><em>{user}</em></small>

              {data && (
                <p>{data}</p>
              )}
          </div>
          <p></p>
          <div>
          <button style={{padding: "20px"}} onClick={getAll}>
          <b>Show all collections</b>
          </button>
          <button style={{padding: "20px"}} onClick={getUser}>
          <b>Show user collection</b>
          </button>
          <button style={{padding: "20px"}} onClick={getNFT}>
          <b>Show NFT</b>
          </button>
          <button style={{padding: "20px"}} onClick={mint}>
          <b>Mint NFT</b>
          </button>
          </div>
          <CardSets />
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default App;