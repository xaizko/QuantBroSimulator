import { Link } from 'react-router-dom'
import './StartScreen.css'

function StartScreen() {
    return (
	<div className="start-screen-container">
	    <div className="start-screen-content">
		<h1> Quant Bro Simulator </h1>
		<p> Welcome to the crypto trading simulator game! </p>
		<p className="subtitle"> Powered by Solana </p>
		<Link to="/home">
		    <button> Start Trading </button>
		</Link>
	    </div>
	</div>
    )
}

export default StartScreen
