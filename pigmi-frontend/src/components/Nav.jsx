  import React from 'react'
  import { Link, useLocation, useNavigate } from 'react-router-dom'
  import './Nav.css'  // Import external CSS

  export default function Nav() {
    const loc = useLocation()
    const nav = useNavigate()
    const email = localStorage.getItem('email')

    function logout() {
      localStorage.removeItem('email')
      localStorage.removeItem('password')
      nav('/login')
    }

    return (
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">Pigmi Admin</Link>
          <Link to="/dashboard" className={loc.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/create-user" className={loc.pathname === '/create-user' ? 'active' : ''}>Create User</Link>
          <Link to="/payments" className={loc.pathname === '/payments' ? 'active' : ''}>Payments</Link>
          <Link to="/send-total" className={loc.pathname === '/send-total' ? 'active' : ''}>Agent Total</Link>
          <Link to="/alerts" className={loc.pathname === '/alerts' ? 'active' : ''}>Alerts</Link>
        </div>
        <div className="nav-right">
          <div className="signed-in">{email ? `Signed in as ${email}` : 'Not signed in'}</div>
          {email && <button onClick={logout} className="logout-btn">Logout</button>}
        </div>
      </nav>
    )
  }
