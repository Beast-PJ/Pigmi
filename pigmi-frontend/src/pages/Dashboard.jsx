import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'
import './App.css'

export default function Dashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)

  // Demo stats (replace with real API calls later)
    const [stats, setStats] = useState({
      balance: '₹2,45,000',
      profits: '₹1,25,000',
      losses: '₹18,500',
    })

  const [managers, setManagers] = useState([
    { name: 'Manager 1', total: 78000, trend: '+12%' },
    { name: 'Manager 2', total: 65200, trend: '+8%' },
    { name: 'Manager 3', total: 45900, trend: '-3%' }
  ])

  const [team, setTeam] = useState([
    { name: 'Anil Kumar', role: 'Manager' },
    { name: 'Priya Sharma', role: 'Manager' },
    { name: 'Ravi Singh', role: 'Agent' },
    { name: 'Neha Verma', role: 'Agent' }
  ])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await api.getAlerts()
      setAlerts(res.alerts || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/create-user">
          <button className="btn-primary">Create User</button>
        </Link>
      </header>

      {/* Top Summary Cards */}
      <div className="top-stats">
        <div className="stat-card">
          <h4>Balance</h4>
          <p className="stat-value">{stats.balance}</p>
        </div>
        <div className="stat-card">
          <h4>Profits</h4>
          <p className="stat-value positive">{stats.profits}</p>
        </div>
        <div className="stat-card">
          <h4>Losses</h4>
          <p className="stat-value negative">{stats.losses}</p>
        </div>

      </div>

      {/* Manager Performance */}
      <section className="manager-performance">
        <h3>Manager Collections</h3>
        {managers.map((m) => (
          <div key={m.name} className="manager-row">
            <span className="manager-name">{m.name}</span>
            <div className="progress-bar">
              <div
                className={`progress-fill ${m.trend.startsWith('+') ? 'positive' : 'negative'}`}
                style={{ width: `${Math.min((m.total / 80000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="manager-total">₹{m.total.toLocaleString()}</span>
            <span className={`manager-trend ${m.trend.startsWith('+') ? 'positive' : 'negative'}`}>
              {m.trend}
            </span>
          </div>
        ))}
      </section>

      {/* Alerts & Quick Actions */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>Alerts</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="large-number">{alerts.length}</div>
              <Link to="/alerts" className="view-link">View alerts</Link>
            </>
          )}
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-links">
            <Link to="/payments">Record Payment</Link><br />
            <Link to="/send-total">Send Total</Link>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <section className="team-section">
        <h3>Team Members</h3>
        <div className="team-list">
          {team.map((t, idx) => (
            <div key={idx} className="team-card">
              <div className="team-avatar">{t.name.charAt(0)}</div>
              <div>
                <p className="team-name">{t.name}</p>
                <p className="team-role">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
