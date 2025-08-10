import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateUser from './pages/CreateUser'
import Payments from './pages/Payments'
import SendTotal from './pages/SendTotal'
import Alerts from './pages/Alerts'

function isLoggedIn() {
  return !!(localStorage.getItem('email') && localStorage.getItem('password'))
}

export default function App() {
  return (
    <>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/create-user" element={isLoggedIn() ? <CreateUser /> : <Navigate to="/login" />} />
          <Route path="/payments" element={isLoggedIn() ? <Payments /> : <Navigate to="/login" />} />
          <Route path="/send-total" element={isLoggedIn() ? <SendTotal /> : <Navigate to="/login" />} />
          <Route path="/alerts" element={isLoggedIn() ? <Alerts /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  )
}
