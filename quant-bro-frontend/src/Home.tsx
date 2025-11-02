// @ts-nocheck

import { Keypair, Connection, PublicKey, Transaction, VersionedTransaction, clusterApiUrl } from "@solana/web3.js";
import { useState, useEffect } from 'react'
import { Program, AnchorProvider, type Idl, BN } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'
import axios from 'axios'
import idl from './quant_bro_server.json'
import { type QuantBroServer } from './quant_bro_server.json'
import './Home.css'

function Home() {
    const [balance, setBalance] = useState(new BN(0))
    const CONNECTION_API = import.meta.env.VITE_QUICKNODE_URL
    // const DEVNET_API = clusterApiUrl('devnet')

    const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY
    const COIN_URL = "https://api.coingecko.com/api/v3/simple/price"
    const [solPrice, setSolPrice] = useState(0)

    useEffect(() => {
	const fetchBalance = async() => {
	    const keyString = localStorage.getItem("userKey")
	    if (!keyString) {
		console.error("No key found")
		return
	    }

	    // Get user Keypair
	    const secretKeyArray = JSON.parse(keyString)
	    const userKeyPair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))

	    // Anchor Set up
	    // Custom wallet object
	    const wallet = {
		publicKey: userKeyPair.publicKey,
		async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
		    if (tx instanceof Transaction) {
			tx.partialSign(userKeyPair)
		    } else {
			// Signing for VersionedTransaction
			tx.sign([userKeyPair])
		    }
		    return tx;
		},
		async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
		    return txs.map((tx) => {
			if (tx instanceof Transaction) {
			    tx.partialSign(userKeyPair)
			} else {
			    tx.sign([userKeyPair])
			}
			return tx;
		    });
		},
	    };
	    const connection = new Connection(CONNECTION_API, "confirmed")
	    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
	    const program = new Program<QuantBroServer>(idl as Idl, provider)

	    // Retrieve player PDA
	    const [playerDataPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("player"), userKeyPair.publicKey.toBuffer()],
		program.programId
	    );

	    const playerData = await program.account.playerData.fetch(playerDataPDA);

	    setBalance(playerData.solBalance);

	    try {
		const response = await axios.get(COIN_URL, {
		    params: {
			ids: 'solana',
			vs_currencies: 'usd',
			x_cg_demo_api_key: COINGECKO_API_KEY
		    }
		})

		const livePrice = response.data.solana.usd;
		setSolPrice(livePrice);
	    } catch (e) {
		console.error("Failed to fetch Solana price", e)
	    }
	}

	fetchBalance()
    }, [])

    return (
	<div className="home-container">
	    <h3 className="balance-label">Total In-Game Balance</h3>
	    <h1 className="balance-title">{balance.toString()} SOL</h1>
	    <h1 className="balance-title">${(solPrice * balance.toNumber()).toFixed(2)} </h1>
	</div>
    )
}

export default Home
