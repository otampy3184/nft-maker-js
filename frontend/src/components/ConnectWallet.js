import { Button } from "@mui/material";
import React, { useEffect } from 'react';

const ConnectWallet = (props) => {

    const connectWallet = async () => {
        const { ethereum } = window
        if (!ethereum) return new Error("Ethereu object not found")
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length === 0) return
        props.setterAccount(accounts[0])
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return new Error("Ethereum object not found")
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length === 0) return new Error("Account not found")
            props.setterAccount(accounts[0])
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