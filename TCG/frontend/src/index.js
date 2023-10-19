import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MetaMaskProvider } from '@metamask/sdk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <MetaMaskProvider debug={false} sdkOptions={{
      logging:{
          developerMode: false,
        },
        checkInstallationImmediately: false,
        dappMetadata: {
          name: "PokemonTCG",
          url: window.location.host,
        }
    }}>
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);

reportWebVitals();
