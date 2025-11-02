import { Keypair, Connection, PublicKey, Transaction, VersionedTransaction, clusterApiUrl } from "@solana/web3.js";
import { useState, useEffect } from 'react'
import { Program, AnchorProvider, type Idl } from '@coral-xyz/anchor'
import { Buffer } from 'buffer'
import idl from './quant_bro_server.json'
import { type QuantBroServer } from './quant_bro_server.json'

function Home() {
    const [balance, setBalance] = useState(0)
    const CONNECTION_API = "https://icy-distinguished-liquid.solana-devnet.quiknode.pro/1b7fc4c2458dd31dacd2c29dc367de70bd3761f1/"
    const DEVNET_API = clusterApiUrl('devnet')

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

	    const [playerDataPDA] = PublicKey.findProgramAddressSync(
		[Buffer.from("player"), userKeyPair.publicKey.toBuffer()],
		program.programId
	    );

	    const playerData = await program.account.playerData.fetch(playerDataPDA);

	    setBalance(playerData.solBalance);
	}

	fetchBalance()
    }, [])

    return (
	<div>
	    <h1>Total Balance: {balance.toString()} SOL </h1>
	</div>
    )
}

export default Home
