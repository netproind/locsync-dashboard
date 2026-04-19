'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const ADMINS = ['unathair@gmail.com', 'locsyncbot@gmail.com']
const MAKE_OPS_LIMIT = 10000

export default function AdminPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [twilioUsage, setTwilioUsage] = useState<any>(null)
  const [makeUsage, setMakeUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMINS.includes(user.email ?? '')) {
        window.location.href = '/dashboard'
        return
      }
      setAuthorized(true)

      // Load tenants
      const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false })
      setTenants(data ?? [])

      // Load Twilio usage
      try {
        const now = new Date()
        const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
        const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const res = await fetch(`/api/admin/twilio-usage?startDate=${startDate}&endDate=${endDate}`)
        if (res.ok) setTwilioUsage(await res.json())
      } catch (e) {
        console.error('Twilio usage error:', e)
      }

      // Load Make usage
      try {
        const res = await fetch(`/api/admin/make-usage`)
        if (res.ok) setMakeUsage(await res.json())
      } catch (e) {
        console.error('Make usage error:', e)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (!authorized) return null
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}>
      <div style={{color:'var(--gold)',fontSize:'14px'}}>Loading admin dashboard...</div>
    </div>
  )

  const total = tenants.length
  const active = tenants.filter(t => t.tenant_status === 'active').length
  const onTrial = tenants.filter(t => t.tenant_status?.toLowerCase().includes('trial') || t.is_trial).length
  const botActive = tenants.filter(t => t.bot_active).length
  const expiringSoon = tenants.filter(t => {
    if (!t.trial_expires_at) return false
    const days = Math.ceil((new Date(t.trial_expires_at).getTime() - Date.now()) / (1000*60*60*24))
    return days >= 0 && days <= 2
  }).length

  const makeOpsUsed = makeUsage?.operations_used ?? 0
  const makeOpsPercent = Math.round((makeOpsUsed / MAKE_OPS_LIMIT) * 100)
  const makeWarning = makeOpsPercent >= 80

  const twilioMinutes = twilioUsage?.voice_minutes ?? 0
  const twilioCalls = twilioUsage?.voice_calls ?? 0
  const twilioSMS = twilioUsage?.sms_count ?? 0
  const twilioCost = twilioUsage?.total_cost ?? 0

  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'28px',flexWrap:'wrap'}}>
        <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em'}}>Admin Dashboard</h1>
        <div style={{background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'var(--gold)',fontWeight:500}}>⭐ Admin View</div>
        {expiringSoon > 0 && (
          <div style={{background:'rgba(224,85,85,0.1)',border:'1px solid rgba(224,85,85,0.3)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'#e05555',fontWeight:500}}>
            ⚠️ {expiringSoon} trial{expiringSoon > 1 ? 's' : ''} expiring soon
          </div>
        )}
      </div>

      {/* Tenant Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {[['Total Tenants',total,'👥'],['Active',active,'✅'],['On Trial',onTrial,'⏳'],['Bot Active',botActive,'🤖']].map(([label,value,icon])=>(
          <div key={label as string} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px',textAlign:'center'}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{icon as string}</div>
            <div style={{fontSize:'28px',fontWeight:700,color:'var(--gold)',fontFamily:'Syne,sans-serif'}}>{value as number}</div>
            <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px'}}>{label as string}</div>
          </div>
        ))}
      </div>

      {/* Usage Monitoring */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'24px'}}>
        
        {/* Twilio Usage */}
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)'}}>📞 Twilio Usage</h3>
            <span style={{fontSize:'11px',color:'var(--text-muted)'}}>This month</span>
          </div>
          {twilioUsage ? (
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                ['Voice Calls', twilioCalls, ''],
                ['Voice Minutes', `${twilioMinutes} min`, ''],
                ['SMS Sent', twilioSMS, ''],
                ['Est. Cost', `$${Number(twilioCost).toFixed(2)}`, twilioCost > 50],
              ].map(([label, value, warn]) => (
                <div key={label as string} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:'13px',color:'var(--text-muted)'}}>{label as string}</span>
                  <span style={{fontSize:'13px',fontWeight:600,color: warn ? '#e05555' : 'var(--text)'}}>{value as string}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{color:'var(--text-muted)',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>
              Loading Twilio data...
            </div>
          )}
        </div>

        {/* Make Usage */}
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)'}}>⚙️ Make Operations</h3>
            <span style={{fontSize:'11px',color:'var(--text-muted)'}}>This month</span>
          </div>
          {makeUsage ? (
            <>
              <div style={{marginBottom:'16px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontSize:'13px',color:'var(--text-muted)'}}>Operations Used</span>
                  <span style={{fontSize:'13px',fontWeight:600,color: makeWarning ? '#e05555' : 'var(--text)'}}>
                    {makeOpsUsed.toLocaleString()} / {MAKE_OPS_LIMIT.toLocaleString()}
                  </span>
                </div>
                <div style={{height:'8px',background:'var(--surface2)',borderRadius:'4px',overflow:'hidden'}}>
                  <div style={{
                    height:'100%',
                    width:`${Math.min(makeOpsPercent, 100)}%`,
                    background: makeOpsPercent >= 90 ? '#e05555' : makeOpsPercent >= 80 ? '#f5a623' : 'var(--gold)',
                    borderRadius:'4px',
                    transition:'width 0.5s ease'
                  }} />
                </div>
                <div style={{fontSize:'11px',color: makeWarning ? '#e05555' : 'var(--text-muted)',marginTop:'6px',textAlign:'right'}}>
                  {makeOpsPercent}% used {makeWarning ? '⚠️ Approaching limit!' : ''}
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'1px solid var(--border)'}}>
                <span style={{fontSize:'13px',color:'var(--text-muted)'}}>Remaining</span>
                <span style={{fontSize:'13px',fontWeight:600,color:'var(--text)'}}>{(MAKE_OPS_LIMIT - makeOpsUsed).toLocaleString()} ops</span>
              </div>
            </>
          ) : (
            <div style={{color:'var(--text-muted)',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>
              Loading Make data...
            </div>
          )}
        </div>
      </div>

      {/* Tenant Table */}
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)'}}>All Locticians</h3>
          <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{total} total</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 1fr 1fr',padding:'12px 20px',borderBottom:'1px solid var(--border)',fontSize:'11px',color:'var(--text-muted)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500,minWidth:'700px'}}>
            <span>Loctician / Salon</span><span>Email</span><span>Location</span><span>Status</span><span>Plan</span><span>Bot</span><span>Trial</span>
          </div>
          {tenants.map(t => {
            const trialEnd = t.trial_expires_at ? new Date(t.trial_expires_at) : null
            const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000*60*60*24))) : null
            const expiring = daysLeft !== null && daysLeft <= 2
            return (
              <div key={t.id} style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 1fr 1fr',padding:'14px 20px',borderBottom:'1px solid var(--border)',fontSize:'13px',alignItems:'center',minWidth:'700px'}}>
                <div>
                  <div style={{fontWeight:500,color:'var(--text)'}}>{t.loctician_name??'—'}</div>
                  <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{t.salon_name??'—'}</div>
                </div>
                <div style={{color:'var(--text-muted)',fontSize:'12px',wordBreak:'break-all'}}>{t.email??'—'}</div>
                <div style={{color:'var(--text-muted)',fontSize:'12px'}}>{t.city??'—'}{t.state?`, ${t.state}`:''}</div>
                <div>
                  <span style={{background:t.tenant_status==='active'?'rgba(76,175,125,0.1)':'var(--gold-dim)',color:t.tenant_status==='active'?'var(--green)':'var(--gold)',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:500}}>
                    {t.tenant_status??'trial'}
                  </span>
                </div>
                <div style={{color:'var(--text-muted)',fontSize:'12px'}}>{t.membership_type??'—'}</div>
                <div style={{color:t.bot_active?'var(--green)':'var(--text-muted)',fontSize:'12px'}}>{t.bot_active?'● Active':'○ Pending'}</div>
                <div style={{color:expiring?'#e05555':'var(--text-muted)',fontSize:'12px',fontWeight:expiring?600:400}}>
                  {daysLeft!==null?`${daysLeft}d`:'—'}{expiring?' ⚠️':''}
                </div>
              </div>
            )
          })}
          {tenants.length === 0 && (
            <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>No tenants yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
