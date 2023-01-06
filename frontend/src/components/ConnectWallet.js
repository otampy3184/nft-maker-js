import { Button } from "@mui/material";
import React, { useEffect } from 'react';

const ConnectWallet = (props) => {

    const connectWallet = async () => {
        const { ethereum } = window
        if (!ethereum) {
            console.log("metamask object not found")
            return
        } else {
            console.log("Metamask founded")
        }
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length !== 0) {
            console.log(accounts[0])
            props.setterAccount(accounts[0])
        } else {
            console.log("Account not found")
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have Metamask")
                return
            } else {
                console.log("We have an ethereum object:", ethereum)
            }

            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length !== 0) {
                console.log("Found acccount:", accounts[0])
                props.setterAccount(accounts[0])
                // eventListener();
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


    return (
        <div>
            <Button variant='contained' color='primary' onClick={connectWallet}>
                Connect Wallet
            </Button>
        </div>
    )
}

export default ConnectWallet;