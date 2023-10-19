import React, { useState } from 'react';
import { useSDK } from '@metamask/sdk-react';
import CardSets from './CardSets';
import './App.css'


export const App = () => {
  const [account, setAccount] = useState([]);
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const msg = "";

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

  return (
    <div className="App">
      <h1>Welcome to Pokemon TCG!</h1>
      {!connected && (
      <button style={{padding: "10px"}} onClick={connect}>
        <b>MetaMask Connect</b>
      </button>
      )}

      {connected && (
        <div>
          <div>
            <h3>Welcome back User!</h3>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
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