import React, { useEffect, useState } from 'react'
import './App.css'

export default function SendTotal() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate loading demo data
    setLoading(true)
    setTimeout(() => {
      setAgents([
        { id: 'agent1', name: 'Agent 1', total: 24500 },
        { id: 'agent2', name: 'Agent 2', total: 18700 },
        { id: 'agent3', name: 'Agent 3', total: 31200 },
      ])
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div className="agent-total-container">
      <div className="agent-total-header">
        <h2>Agent Totals</h2>
        <button className="btn-refresh" onClick={() => {}} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading-msg">Loading...</div>}
      {!loading && agents.length === 0 && !error && (
        <div className="empty-msg">No agent data found.</div>
      )}

      {/* Agent Cards */}
      <div className="agent-cards-grid">
        {agents.map((agent) => (
          <div className="agent-card" key={agent.id}>
            <div className="agent-avatar">{agent.name.charAt(0)}</div>
            <div className="agent-info">
              <p className="agent-name">{agent.name}</p>
              <p className="agent-total">₹{agent.total.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
