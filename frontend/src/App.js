import './App.css';
import React, { useState } from 'react';

import Loading from "./components/Loading"
import UploadToIPFS from './components/UploadToIPFS';
import ConnectWallet from './components/ConnectWallet';
import MintNFT from './components/MintNFT';

function App() {
  // 子コンポーネント間でStateのやりとりを行うので親側で全て管理
  const [currentAccount, setCurrentAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("")
  const [OpenseaLink, setOpenseaLink] = useState("");

  // 子コンポーネントから親のStateを操作するための関数群(もっといいやり方ある？)
  const setterAccount = account => setCurrentAccount(account)
  const setterIsLoading = isloading => setIsLoading(isloading)
  const setterResult = result => setResult(result)
  const setterOpenseaLink = opensealink => setOpenseaLink(opensealink)

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
            <Loading isLoading={isLoading} />
            <UploadToIPFS
              setterIsLoading={setterIsLoading}
              setterResult={setterResult}
              result={result} />
            <MintNFT
              setterOpenseaLink={setterOpenseaLink}
              OpenseaLink={OpenseaLink}
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
