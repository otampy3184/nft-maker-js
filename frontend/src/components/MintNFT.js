import { ethers } from 'ethers'
import React, { useEffect } from 'react';
import { Button, Input, Link, TextField } from "@mui/material";

// import NFTMaker from '../abi/NFTMaker_goerli.json';
import NFTMaker from '../abi/NFTMaker_mumbai.json'

// const CONTRACT_ADDRESS_GOERLI = "0x29E1AEA100EE6622f9e64e902D04cF692B3f0603"
const CONTRACT_ADDRESS_MUMBAI = "0x962F88550a565f4f637F613213b1Cd352Fb4EB7C"

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
            const nftTxn = await contract.mintNFT("sample", props.result, {
                gasLimit: 300000,
            })
            props.setterIsLoading(true)
            console.log("Minting...", nftTxn.hash);
            await nftTxn.wait()
            console.log("Minted ---", nftTxn.hash);
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
                    const link = `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS_MUMBAI}/${tokenId.toNumber()}`
                    props.setterOpenseaLink(link);
                })
                console.log("Setup event lisner");
            } else {
                console.log("Ethereum object does not found");
            }
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
                <Button variant='contained' onClick={mintNFT}>
                    Mint
                </Button>
            </div>
            {props.OpenseaLink ? (
                <div>
                    <Link href=''>Link To Opensea</Link>
                </div>
            ) : null}
        </div>
    )
}

export default MintNFT