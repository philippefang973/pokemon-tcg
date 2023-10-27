import React, { useState, useEffect } from 'react';
import CardSets from './CardSets';
import './App.css'
import axios from 'axios';

export const App = () => {
  const [sets, retrieveSets] = useState(null);
  const [net,retrieveNet] = useState(null);  //Var to store network, contract
  const [user,setUser] = useState(null); //Var to store user
  const [userType,setUserType] = useState(null); //Var to store user type
  const [inputText, setInputText] = useState(null);

  //Auto launch in startup
  useEffect(() => { 
    // Fetch network infos from backend
    const url = 'http://localhost:5000/';
    const req = {};
    axios.post(url,req)
    .then(response => retrieveNet(response.data))
    .catch(error => console.error(error));
  }, []);

  const getUserType = async (u) => {    
    const url = 'http://localhost:5000/conn';
    const req = {user:u};
    axios.post(url,req)
      .then(response => setUserType(response.data.userType))
      .catch(error => console.error(error));    
  }

  const getUserNFT = async (u) => {
    const url = 'http://localhost:5000/user';
    const req = {user:u};
    axios.post(url,req)
      .then(response => {
        var d = {}
        Object.entries(response.data).map(([setName, cards]) => {
              cards.map(card => { d[card.name]="";});
        });
        setInputText(d);
        retrieveSets(response.data);
      })
      .catch(error => console.error(error));
  };

  //Metamask Connection function
  const connect = async () => {
    try {
      const chain = await window.ethereum.request({method: "eth_chainId" });
      if (chain==net.chainId) {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts" });
        console.log(accounts);
        if (accounts.length>0) 
          setUser(() => {
            getUserType(accounts[0]); 
            getUserNFT(accounts[0]);
            return accounts[0];
          });
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
        const selectedAcc = window.prompt('Choose an account', accounts);
        if (accounts.length>0) 
          setUser(() => {
            getUserType(accounts[0]); 
            getUserNFT(accounts[0]);
            return accounts[0];
          });
      }
    } catch(err) {
      console.warn(`failed to connect..`);
    }
  };

  //Other button-trigger functions
  const getNFT = (event) => {
    const url = 'http://localhost:5000/nft';
    const req = {user:user,token:event.target.value};
    axios.post(url,req)
      .then(response => retrieveSets(response.data))
      .catch(error => console.error(error));
  };

  const getBooster = (event) => {
    const url = 'http://localhost:5000/booster';
    const req = {user:user,token:event.target.value};
    axios.post(url,req)
      .then(response => retrieveSets(response.data))
      .catch(error => console.error(error));
  };

  const getAll = async () => {
    const url = 'http://localhost:5000/all';
    const req = {user:user};
    axios.post(url,req)
      .then(response => retrieveSets(response.data))
      .catch(error => console.error(error));
  };

  const handlerInputText = (id,val) => {
    setInputText({...inputText, [id]:val});
  };

  const handlerSubmit = (id) => {
    const url = 'http://localhost:5000/mint';
    const req = {user:user,targetUser:inputText[id],token:id};
    axios.post(url,req)
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
    var d = {};
    for (const k in inputText) d[k] = "";
    setInputText(d);
  };

  //Rendering
  return (
    <div className="App">
      <img src={process.env.PUBLIC_URL+'/pokemonlogo.png'} width="30%" height="30%"/>
      <h1></h1>
      
      {(typeof window.ethereum=='undefined') && (
        <b>MetaMask is not installed in browser, install it to connect to the network</b>
      )} 

      {(typeof window.ethereum!=='undefined') && (
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
              <u><b>Welcome back Metamask User!</b></u><br/>
              <small><b>[Account type] </b><em>{userType}</em></small><br/>
              <small><b>[Connected address] </b><em>{user}</em></small>
          </div>
          <p></p>
          <div>
          <button style={{padding: "20px"}} onClick={() => getUserNFT(user)}>
          <b>My collection</b>
          </button>
          <button style={{padding: "20px"}} onClick={getAll}>
          <b>Show all collections</b>
          </button>
          <select style={{padding: "20px", fontWeight:'bold'}} onChange={getNFT}>
            <option disbaled hidden>Show NFT</option>
          </select>
            {(userType!=='Administrator') && (
              <button style={{padding: "20px"}} onClick={getBooster}>
              <b>Redeem a booster</b>
              </button>  
            )}
          </div>
            {sets && (
            <CardSets sets={sets} userType={userType} handlerInputText={handlerInputText} handlerSubmit={handlerSubmit} inputText={inputText}/>
            )}

            {!sets && (
              <p style={{color:"grey"}}>No NFTs to show</p>
            )}
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default App;