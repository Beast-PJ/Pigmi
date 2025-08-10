import React, { useEffect, useState } from 'react'
import api from '../api'
import './App.css'

export default function Payments() {
  const [transactions, setTransactions] = useState([])
  const [filteredTx, setFilteredTx] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
  setLoading(true)
  setError(null)
  try {
    const res = await api.getPayments()
    const payments = res.payments || {}

    // Flatten agent-based structure into one array
    const txs = Object.entries(payments).flatMap(([agentId, txMap]) =>
      Object.values(txMap).map(tx => ({
        date: tx.timestamp,
        customer_id: tx.customer_id,
        agent_id: agentId,
        amount: tx.amount,
        note: tx.note || ''
      }))
    )

    setTransactions(txs)
    setFilteredTx(txs)
  } catch (err) {
    setError(err.response?.data?.detail || err.message || 'Failed to load transactions')
  } finally {
    setLoading(false)
  }
}


  function applyFilters() {
    let data = [...transactions]
    if (search) {
      data = data.filter(tx =>
        (tx.customer_name || tx.customer_id).toLowerCase().includes(search.toLowerCase()) ||
        (tx.agent_name || tx.agent_id).toLowerCase().includes(search.toLowerCase())
      )
    }
    if (dateFrom) {
      data = data.filter(tx => new Date(tx.date) >= new Date(dateFrom))
    }
    if (dateTo) {
      data = data.filter(tx => new Date(tx.date) <= new Date(dateTo))
    }
    setFilteredTx(data)
  }

  function exportCSV() {
    const headers = ['Date', 'Customer', 'Agent', 'Amount', 'Note']
    const rows = filteredTx.map(tx => [
      new Date(tx.date).toLocaleString(),
      tx.customer_name || tx.customer_id,
      tx.agent_name || tx.agent_id,
      tx.amount,
      tx.note || ''
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n')
    const link = document.createElement('a')
    link.href = encodeURI(csvContent)
    link.download = 'transactions.csv'
    link.click()
  }

  // Summary stats
  const totalPayments = filteredTx.reduce((sum, tx) => sum + tx.amount, 0)
  const thisMonthTotal = filteredTx
    .filter(tx => new Date(tx.date).getMonth() === new Date().getMonth())
    .reduce((sum, tx) => sum + tx.amount, 0)
  const highestPayment = Math.max(...filteredTx.map(tx => tx.amount), 0)

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>Payment Transactions</h2>
        <div className="payments-actions">
          <button className="btn-refresh" onClick={loadTransactions} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="btn-export" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="top-stats">
        <div className="stat-card">
          <h4>Total Payments</h4>
          <p className="stat-value">₹{totalPayments.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>This Month</h4>
          <p className="stat-value positive">₹{thisMonthTotal.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Highest Payment</h4>
          <p className="stat-value">₹{highestPayment.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Transactions</h4>
          <p className="stat-value">{filteredTx.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search by Customer or Agent"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
        />
        <button className="btn-filter" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading-msg">Loading transactions...</div>}
      {!loading && filteredTx.length === 0 && !error && (
        <div className="empty-msg">No payment records found.</div>
      )}

      {!loading && filteredTx.length > 0 && (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Agent</th>
                <th>Amount</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx, index) => (
                <tr key={index}>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                  <td>{tx.customer_name || tx.customer_id}</td>
                  <td>{tx.agent_name || tx.agent_id}</td>
                  <td className={tx.amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                    ₹{tx.amount.toLocaleString()}
                  </td>
                  <td>{tx.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
