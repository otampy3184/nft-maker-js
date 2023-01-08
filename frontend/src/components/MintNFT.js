import { ethers } from 'ethers'
import React, { useEffect } from 'react';
import { Button, TextField } from "@mui/material";

import NFTMaker from '../abi/NFTMaker_mumbai.json'
const CONTRACT_ADDRESS_MUMBAI = "0xb57D3b3c1C8C18b47Aa8d04d795f0c2fB7622c30"

const MintNFT = (props) => {
    const mintNFT = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS_MUMBAI,
                NFTMaker.abi,
                signer
            )
            const nftTxn = await contract.mintNFT(props.name, props.result, props.description, {
                gasLimit: 300000,
            })
            props.setterIsLoading(true)
            await nftTxn.wait()
            console.log(
                `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
            );
            props.setterIsLoading(false)
        } catch (error) {
            console.log(error)
            props.setterIsLoading(false)
        }
    }

    const eventListener = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return new Error("Ethereum object not found")
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(
                CONTRACT_ADDRESS_MUMBAI,
                NFTMaker.abi,
                signer
            );
            connectedContract.on("NewNFTMinted", (sender, tokenId) => {
                console.log(sender, tokenId.toNumber());
                const link = `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS_MUMBAI}/${tokenId.toNumber()}`
                props.setterOpenseaLink(link);
            })
            console.log("Setup event lisner");
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        eventListener()
    }, [])

    return (
        <div>
            <div>
                <TextField
                    variant='outlined'
                    name="ipfsLink"
                    placeholder="IPFSのリンクを入力"
                    type="text"
                    id="ipfs"
                    value={props.result}
                    onChange={(e) => props.setterResult(e.target.value)}
                    multiline
                    rows={1}
                    fullWidth
                />
                <TextField
                    variant='outlined'
                    name="name"
                    placeholder='NFTの名前を入力'
                    id="name"
                    value={props.name}
                    onChange={(e) => props.setterName(e.target.value)}
                    multiline
                    rows={1}
                    fullWidth 
                />
                <TextField
                    variant='outlined'
                    name="name"
                    placeholder="NFTの説明文を入力"
                    id="name"
                    value={props.description}
                    onChange={(e) => props.setterDescription(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                />
                <Button variant='contained' onClick={mintNFT}>
                    Mint
                </Button>
            </div>
            {props.openseaLink ? (
                <div>
                    <Button target="_blank" href={props.openseaLink}>Go to Opensea</Button>                </div>
            ) : null}
        </div>
    )
}

export default MintNFT