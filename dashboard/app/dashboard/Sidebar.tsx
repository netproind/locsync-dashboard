'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>) },
  { href: '/dashboard/bot', label: 'Bot Settings', icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5"/><circle cx="6.5" cy="10" r="1" fill="currentColor"/><circle cx="11.5" cy="10" r="1" fill="currentColor"/><path d="M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
  { href: '/dashboard/account', label: 'Account', icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 15c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
  { href: '/dashboard/billing', label: 'Billing', icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h14" stroke="currentColor" strokeWidth="1.5"/><path d="M5 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
]

export default function Sidebar({ userEmail, role }: { userEmail: string; role: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const isAdmin = role === 'admin'
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = userEmail.slice(0, 2).toUpperCase()

  const sidebarContent = (
    <>
      <div style={s.brand}>
        <div style={s.logoMark}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#c9a84c" strokeWidth="1.5"/>
            <path d="M11 4C11 4 6 7.5 6 11C6 14.5 8.5 17 11 17.5C13.5 17 16 14.5 16 11C16 7.5 11 4 11 4Z" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
            <circle cx="11" cy="11" r="2.5" fill="#c9a84c"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={s.brandName}>LocSync</div>
          <div style={s.brandTag}>AI Receptionist</div>
        </div>
        <button onClick={()=>setOpen(false)} style={{...s.signOutBtn, width:'auto', padding:'4px', display:'none'}} className="mobile-close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={s.divider} />

      {isAdmin && (
        <div style={s.adminBadge}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" fill="#c9a84c"/></svg>
          Administrator
        </div>
      )}

      <nav style={s.nav}>
        <p style={s.navLabel}>Menu</p>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <a key={item.href} href={item.href} onClick={()=>setOpen(false)} style={active ? { ...s.navItem, ...s.navActive } : s.navItem}>
              <span style={active ? { ...s.navIcon, color: 'var(--gold)' } : s.navIcon}>{item.icon}</span>
              {item.label}
              {active && <div style={s.activeBar} />}
            </a>
          )
        })}
        {isAdmin && (
          <>
            <div style={{ ...s.divider, margin: '10px 0' }} />
            <p style={s.navLabel}>Admin</p>
            <a href="/dashboard/admin" onClick={()=>setOpen(false)} style={pathname.startsWith('/dashboard/admin') ? { ...s.navItem, ...s.navActive } : s.navItem}>
              <span style={s.navIcon}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 15c0-2.5 2-4 5-4M17 15c0-2.5-2-4-5-4M9 11c2.5 0 4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
              All Tenants
            </a>
          </>
        )}
      </nav>

      <div style={s.userArea}>
        <div style={s.divider} />
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <div style={s.userInfo}>
            <div style={s.userEmail}>{userEmail}</div>
            <div style={s.userRole}>{isAdmin ? 'Administrator' : 'Salon Owner'}</div>
          </div>
        </div>
        <button onClick={handleSignOut} style={s.signOutBtn}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2M10 10l3-3m0 0l-3-3m3 3H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div style={s.mobileBar}>
        <button onClick={()=>setOpen(true)} style={s.hamburger}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={s.logoMark}>
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#c9a84c" strokeWidth="1.5"/>
              <circle cx="11" cy="11" r="2.5" fill="#c9a84c"/>
            </svg>
          </div>
          <span style={{fontSize:'14px',fontWeight:700,color:'var(--text)',fontFamily:'Syne,sans-serif'}}>LocSync</span>
        </div>
        <div style={{width:'32px'}} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div onClick={()=>setOpen(false)} style={s.overlay} />
      )}

      {/* Desktop sidebar / Mobile drawer */}
      <aside style={{
        ...s.sidebar,
        transform: open ? 'translateX(0)' : undefined,
      }} className={`sidebar-drawer ${open ? 'open' : ''}`}>
        <button onClick={()=>setOpen(false)} style={{...s.signOutBtn, width:'auto', padding:'4px 8px', marginBottom:'8px', alignSelf:'flex-end', display:'none'}} className="close-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  sidebar: { width: 'var(--sidebar-width)', background: 'var(--surface)', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 100, overflowY: 'auto' },
  mobileBar: { display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '56px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', zIndex: 101, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' },
  hamburger: { background: 'transparent', border: 'none', color: 'var(--text)', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 8px' },
  logoMark: { width: '38px', height: '38px', background: 'var(--gold-dim)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(201,168,76,0.15)', flexShrink: 0 },
  brandName: { fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' },
  brandTag: { fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  divider: { height: '1px', background: 'var(--border)', margin: '12px 0' },
  adminBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', color: 'var(--gold)', fontWeight: 600, marginBottom: '8px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  navLabel: { fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 10px', marginBottom: '6px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400, position: 'relative', cursor: 'pointer' },
  navActive: { background: 'var(--gold-dim)', color: 'var(--gold-light)', fontWeight: 500, border: '1px solid rgba(201,168,76,0.12)' },
  navIcon: { flexShrink: 0, color: 'var(--text-muted)' },
  activeBar: { position: 'absolute', right: '-1px', top: '25%', bottom: '25%', width: '3px', background: 'var(--gold)', borderRadius: '2px' },
  userArea: { marginTop: 'auto' },
  userRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', marginBottom: '8px' },
  avatar: { width: '32px', height: '32px', background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 },
  userInfo: { overflow: 'hidden' },
  userEmail: { fontSize: '12px', color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { fontSize: '10px', color: 'var(--text-muted)' },
  signOutBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' },
}
