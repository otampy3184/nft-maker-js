import './App.css';
import React from 'react';
import NFTMaker from './abi/NFTMaker.json';
import ethers from 'ethers'
import { Web3Storage } from 'web3.storage'

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";


function App() {

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
    </div>
  );
}

function makeStorageClient() {
  return new Web3Storage({ token: API_KEY})
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
