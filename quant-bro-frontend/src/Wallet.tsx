// @ts-nocheck

import { Keypair, Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { useState, useEffect } from 'react'
import { Program, AnchorProvider, type Idl } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'
import axios from 'axios'
import idl from './quant_bro_server.json'
import { type QuantBroServer } from './quant_bro_server.json'
import './Wallet.css'

const CONNECTION_API = import.meta.env.VITE_QUICKNODE_URL
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY
const COIN_URL = "https://api.coingecko.com/api/v3/simple/price"

function Wallet() {
    // Game stats
    const [cash, setCash] = useState(() => {
	const savedCash = localStorage.getItem("savedCash")
	return savedCash ? JSON.parse(savedCash) : 0
    })
    const [clickPower, setClickPower] = useState(() => {
	const savedPower = localStorage.getItem("savedPower")
	return savedPower ? JSON.parse(savedPower) : 1
    })
    const [upgradeCost, setUpgradeCost] = useState(() => {
	const savedCost = localStorage.getItem("savedCost")
	return savedCost ? JSON.parse(savedCost) : 50
    })

    // State for retrieving Solana price
    const [solPrice, setSolPrice] = useState(0)
    const [isPriceLoading, setIsPriceLoading] = useState(true)

    // State for when converting cash to Solana
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState('')

    // Saves game stats on change
    useEffect(() => {
	localStorage.setItem("savedCash", JSON.stringify(cash));
	localStorage.setItem("savedPower", JSON.stringify(clickPower));
	localStorage.setItem("savedCost", JSON.stringify(upgradeCost));
    }, [cash, clickPower, upgradeCost]);

    useEffect(() => {
	const fetchSolPrice = async () => {
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
	    } finally {
		setIsPriceLoading(false)
	    }
	}

	fetchSolPrice()
    }, [])

    const getProviderAndProgram = () => {
	const keyString = localStorage.getItem("userKey")
	if (!keyString) {
	    console.error("No key found")
	    return
	}

	const secretKeyArray = JSON.parse(keyString)
	const userKeyPair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))

	// Custom wallet object
	const wallet = {
	    publicKey: userKeyPair.publicKey,
	    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
		if (tx instanceof Transaction) {
		    tx.partialSign(userKeyPair);
		}else {
		    tx.sign([userKeyPair]);
		}

		return tx;
	    },
	    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
		return txs.map((tx) => {
		    if (tx instanceof Transaction) {
			tx.partialSign(userKeyPair);
		    } else {
			tx.sign([userKeyPair]);
		    }

		    return tx;
		});
	    },
	};

	const connection = new Connection(CONNECTION_API, "confirmed")
	const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
	const program = new Program<QuantBroServer>(idl as Idl, provider)

	return { program, provider, userKeyPair }
    }

    const handleCookieClick = () => {
	setCash(currentCash => currentCash + clickPower)
    }

    const handleBuyUpgrade = () => {
	if (cash >= upgradeCost) {
	    setCash(currentCash => currentCash - upgradeCost)
	    setClickPower(currentPower => currentPower + 1)
	    setUpgradeCost(upgradeCost => upgradeCost * 1.25)
	} else {
	    console.log("Not enough cash!")
	}
    }

    const handleConvertCash = async () => {
	if (cash < solPrice) {
	    return
	}
    
	setIsConverting(true)

	try {
	    const { program, provider, userKeyPair } = getProviderAndProgram()

	    // Player pda for save file
	    const [playerDataPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("player"), userKeyPair.publicKey.toBuffer()],
		program.programId
	    );

	    // Call backend earnTokens
	    await program.methods.exchangeMoney()
		.accounts({
		playerData: playerDataPDA,
		user: userKeyPair.publicKey,
	    })
	    .rpc();

	    setCash(currentCash => currentCash - solPrice)
	} catch (e) {
	    console.error("Conversion failed: check backend or not enough money", e)
	} finally {
	    setIsConverting(false)
	}
    }

    return (
	<div className="wallet-container">
	    <h1>Earn Cash</h1>
	    <p>Click the cookie to earn cash!</p>

	    <div className="game-box">
		<div className="game-stats">
		<h2>Cash: {cash.toFixed(2)}</h2>
		<h3>Click Power: {clickPower}</h3>
	    </div>

	    <button className="cookie-button" onClick={handleCookieClick}>
		🍪
	    </button>
    
	    <div className="game-actions">
		<button onClick={handleBuyUpgrade} disabled={isPriceLoading || isConverting}>
		    Buy Upgrade for ${upgradeCost.toFixed(2)}
		</button>

		<button onClick={handleConvertCash} disabled={isPriceLoading || isConverting} className="convert-button">
		    {isConverting ? "Converting..." : `Convert ${solPrice} to 1 SOL`}
		</button>
	    </div>
		{error && <p className="error-message">{error}</p>}
	    </div>
	</div>
    )
}

export default Wallet
