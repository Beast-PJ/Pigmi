import React, { useEffect, useState } from 'react'
import './App.css'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Demo alert data: agent1 posted 20000, but actual is 24500 (mismatch)
      setAlerts([
        {
          id: 'demo1',
          type: 'mismatch',
          agent_id: 'agent1',
          posted_total: 20000,
          actual_total: 24500,
          month: '2024-07',
          created_at: { seconds: Math.floor(Date.now() / 1000) },
          resolved: false
        },
        {
          id: 'demo2',
          type: 'Success',
          agent_id: 'agent2',
          posted_total: 15000,
          actual_total: 15000,
          month: '2024-07',
          created_at: { seconds: Math.floor(Date.now() / 1000) - 86400 },
          resolved: true
        }
      ])
      setLoading(false)
    }, 800)
  }, [])

  const totalAlerts = alerts.length
  const latestMonth = alerts[0]?.month || '—'
  const mismatchCount = alerts.filter(a => a.posted_total !== a.actual_total).length

  return (
    <div className="alerts-container">
      {/* Header */}
      <div className="alerts-header">
        <h2>Alerts</h2>
        <button className="btn-refresh" onClick={() => {}} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="top-stats">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <p className="stat-value">{totalAlerts}</p>
        </div>
        <div className="stat-card">
          <h4>Unresolved Mismatches</h4>
          <p className="stat-value negative">{mismatchCount}</p>
        </div>
        <div className="stat-card">
          <h4>Latest Month</h4>
          <p className="stat-value">{latestMonth}</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading-msg">Loading alerts…</div>}
      {!loading && alerts.length === 0 && !error && (
        <div className="empty-msg">No alerts</div>
      )}

      {/* Alert Cards */}
      <div className="alerts-grid">
        {alerts.map(a => (
          <div key={a.id} className={`alert-card ${a.posted_total !== a.actual_total ? 'alert-mismatch' : ''}`}>
            <div className="alert-header">
              <span className="alert-type">{a.type}</span>
              <span className="alert-date">
                {a.created_at?.seconds
                  ? new Date(a.created_at.seconds * 1000).toLocaleString()
                  : '—'}
              </span>
            </div>
            <p><strong>Agent:</strong> {a.agent_id}</p>
            <p><strong>Month:</strong> {a.month}</p>
            <p><strong>Posted:</strong> ₹{a.posted_total.toLocaleString()}</p>
            <p><strong>Actual:</strong> ₹{a.actual_total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
