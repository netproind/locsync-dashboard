'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const EDITABLE = [
  { key:'salon_name', label:'Salon', placeholder:'Your salon name' },
  { key:'address', label:'Salon Location', placeholder:'Full GMB address' },
  { key:'website_url', label:'Website', placeholder:'https://...' },
  { key:'instagram', label:'Instagram @', placeholder:'@yoursalon' },
  { key:'logo_url', label:'Business Logo URL', placeholder:'https://...' },
  { key:'booking_system', label:'Appointment Booking System', placeholder:'e.g. Vagaro, Square, Booksy' },
  { key:'years_experience', label:'Experience with Locs', placeholder:'e.g. 17 years' },
  { key:'directions_link', label:'Directions to Salon', placeholder:'Google Maps link' },
  { key:'review_link', label:'Review Link', placeholder:'Google review link' },
  { key:'local_vibe', label:'Local Vibe', placeholder:'Describe local culture or language style', big:true },
]

export default function AccountPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('tenants').select('*').eq('email', user.email??'').single()
      if (data) setTenant(data)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const updates: any = {}
    EDITABLE.forEach(f => { updates[f.key] = tenant?.[f.key] ?? null })
    const { error: err } = await supabase.from('tenants').update(updates).eq('email', user.email??'')
    setSaving(false)
    if (err) { setError(err.message) } else {
      setSaved(true)
      setTimeout(()=>setSaved(false),3000)
      fetch('https://hook.us2.make.com/6awp25myoa45rzxk47hy1nrg3akd2hem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'hello', email: user.email, airtable_id: tenant?.airtable_record_id, salon: tenant?.salon_name })
      }).then(r => r.text()).then(t => console.log('webhook:', t))
    }
  }

  const set = (k: string, v: string) => setTenant((t:any) => ({...t,[k]:v}))
  const memberSince = tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '—'

  return (
    <div className="animate-in">
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'28px',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px'}}>Account</h1>
          <p style={{fontSize:'14px',color:'var(--text-muted)'}}>Your profile and salon information</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{background:'var(--gold)',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'11px 24px',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>
          {saving?'Saving...':saved?'✓ Saved':'Save Changes'}
        </button>
      </div>

      {error && <div style={{background:'rgba(224,85,85,0.1)',border:'1px solid rgba(224,85,85,0.3)',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#e05555',marginBottom:'20px'}}>{error}</div>}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'16px'}}>Profile Summary</h3>
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
            {tenant?.logo_url
              ? <img src={tenant.logo_url} alt="logo" style={{width:'52px',height:'52px',borderRadius:'50%',objectFit:'cover',border:'2px solid var(--gold)',flexShrink:0}} />
              : <div style={{width:'52px',height:'52px',background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:700,color:'var(--gold)',flexShrink:0}}>{(tenant?.loctician_name??'LC').slice(0,2).toUpperCase()}</div>
            }
            <div>
              <p style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'2px'}}>{tenant?.loctician_name??'—'}</p>
              <p style={{fontSize:'13px',color:'var(--gold)',marginBottom:'2px'}}>{tenant?.salon_name??'—'}</p>
              <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{tenant?.email??'—'}</p>
            </div>
          </div>
          {[
            ['System ID', tenant?.tenant_id??'—'],
            ['Business Email', tenant?.email??'—'],
            ['Business Phone', tenant?.phone??'—'],
            ['Member Since', memberSince],
            ['Account Status', tenant?.tenant_status??'—', tenant?.tenant_status==='active'],
            ['Member Level', tenant?.membership_type??'—'],
            ['Bot Number', tenant?.bot_phone??tenant?.assigned_phone_number??'Pending'],
            ['Google Rating', tenant?.gmb_rating?`${tenant.gmb_rating}★`:'—'],
          ].map(([label,value,good])=>(
            <div key={label as string} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{label as string}</span>
              <span style={{fontSize:'12px',fontWeight:500,color:good?'var(--green)':'var(--text-soft)',textAlign:'right',maxWidth:'55%',wordBreak:'break-all'}}>{value as string}</span>
            </div>
          ))}
          <a href="https://www.locsync.com/#pricing" target="_blank" style={{display:'block',marginTop:'16px',fontSize:'13px',color:'var(--gold)',fontWeight:500}}>Upgrade Plan →</a>
        </div>

        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'8px'}}>Edit Your Info</h3>
          <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'16px',lineHeight:'1.5'}}>Changes here sync back to your LocSync record.</p>
          <div style={{display:'flex',flexDirection:'column',gap:'14px',maxHeight:'580px',overflowY:'auto'}}>
            {EDITABLE.map(f=>(
              <div key={f.key} style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)'}}>{f.label}</label>
                {(f as any).big
                  ? <textarea rows={3} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px 12px',fontSize:'13px',color:'var(--text)',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif',resize:'vertical'}} value={tenant?.[f.key]??''} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder} />
                  : <input style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px 12px',fontSize:'13px',color:'var(--text)',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif'}} value={tenant?.[f.key]??''} onChange={e=>set(f.key,e.target.value)} placeholder={f.placeholder} />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
