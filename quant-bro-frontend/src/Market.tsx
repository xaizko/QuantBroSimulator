import { useState, useEffect } from 'react'
import axios from 'axios'
import './Market.css' 

type Coin = {
      id: string;
      name: string;
      symbol: string;
      image: string;
      current_price: number;
      market_cap: number;
      price_change_percentage_24h: number;
}

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const COIN_URL = "https://api.coingecko.com/api/v3/coins/markets"

function Market() {
    const [coins, setCoins] = useState<Coin[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
	const fetchMarketData = async () => {
	    try {
		const response = await axios.get(COIN_URL, {
		    params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 10,
			page: 1,
			sparkline: false,
			x_cg_demo_api_key: COINGECKO_API_KEY
		    }
		}) 

		setCoins(response.data)
	    } catch {
		console.error("Failed to fetch market data")
	    } finally {
		setIsLoading(false)
	    }
	}

	fetchMarketData()
    }, [])

    const formatPriceChange = (change: number) => {
	const isPositive = change >= 0;
	return (
	    <span className={isPositive ? 'price-up' : 'price-down'}>
		{isPositive ? '▲' : '▼'} {change.toFixed(2)}%
	    </span>
	)
    }

    const formatMarketCap = (cap: number) => {
	return `$${cap.toLocaleString()}`
    }

    if (isLoading) {
	return <h1 className="loading-text">Retrieving Market Data...</h1>
    }

    return(
	<div className = "market-container">
	    <h1>Market</h1>
	    <table className="market-table">
		<thead>
		    <tr>
	        	<th>#</th>
	        	<th>Name</th>
	        	<th>Price</th>
	        	<th>24h %</th>
	        	<th>Market Cap</th>
	            </tr>
		</thead>
		<tbody>
		    {coins.map((coin, index) => (
			<tr key={coin.id}>
			    <td>{index + 1}</td>
			    <td>
				<div className="coin-name">
				    <img src={coin.image} alt={coin.name} className="coin-icon" />
				    <span>{coin.name} <span className="coin-symbol">{coin.symbol.toUpperCase()}</span></span>
				</div>
			    </td>
			    <td>${coin.current_price.toLocaleString()}</td>
			    <td>{formatPriceChange(coin.price_change_percentage_24h)}</td>
			    <td>{formatMarketCap(coin.market_cap)}</td>
			</tr>
		    ))}
		</tbody>
	    </table>
	</div>
    )
}

export default Market
