import { Routes, Route } from 'react-router-dom'

import StartScreen from './StartScreen'
import Home from './Home'

function App() {
    return (
	<Routes>
	    <Route path="/" element={<StartScreen />} />

	    <Route path="/home" element={<Home />} />

	</Routes>
    )
}

export default App
