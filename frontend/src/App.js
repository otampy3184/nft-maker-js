import './App.css';
import React, { useState, useEffect } from 'react';
import { Button, Input, Link, TextField } from "@mui/material";
// import NFTMaker from './abi/NFTMaker_goerli.json';
import NFTMaker from './abi/NFTMaker_mumbai.json'
import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage'
import Loading from "./components/Loading"

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";
const CONTRACT_ADDRESS_GOERLI = "0x29E1AEA100EE6622f9e64e902D04cF692B3f0603"
const CONTRACT_ADDRESS_MUMBAI = "0x0eDd66F66aBF49655C58FB248E08867E1b0220B6"

function App() {

  const [currentAccount, setCurrentAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [ipfsValue, setIpfsValue] = useState("");
  const [result, setResult] = useState("")
  const [OpenseaLink, setOpenseaLink] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = makeWeb3Client();
      if (!ethereum) {
        console.log("Make sure you have Metamask")
        return
      } else {
        console.log("We have an ethereum object:", ethereum)
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length !== 0) {
        console.log("Found acccount:", accounts[0])
        setCurrentAccount(accounts[0])
        eventListener();
      } else {
        console.log("Account not Founded")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    const ethereum = makeWeb3Client()
    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0])
      eventListener();
    } else {
      console.log("Account not found")
    }
  }

  const mintNFT = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS_MUMBAI,
        // CONTRACT_ADDRESS_GOERLI,
        NFTMaker.abi,
        signer
      )
      const nftTxn = await contract.mintNFT("sample", result, {
        gasLimit: 300000,
      })
      setIsLoading(true)
      console.log("Minting...", nftTxn.hash);
      await nftTxn.wait()
      console.log("Minted ---", nftTxn.hash);
      console.log(
        `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
      );
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const uploadToIpfs = async (e) => {
    setIsLoading(true)
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target
    console.log("image data:", image)

    const rootCid = await client.put(image.files, {
      name: 'metadata',
      maxRetries: 3
    })

    console.log("root cid:", rootCid)

    await retrive(rootCid)
    setIsLoading(false)
  }

  const eventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS_MUMBAI,
          // CONTRACT_ADDRESS_GOERLI,
          NFTMaker.abi,
          signer
        );
        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          // alert(
          //   `Openseaへのリンク : https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS_MUMBAI}/${tokenId.toNumber()}`
          // );
          const link = `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS_MUMBAI}/${tokenId.toNumber()}`
          setOpenseaLink(link);
        })
        console.log("Setup event lisner");
      } else {
        console.log("Ethereum object does not found");
      }
    } catch (error) {
      console.log(error)
    }
  }

  function makeStorageClient() {
    return new Web3Storage({ token: API_KEY })
  }

  function makeWeb3Client() {
    const { ethereum } = window
    if (!ethereum) {
      console.log("metamask object not found")
      return
    } else {
      console.log("Metamask founded")
    }
    return ethereum
  }

  const retrive = async (cid) => {
    const client = makeStorageClient();
    const response = await client.get(cid)
    if (!response.ok) {
      throw new Error("failed to get response")
    }
    const files = await response.files()
    for (const file of files) {
      setResult(file.cid)
      console.log("file.cid:", file.cid)
    }
  }

  return (
    <div className="App">
      <div className='outerBox'>
        <h1>
          NFT Maker JS
        </h1>
        {!currentAccount ? (
          <Button variant='contained' color='primary' onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <div>
            <div className='loading'>
              {isLoading && <Loading />}
            </div>
            <div>
              <Input className="imageToIpfs" multiple name="imageURL" type="file" accept=".jpg, .png" onChange={uploadToIpfs} />
            </div>
            {result ? (
              <div>
                <TextField
                  value={result}
                  multiline
                  rows={1}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy IPFS Link
                </Button>
              </div>
            ) : null}
            <div>
              <div>
                <TextField
                  variant='outlined'
                  name="ipfsLink"
                  placeholder="IPFSのリンクを入力"
                  type="text"
                  id="ipfs"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  multiline
                  rows={1}
                  fullWidth
                />
                <Button variant='contained' onClick={mintNFT}>
                  Mint
                </Button>
              </div>
              {OpenseaLink ? (
                <div>
                  <Link href=''>Link To Opensea</Link>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
