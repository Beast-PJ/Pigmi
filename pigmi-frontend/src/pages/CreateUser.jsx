import React, { useState } from 'react'
import api from '../api'
import './App.css'

export default function CreateUser() {
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [role, setRole] = useState('agent')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const res = await api.createUser({
        new_email: newEmail,
        new_password: newPassword,
        new_role: role,
        name
      })
      setMsg({ type: 'success', text: `User created: ${res.email}` })
      setNewEmail('')
      setNewPassword('')
      setName('')
      setRole('agent')
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.detail || err.message || 'Error creating user'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-user-container">
      {/* Header */}
      <div className="create-user-header">
        <h2>Create User</h2>
        <p>Add a new user to the Pigmi system with a specific role.</p>
      </div>

      {/* Form & Side Info */}
      <div className="create-user-layout">
        {/* Form */}
        <form className="create-user-form" onSubmit={submit}>
          <label>Name</label>
          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            placeholder="Email address"
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />

          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>

          {/* Live Role Badge */}
          <div className={`role-preview role-${role}`}>
            Selected Role: {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>

        {/* Side Info Card */}
        <div className="role-info-card">
          <h3>Role Permissions</h3>
          <ul>
            <li><strong>Admin:</strong> Full system access</li>
            <li><strong>Manager:</strong> Manages agents & transactions</li>
            <li><strong>Agent:</strong> Collects customer payments</li>
            <li><strong>Customer:</strong> Makes monthly deposits</li>
          </ul>
          <p className="note">
            You must be signed in as an admin to create new users.
          </p>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div className={`msg-box ${msg.type}`}>
          {msg.text}
        </div>
      )}
    </div>
  )
}
