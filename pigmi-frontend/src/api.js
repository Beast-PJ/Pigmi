import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

function getAuthFields() {
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  return { email, password };
}

async function signInWithFirebase(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAels5R4-FdoW5VTfh7m0IXzc-Bo-TM0qY`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'login failed' }));
    throw new Error(err.error?.message || err?.message || 'Login failed');
  }
  return resp.json();
}

async function createUser({ new_email, new_password, new_role, name }) {
  const auth = getAuthFields();
  const body = { email: auth.email, password: auth.password, new_email, new_password, new_role, name };
  const resp = await axios.post(`${API_BASE}/users/create/`, body);
  return resp.data;
}

async function recordPayment({ customer_id, agent_id, amount, note }) {
  const auth = getAuthFields();
  const body = { email: auth.email, password: auth.password, customer_id, agent_id, amount, note };
  const resp = await axios.post(`${API_BASE}/payments/`, body);
  return resp.data;
}

async function sendTotal({ agent_id, total }) {
  const auth = getAuthFields();
  const body = { email: auth.email, password: auth.password, total };
  const resp = await axios.post(`${API_BASE}/agents/${encodeURIComponent(agent_id)}/send_total/`, body);
  return resp.data;
}

async function getAlerts() {
  const resp = await axios.get(`${API_BASE}/alerts/`);
  return resp.data;
}

/** ✅ New function to fetch payment history */
async function getPayments() {
  const auth = getAuthFields();
  const body = { email: auth.email, password: auth.password };

  // Assuming backend endpoint /payments/history/ returns all agents' payments
  const resp = await axios.post(`${API_BASE}/payments/history/`, body);
  return resp.data; // Should match your provided data structure
}

async function getAgentTotals(month) {
  const auth = getAuthFields()
  const body = { email: auth.email, password: auth.password, month }
  const resp = await axios.post(`${API_BASE}/payments/history/`, body)
  return resp.data.agent_totals || {}
}

async function getAgentPayments(agentId) {
    const res = await fetch(`${API_BASE}/agents/${agentId}/payments/`)
    if (!res.ok) throw new Error('Failed to fetch payments')
    return res.json()
  }

export default {
  signInWithFirebase,
  createUser,
  recordPayment,
  sendTotal,
  getAlerts,
  getPayments,
  getAgentTotals,
  getAgentPayments
}

