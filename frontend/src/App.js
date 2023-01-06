import './App.css';
import React, { useState } from 'react';

import Loading from "./components/Loading"
import UploadToIPFS from './components/UploadToIPFS';
import ConnectWallet from './components/ConnectWallet';
import MintNFT from './components/MintNFT';

function App() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("")
  const [OpenseaLink, setOpenseaLink] = useState("");

  const setterAccount = (account) => {
    setCurrentAccount(account)
  }

  const setterIsLoading = (isloading) => {
    setIsLoading(isloading)
  }

  const setterResult = (result) => {
    setResult(result)
  }

  const setterOpenseaLink = (opensealink) => {
    setOpenseaLink(opensealink)
  }

  return (
    <div className="App">
      <div className='outerBox'>
        <h1>
          NFT Maker JS
        </h1>
        {!currentAccount ? (
          <ConnectWallet setterAccount={setterAccount} />
        ) : (
          <div>
            <div className='loading'>
              {isLoading && <Loading />}
            </div>
            <UploadToIPFS
              setterIsLoading={setterIsLoading}
              setterResult={setterResult}
              result={result} />
            <MintNFT
              setterOpenseaLink={setterOpenseaLink}
              setterResult={setterResult}
              result={result}
              setterIsLoading={setterIsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
