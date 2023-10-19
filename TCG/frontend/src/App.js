import React, { useState, useEffect } from 'react';
import { useSDK } from '@metamask/sdk-react';
import CardSets from './CardSets';
import './App.css'
import axios from 'axios';


export const App = () => {
  const [account, setAccount] = useState([]);
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk.terminate();
    } catch(err) {
      console.warn(`failed to disconnect..`, err);
    }
  };

  const [data, retrieveData] = useState([]);

  useEffect(() => {
    // Fetch pokemon sets data from the server
    const url = 'http://localhost:5000/';
    const req = {};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  }, []);

  const getNFT = async () => {
    const url = 'http://localhost:5000/nft';
    const req = {token:"token"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const getUser = async () => {
    const url = 'http://localhost:5000/user';
    const req = {user:"user"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const getAll = async () => {
    const url = 'http://localhost:5000/all';
    const req = {};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  const mint = async () => {
    const url = 'http://localhost:5000/mint';
    const req = {user:"user",token:"token"};
    axios.post(url,req)
      .then(response => retrieveData(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <img src={process.env.PUBLIC_URL+'/pokemonlogo.png'} width="30%" height="30%"/>
      <p></p>
      {data && (
      <div>
        <h4><u>Deployed contract</u>: ${data}</h4>
        </div>
      )}
      {!connected && (
      <button style={{padding: "10px"}} onClick={connect}>
        <b>MetaMask Connect</b>
      </button>
      )}

      {connected && (
        <div>
          <div>
          <h3>Welcome back Metamask User!</h3>
          <div style={{border:"solid",color:"green"}}>
          {account && `Connected account: ${account}`}
          <p></p>
          {chainId && `Connected chainID: ${chainId}`}
          </div>
          </div>
          <button style={{padding: "10px"}} onClick={disconnect}>
            <b>Disconnect</b>
          </button>
        </div>
      )}
      <CardSets />
    </div>
  );
}

export default App;