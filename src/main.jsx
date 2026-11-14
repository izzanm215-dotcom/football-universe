import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './style.css'

const supabase = createClient(
  'https://qnzdazpipfxogcgbeqqy.supabase.co',
  'sb_publishable_OTNdYoZlAGSCJZec9LY1vw_HVINwVIT'
)

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (error) setMessage(error.message)
    else setUser(data.user)
    setLoading(false)
  }

  async function register() {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email, password
    })
    setMessage(error ? error.message : 'Pendaftaran berhasil. Periksa email untuk konfirmasi akun.')
    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <div className="app">
      <header>
        <h2>⚽ FOOTBALL <span>UNIVERSE</span></h2>
        <small>YOUR COMMUNITY FOOTBALL LEAGUE</small>
      </header>

      {!user ? (
        <main className="login">
          <h1>Masuk ke Universe</h1>
          <p>Tempat klub dan pemain berkumpul.</p>
          <input
            type="email"
            placeholder="Alamat email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={login} disabled={loading}>
            {loading ? 'Memproses...' : 'MASUK'}
          </button>
          <button className="register" onClick={register} disabled={loading}>
            DAFTAR AKUN
          </button>
          {message && <p className="message">{message}</p>}
        </main>
      ) : (
        <main>
          <h1>Selamat datang!</h1>
          <p>{user.email}</p>
          <section className="panel">
            <h2>Football Universe</h2>
            <p>Kompetisi sepak bola komunitas dimulai di sini.</p>
          </section>
          <button onClick={logout}>KELUAR</button>
        </main>
      )}

      <footer>FOOTBALL UNIVERSE © 2026</footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
