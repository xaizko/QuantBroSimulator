import { NavLink, Outlet } from 'react-router-dom'
import './GameLayout.css'
import logo from './assets/solana_start_screen.png'

function GameLayout() {
  return (
    <div className="game-layout">
      <nav className="sidebar">
        
        <img src={logo} alt="Logo" className="sidebar-logo" />

        <div className="sidebar-nav">
          <NavLink to="/home" className="nav-link">
            🏠
          </NavLink>
          
          <NavLink to="/market" className="nav-link">
            📈
          </NavLink>

          <NavLink to="/wallet" className="nav-link">
            💼
          </NavLink>
          
          <NavLink to="/transactions" className="nav-link">
            🧾
          </NavLink>
        </div>

      </nav>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default GameLayout
