'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [err, setErr] = useState<any>(null)

  useEffect(() => {
  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data, error } = await supabase
  .from('tenants')
  .select('loctician_name, salon_name, tenant_id, tenant_status, membership_type, assigned_phone_number, bot_phone, trial_expires_at, logo_url, gmb_rating, created_at, bot_active, twilio_configured, booking_url')
  .eq('email', user.email)
  .maybeSingle()
setErr(error)
if (data) setTenant(data)
    else console.log('tenant null, user email:', user.email)
  }
  load()
}, [])

  const trialEnd = tenant?.trial_end_date ? new Date(tenant.trial_end_date) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000*60*60*24))) : 7
  const displayName = tenant?.loctician_name ?? 'NO TENANT FOUND'
  const isActive = tenant?.tenant_status === 'active'

  return (
    <div className="animate-in">
    <p style={{color:'red'}}>{err?.message ?? 'no error'}</p>

      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'32px',flexWrap:'wrap',gap:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
          {tenant?.logo_url && <img src={tenant.logo_url} alt="logo" style={{width:'56px',height:'56px',borderRadius:'12px',objectFit:'cover',border:'1px solid var(--border)'}} />}
          <div>
            <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'4px'}}>Good to have you back</p>
            <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'2px'}}>Welcome, {displayName} 👋</h1>
            {tenant?.salon_name && <p style={{fontSize:'13px',color:'var(--gold)',fontWeight:500}}>{tenant.salon_name}</p>}
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',background:isActive?'var(--gold-dim)':'rgba(76,175,125,0.1)',border:`1px solid ${isActive?'rgba(201,168,76,0.25)':'rgba(76,175,125,0.2)'}`,borderRadius:'20px',padding:'8px 16px',fontSize:'13px',color:isActive?'var(--gold-light)':'var(--green)',fontWeight:500}}>
          <div style={{width:'7px',height:'7px',borderRadius:'50%',background:isActive?'var(--gold)':'var(--green)'}} />
          {tenant?.tenant_status === 'active' ? 'Active' : `Trial — ${daysLeft} days left`}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'16px',marginBottom:'24px'}}>
        {[
          ['🔑','System ID',tenant?.tenant_id??'—','Your unique account ID'],
          ['⭐','Member Level',tenant?.membership_type??'Temp Plan','Current plan type'],
          ['📞','Bot Number',tenant?.bot_phone??tenant?.assigned_phone_number??'Pending','Your AI receptionist line'],
          ['🌟','Google Rating',tenant?.gmb_rating?`${tenant.gmb_rating}★`:'—','From Google Business'],
        ].map(([icon,label,value,sub])=>(
          <div key={label as string} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px'}}>
            <div style={{fontSize:'18px',marginBottom:'10px'}}>{icon as string}</div>
            <div style={{fontSize:'18px',fontWeight:700,color:'var(--text)',fontFamily:'Syne,sans-serif',marginBottom:'4px',wordBreak:'break-all'}}>{value as string}</div>
            <div style={{fontSize:'13px',fontWeight:500,color:'var(--text-soft)',marginBottom:'2px'}}>{label as string}</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)'}}>{sub as string}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'20px'}}>Account Status</h3>
          {[
            ['Account Status', tenant?.tenant_status??'Trial', isActive],
            ['Member Level', tenant?.membership_type??'Temp Plan', true],
            ['Bot Active', tenant?.bot_active?'Active':'Pending Setup', tenant?.bot_active],
            ['Phone Configured', tenant?.twilio_configured?'Configured':'Pending', tenant?.twilio_configured],
            ['Booking URL', tenant?.booking_url?'Connected':'Not set', !!tenant?.booking_url],
          ].map(([label,value,good])=>(
            <div key={label as string} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:good?'var(--green)':'var(--border)',flexShrink:0}} />
              <span style={{fontSize:'13px',color:'var(--text-muted)',flex:1}}>{label as string}</span>
              <span style={{fontSize:'13px',fontWeight:500,color:good?'var(--green)':'var(--text-soft)'}}>{value as string}</span>
            </div>
          ))}
        </div>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'20px'}}>Quick Actions</h3>
          {[
            ['/dashboard/bot','🤖','Configure your AI bot','Set greeting, services & phone'],
            ['/dashboard/account','👤','View your profile','Salon info & contact details'],
            ['/dashboard/billing','💳','Manage billing','Plan, payment & subscription'],
            ['https://www.locsync.com/#pricing','🚀','Upgrade your plan','Unlock full features'],
          ].map(([href,icon,label,desc])=>(
            <a key={label as string} href={href as string} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'8px',cursor:'pointer'}}>
              <span style={{fontSize:'20px',flexShrink:0}}>{icon as string}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:'14px',fontWeight:500,color:'var(--text-soft)',marginBottom:'2px'}}>{label as string}</div>
                <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{desc as string}</div>
              </div>
              <span style={{color:'var(--text-muted)',fontSize:'14px'}}>→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
