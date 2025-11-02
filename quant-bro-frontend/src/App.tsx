import { Routes, Route } from 'react-router-dom'

import StartScreen from './StartScreen'
import GameLayout from './GameLayout'
import Home from './Home'
import Market from './Market'
import Walelt from './Wallet'
import Transactions from './Transactions'

function App() {
    return (
	<Routes>
	    <Route path="/" element={<StartScreen />} />

	    <Route element = {<GameLayout />}>
		<Route path="/home" element= {<Home />} />

		<Route path="/market" element= {<Market />} />

		<Route path="/wallet" element= {<Wallet />} />

		<Route path="/transactions" element= {<Transactions />} />
	    </Route>

	</Routes>
    )
}

export default App
