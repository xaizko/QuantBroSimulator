import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Keypair } from '@solana/web3.js'
import './StartScreen.css'

function StartScreen() {
    const [keyInput, setKeyInput] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const [isErrorBoxOpen, setIsErrorBoxOpen] = useState(false)
    const [newKey, setNewKey] = useState('')

    const handleKey = () => {
	setError('')

	if (keyInput === '') {
	    const keypair = Keypair.generate()

	    const secretKeyString = JSON.stringify(Array.from(keypair.secretKey))

	    setNewKey(secretKeyString)
	    setIsErrorBoxOpen(true)
	    
	    return
	}
	
	try {
	    const secretKeyArray = JSON.parse(keyInput)

	    if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
		throw new Error('Key must be an array of 64 numbers.')
	    }

	    // Validation for key
	    Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))

	    localStorage.setItem("userKey", keyInput)
	    navigate('/home')

	} catch (e) {
	    setError('Invalid key')
	}
    }

    const handleErrorBoxClose = () => {
	localStorage.setItem("userKey", newKey)
    
	setIsErrorBoxOpen(false)
    
	navigate('/home')
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
