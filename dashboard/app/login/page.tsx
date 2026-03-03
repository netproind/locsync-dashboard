'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      {/* Background texture */}
      <div style={styles.bgGrid} />

      <div style={styles.card} className="animate-in">
        {/* Logo area */}
        <div style={styles.logoArea}>
          <div style={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#c9a84c" strokeWidth="1.5" />
              <path d="M14 6 C14 6 8 10 8 14 C8 18 11 21 14 22 C17 21 20 18 20 14 C20 10 14 6 14 6Z" stroke="#c9a84c" strokeWidth="1.5" fill="none" />
              <circle cx="14" cy="14" r="3" fill="#c9a84c" />
            </svg>
          </div>
          <div>
            <h1 style={styles.brand}>LocSync</h1>
            <p style={styles.brandSub}>Client Portal</p>
          </div>
        </div>

        {!sent ? (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>Welcome back</h2>
              <p style={styles.subtitle}>Enter your email and we'll send you a magic link to sign in — no password needed.</p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yoursalon.com"
                  required
                  style={styles.input}
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.target.style, styles.input)}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={loading ? { ...styles.btn, ...styles.btnLoading } : styles.btn}>
                {loading ? (
                  <span style={styles.spinner} />
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p style={styles.footer}>
              New to LocSync?{' '}
              <a href="https://locsync.ai" style={styles.link}>Start your free trial →</a>
            </p>
          </>
        ) : (
          <div style={styles.successArea} className="animate-in">
            <div style={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#c9a84c" strokeWidth="1.5" />
                <path d="M10 16l4 4 8-8" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={styles.successTitle}>Check your inbox</h2>
            <p style={styles.successText}>
              We sent a magic link to <strong style={{ color: 'var(--gold)' }}>{email}</strong>. 
              Click it to sign in — it expires in 1 hour.
            </p>
            <button onClick={() => { setSent(false); setEmail('') }} style={styles.resendBtn}>
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoMark: {
    width: '44px',
    height: '44px',
    background: 'var(--gold-dim)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(201,168,76,0.2)',
  },
  brand: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  brandSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-soft)',
    letterSpacing: '0.02em',
  },
  input: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '13px 16px',
    fontSize: '15px',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  inputFocus: {
    background: 'var(--surface2)',
    border: '1px solid rgba(201,168,76,0.5)',
    borderRadius: '10px',
    padding: '13px 16px',
    fontSize: '15px',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  errorBox: {
    background: 'rgba(224,85,85,0.1)',
    border: '1px solid rgba(224,85,85,0.3)',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#e05555',
  },
  btn: {
    background: 'var(--gold)',
    color: '#0a0a0a',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s, transform 0.1s',
    fontFamily: 'Syne, sans-serif',
    letterSpacing: '0.01em',
  },
  btnLoading: {
    background: 'rgba(201,168,76,0.5)',
    color: '#0a0a0a',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(0,0,0,0.2)',
    borderTop: '2px solid #0a0a0a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  footer: {
    marginTop: '24px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  link: {
    color: 'var(--gold)',
    fontWeight: 500,
  },
  successArea: {
    textAlign: 'center',
    padding: '16px 0',
  },
  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    animation: 'pulse-gold 2s infinite',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  successText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  resendBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
  },
}
