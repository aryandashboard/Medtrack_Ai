'use client'

import { useState } from 'react'

export default function TestAuthPage() {
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => setLog(prev => [...prev, msg])

  const runTest = async () => {
    setLog([])
    try {
      addLog('Starting test...')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      // 1. Login
      addLog('1. Sending POST /api/v1/auth/login')
      const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@test.com', password: 'password' })
      })
      
      addLog(`Login Status: ${loginRes.status}`)
      
      // 2. Auth Me
      addLog('2. Sending GET /api/v1/auth/me')
      const meRes = await fetch(`${API_URL}/api/v1/auth/me`, {
        credentials: 'include'
      })
      
      addLog(`Auth Me Status: ${meRes.status}`)
      if (meRes.status === 401) {
        addLog('Auth Me failed with 401. This means the browser did not send the cookie!')
      } else if (meRes.status === 200) {
        addLog('Auth Me succeeded! The browser sent the cookie.')
      }

    } catch (err: any) {
      addLog(`Error: ${err.message}`)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Auth Debugger</h1>
      <button 
        onClick={runTest}
        style={{ padding: '0.5rem 1rem', background: 'blue', color: 'white', cursor: 'pointer' }}
      >
        Run Test
      </button>
      <hr style={{ margin: '1rem 0' }} />
      {log.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  )
}
