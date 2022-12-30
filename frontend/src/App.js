import './App.css';
import React, { useState, useEffect } from 'react';
import NFTMaker from './abi/NFTMaker.json';
import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage'

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";
const CONTRACT_ADDRESS = "0xE2e0Cb146b13AA1C15a62e52Bc69D58496596438"

function App() {

  const [currentAccount, setCurrentAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = makeWeb3Client();
      if (!ethereum){
        console.log("Make sure you have Metamask")
        return
      } else {
        console.log("We have an ethereum object:", ethereum)
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length !== 0) {
        console.log("Found acccount:", accounts[0])
        setCurrentAccount(accounts[0])
      } else {
        console.log("Account not Founded")
      }
    } catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    const ethereum = makeWeb3Client()
    const accounts = await ethereum.request({ method: "eth_requestAccounts"})
    if (accounts.length !== 0){
      setCurrentAccount(accounts[0])
    } else {
      console.log("Account not found")
    }
  }

  const mintNFT = async(cid)=> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTMaker.abi,
        signer
      )
    } catch (error){
      console.log(error)
    }
  }

  const uploadToIpfs = async (e) => {
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log("image data:", image)

    const rootCid = await client.put(image.files, {
      name: 'metadata',
      maxRetries: 3
    })

    console.log("root cid:", rootCid)

    retrive(rootCid)
  }

  return (
    <div className="App">
      <div>
        <input className="imageToIpfs" multiple name="imageURL" type="file" accept=".jpg, .png" onChange={uploadToIpfs} />
      </div>
      <div>
        <button className="connectWallet" onClick={connectWallet}>connect Wallet</button>
      </div>
    </div>
  );
}

function makeStorageClient() {
  return new Web3Storage({ token: API_KEY})
}

function makeWeb3Client() {
  const { ethereum } = window
  if (!ethereum){
    console.log("metamask object not found")
    return
  } else {
    console.log("Metamask founded")
  }
  return ethereum
}

const retrive = async(cid) => {
  const client = makeStorageClient();
  const response = await client.get(cid)
  if(!response.ok){
    throw new Error("failed to get response")
  }
  const files = await response.files()
  for (const file of files){
    console.log("file.cid:", file.cid)
  }
}

export default App;
