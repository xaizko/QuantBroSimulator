// @ts-nocheck

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Keypair, Connection, SystemProgram, PublicKey, Transaction, VersionedTransaction, clusterApiUrl } from '@solana/web3.js'
import { Program, AnchorProvider, type Idl } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'
import './StartScreen.css'
import idl from './quant_bro_server.json'

function StartScreen() {
    const [keyInput, setKeyInput] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const CONNECTION_API = import.meta.env.VITE_QUICKNODE_URL
    const DEVNET_API = clusterApiUrl('devnet')

    const [isErrorBoxOpen, setIsErrorBoxOpen] = useState(false)
    const [newKey, setNewKey] = useState('')

    const getProviderAndProgram = (keypair: Keypair) => {

	// Custom wallet object
	const wallet = {
	    publicKey: keypair.publicKey,
	    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
		if (tx instanceof Transaction) {
		    tx.partialSign(keypair)
		} else {
		    // Signing for VersionedTransaction
		    tx.sign([keypair])
		}
		return tx;
	    },
	    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
		return txs.map((tx) => {
		    if (tx instanceof Transaction) {
			tx.partialSign(keypair)
		    } else {
			tx.sign([keypair])
		    }
		    return tx;
		});
	    },
	};

	const connection = new Connection(CONNECTION_API, "confirmed")
	const provider = new AnchorProvider(connection, wallet, {preflightCommitment: "confirmed"})
	const program = new Program(idl as Idl, provider)

	return {program, provider, connection}
    }

    const initializePlayerAccount = async (keypair: Keypair, keyString: string) => {
	const {program, provider, connection} = getProviderAndProgram(keypair)
	
	try {
	    /*
	    const signature = await connection.requestAirdrop(
		keypair.publicKey,
		LAMPORTS_PER_SOL
	    )

	    const latestBlockhash = await connection.getLatestBlockhash();
	    await connection.confirmTransaction({
		signature: signature,
		blockhash: latestBlockhash.blockhash,
		lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
	    }, "confirmed");
	    */


	    const [playerDataPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("player"), provider.wallet.publicKey.toBuffer()],
		program.programId
	    );

	    await program.methods.initializePlayer()
		.accounts({
		playerData: playerDataPDA,
		user: provider.wallet.publicKey,
		systemProgram: SystemProgram.programId,
	    })
	    .rpc();

	    console.log("New account created")

	} catch (e) {
	    const errorString = e.toString()
	    if (errorString.includes("already in use")) {
		console.log("Player already exists, logging in")
	    } else {
		console.error("Failed to initialize player", e)
		setError("Try again.")
		return;
	    }
	}

	localStorage.setItem("userKey", keyString)
	navigate('/home')

    }

    const handleKey = async () => {
	setError('')

	// New User
	if (keyInput === '') {
	    const keypair = Keypair.generate()

	    const secretKeyString = JSON.stringify(Array.from(keypair.secretKey))

	    setNewKey(secretKeyString)
	    setIsErrorBoxOpen(true)
	    
	    return
	}
	
	// Returning User
	try {
	    const secretKeyArray = JSON.parse(keyInput)

	    if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
		throw new Error('Key must be an array of 64 numbers.')
	    }

	    const userKeyPair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))

	    // Valid key, so call backened
	    await initializePlayerAccount(userKeyPair, keyInput)

	} catch {
	    setError('Invalid key')
	}
    }

    const handleErrorBoxClose = async () => {
	const secretKeyArray = JSON.parse(newKey)
	const newKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))
    
	await initializePlayerAccount(newKeypair, newKey)
    
	setIsErrorBoxOpen(false) // Close the modal
    }

    return (
	<>
	    <div className="start-screen-container">
		<div className="start-screen-content">
		    <h1> Quant Bro Simulator </h1>
		    <p> Welcome to the crypto trading simulator game! </p>
		    <p className="subtitle"> Powered by Solana </p>

		    <input type="password"
			placeholder='Paste your key or leave blank to create new account'
			className='key-input'
			value={keyInput}
			onChange={(e) => setKeyInput(e.target.value)}
		    />

		    {error && <p className='error-message'>{error}</p>}

		    <button onClick={handleKey}> Start Trading </button>

		</div>
	    </div>

	    {isErrorBoxOpen && (
		<div className="error-box-overlay">
		    <div className="error-box-content">
			<h2 className="error-box-title">!!! SAVE THIS KEY !!!</h2>
			<p className="modal-text">
			    A new key has been generated for you. You must save this key to log
			    back in. If you lose it, your account is lost forever.
			</p>

			<textarea
			    className="secret-key-display" 
			    value={newKey} 
			    readOnly 
			/>

			<button className="modal-button" onClick={handleErrorBoxClose}>
			    I have saved my key
			</button>
		    </div>
		</div>
	    )}
	</>
    )
}

export default StartScreen
