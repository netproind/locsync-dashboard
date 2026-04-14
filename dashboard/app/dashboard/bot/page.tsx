'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const SERVICE_URLS = [
  { key:'retwist_booking_url', label:'Retwist Booking Url' },
  { key:'wick_booking_url', label:'Wick Booking Url' },
  { key:'interlock_booking_url', label:'Interlock Maintenance Booking Url' },
  { key:'sisterlock_microlock_booking_url', label:'Sisterlock/Microlock Booking Url' },
  { key:'crochet_booking_url', label:'Crochet Maintenance Booking Url' },
  { key:'instant_locs_booking_url', label:'Instant Locs Booking Url' },
  { key:'starter_locs_booking_url', label:'Starter Locs Booking Url' },
  { key:'sisterlock_microlock_install_booking_url', label:'Sisterlock/Microlock Install Booking Url' },
  { key:'loc_extensions_booking_url', label:'Loc Extensions Booking Url' },
  { key:'loc_attachment_booking_url', label:'Loc Attachment Booking Url' },
  { key:'loc_repair_booking_url', label:'Loc Repair Booking Url' },
]

const POLICIES = [
  { key:'booking_url', label:'Booking Url', hint:'Main booking link' },
  { key:'booking_window', label:'Booking Window', hint:'How far ahead clients can book' },
  { key:'deposit_terms', label:'Salon Deposit Terms', hint:'Whether you take deposits' },
  { key:'deposit_amount', label:'Appointment Deposit Amount', hint:'Deposit fee amount' },
  { key:'consultation_fee', label:'Consultation Fee', hint:'Fee for consultations' },
  { key:'consultation_link', label:'Consultation Url', hint:'Link to book a consultation' },
  { key:'cancellation_policy', label:'Cancellation Policy', hint:'What clients must do to cancel', big:true },
  { key:'gallery_link', label:'Gallery Url', hint:'Link to your photo gallery' },
  { key:'parking_info', label:'Parking Info', hint:'Parking details for clients' },
  { key:'children_allowed', label:'Child Policy', hint:'Whether children are allowed' },
  { key:'pet_policy', label:'Pet Policy', hint:'Explanation of pet policy', big:true },
  { key:'payment_options', label:'Payment Options', hint:'Ways clients can pay' },
  { key:'safety_policy', label:'Safety Policy', hint:'Safety policy explanation', big:true },
  { key:'service_levels', label:'Service Levels', hint:'Level types offered' },
  { key:'booking_policy', label:'Booking Policy', hint:'Booking policy explanation', big:true },
  { key:'terms', label:'Salon Terms', hint:'Terms description', big:true },
  { key:'same_day_availability', label:'Same Day Availability', hint:'Same day booking info' },
  { key:'mobile_service_availability', label:'Mobile Service Availability', hint:'Mobile service info' },
  { key:'mobile_service_policy', label:'Mobile Service Policy', hint:'Mobile service policy', big:true },
]

const AVATARS = [
  {name:'Gina',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-gina.png'},
  {name:'Crystal',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-crystal.png'},
  {name:'Shannon',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-shannon.png'},
  {name:'Tamika',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-tamika.png'},
  {name:'Mina',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-mina.png'},
  {name:'Larissa',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-larissa.png'},
  {name:'Vicki',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-vicki.png'},
  {name:'Tasha',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-tasha.png'},
  {name:'Lisa',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-lisa.png'},
  {name:'Angie',url:'https://raw.githubusercontent.com/netproind/locsync-dashboard/main/public/avatar/ai-angie.png'},
]

type Tab = 'config' | 'services' | 'policies'

export default function BotPage() {
  const [tenant, setTenant] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('config')
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
    const keys = [
      'bot_greeting','handoff_phone','avatar',
      ...SERVICE_URLS.map(s=>s.key),
      ...POLICIES.map(p=>p.key),
      ...[1,2,3,4,5].flatMap(n=>[`specialty_service_${n}_name`,`specialty_service_${n}_url`]),
    ]
    const updates: any = {}
    keys.forEach(k => { updates[k] = tenant?.[k] ?? null })
    const { error: err } = await supabase.from('tenants').update(updates).eq('email', user.email??'')
    setSaving(false)
    if (err) { setError(err.message) } else { setSaved(true); setTimeout(()=>setSaved(false),3000) }
  }

  const set = (k: string, v: string) => setTenant((t:any) => ({...t,[k]:v}))
  const inp = {background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px 12px',fontSize:'13px',color:'var(--text)',outline:'none',width:'100%',fontFamily:'DM Sans,sans-serif'} as React.CSSProperties
  const ta = {...inp,resize:'vertical' as const,fontFamily:'DM Sans,sans-serif'}

  return (
    <div className="animate-in">
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px'}}>Bot Settings</h1>
          <p style={{fontSize:'14px',color:'var(--text-muted)'}}>Configure your AI receptionist</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{background:'var(--gold)',color:'#0a0a0a',border:'none',borderRadius:'8px',padding:'11px 24px',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>
          {saving?'Saving...':saved?'✓ Saved':'Save Changes'}
        </button>
      </div>

      {error && <div style={{background:'rgba(224,85,85,0.1)',border:'1px solid rgba(224,85,85,0.3)',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#e05555',marginBottom:'20px'}}>{error}</div>}

      <div style={{display:'flex',gap:'4px',marginBottom:'20px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'10px',padding:'4px',width:'fit-content'}}>
        {(['config','services','policies'] as Tab[]).map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',borderRadius:'7px',fontSize:'13px',color:tab===t?'var(--gold-light)':'var(--text-muted)',background:tab===t?'var(--gold-dim)':'transparent',border:tab===t?'1px solid rgba(201,168,76,0.15)':'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontWeight:tab===t?500:400}}>
            {t==='config'?'Bot Config':t==='services'?'Service URLs':'Policies & Info'}
          </button>
        ))}
      </div>

      {tab==='config' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'16px'}}>Account Info</h3>
            {[['System ID',tenant?.tenant_id],['Loctician',tenant?.loctician_name],['Salon',tenant?.salon_name],['Account Status',tenant?.tenant_status,tenant?.tenant_status==='active'],['Member Level',tenant?.membership_type],['Subscription Plan',tenant?.monthly_fee]].map(([l,v,g])=>(
              <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:'13px',color:'var(--text-muted)'}}>{l as string}</span>
                <span style={{fontSize:'13px',fontWeight:500,color:g?'var(--green)':'var(--text-soft)',textAlign:'right',maxWidth:'60%',wordBreak:'break-all'}}>{(v as string)??'—'}</span>
              </div>
            ))}
          </div>

          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'16px'}}>Bot Phone Numbers</h3>
            <div style={{textAlign:'center',padding:'8px 0'}}>
              <div style={{fontSize:'28px',marginBottom:'10px'}}>📱</div>
              <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'8px'}}>Bot Number (Assigned)</p>
              <div style={{fontSize:'20px',fontWeight:700,color:'var(--gold)',fontFamily:'Syne,sans-serif',marginBottom:'8px'}}>{tenant?.bot_phone??tenant?.assigned_phone_number??'Pending Assignment'}</div>
              {tenant?.premium_number && <div style={{display:'inline-block',background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'20px',padding:'3px 10px',fontSize:'11px',color:'var(--gold)',marginBottom:'10px'}}>⭐ Premium Number (LOCS)</div>}
              <p style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:'1.6',marginBottom:'12px'}}>{tenant?.bot_phone?'Clients call this number to reach your AI receptionist.':'Your bot number will be assigned after setup is complete.'}</p>
              {[['Twilio Status',tenant?.twilio_status??(tenant?.twilio_configured?'Configured':'Pending'),tenant?.twilio_configured],['Bot Status',tenant?.bot_status??(tenant?.bot_active?'Active':'Pending'),tenant?.bot_active]].map(([l,v,g])=>(
                <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'1px solid var(--border)'}}>
                  <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{l as string}</span>
                  <span style={{fontSize:'12px',fontWeight:g?500:400,color:g?'var(--green)':'var(--text-muted)'}}>{v as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',gridColumn:'1 / -1'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'16px'}}>Bot Personality & Greeting</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
              <div>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Bot Greeting</label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'8px'}}>System prompt and voice greeting — how your AI opens calls</p>
                <textarea style={{...ta,height:'120px'}} value={tenant?.bot_greeting??''} onChange={e=>set('bot_greeting',e.target.value)} placeholder="e.g. Thank you for calling [Salon Name]! How can I help you today?" />
              </div>
              <div>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Handoff Phone Number</label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'8px'}}>Live number to forward to a human</p>
                <input style={inp} value={tenant?.handoff_phone??''} onChange={e=>set('handoff_phone',e.target.value)} placeholder="e.g. (313) 555-0000" />
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)',display:'block',marginBottom:'4px',marginTop:'16px'}}>Choose Bot Avatar</label>
<p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'12px'}}>Select your AI receptionist's personality</p>
<div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px'}}>
  {AVATARS.map(a=>(
    <div key={a.name} onClick={()=>set('avatar',a.name)} style={{cursor:'pointer',borderRadius:'10px',overflow:'hidden',border:tenant?.avatar===a.name?'2px solid var(--gold)':'2px solid transparent',opacity:tenant?.avatar&&tenant.avatar!==a.name?0.6:1,transition:'all 0.2s'}}>
      <img src={a.url} alt={a.name} style={{width:'100%',aspectRatio:'1',objectFit:'cover',display:'block'}} />
      <div style={{textAlign:'center',fontSize:'11px',fontWeight:500,color:tenant?.avatar===a.name?'var(--gold)':'var(--text-muted)',padding:'4px 0',background:'var(--surface2)'}}>{a.name}</div>
    </div>
  ))}
</div>
              </div>
            </div>
          </div>

          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',gridColumn:'1 / -1'}}>
            <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'8px'}}>Need Help?</h3>
            <p style={{fontSize:'14px',color:'var(--text-muted)',lineHeight:'1.7'}}>For bot configuration, service setup, or phone number issues contact LocSync support at <a href="mailto:hello@locsync.com" style={{color:'var(--gold)'}}>hello@locsync.com</a></p>
          </div>
        </div>
      )}

      {tab==='services' && (
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'8px'}}>Service Booking URLs</h3>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'20px'}}>Enter the direct booking link for each service. Leave blank if you don't offer it.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {SERVICE_URLS.map(s=>(
              <div key={s.key} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)'}}>{s.label}</label>
                <input style={inp} value={tenant?.[s.key]??''} onChange={e=>set(s.key,e.target.value)} placeholder="https://..." />
              </div>
            ))}
          </div>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',margin:'32px 0 8px'}}>Specialty Services</h3>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'20px'}}>Up to 5 custom services unique to your salon.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {[1,2,3,4,5].flatMap(n=>[
              <div key={`n${n}`} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)'}}>{n}{n===1?'st':n===2?'nd':n===3?'rd':'th'} Specialty Service Name</label>
                <input style={inp} value={tenant?.[`specialty_service_${n}_name`]??''} onChange={e=>set(`specialty_service_${n}_name`,e.target.value)} placeholder="e.g. Loc Detox Treatment" />
              </div>,
              <div key={`u${n}`} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)'}}>{n}{n===1?'st':n===2?'nd':n===3?'rd':'th'} Specialty Service Url</label>
                <input style={inp} value={tenant?.[`specialty_service_${n}_url`]??''} onChange={e=>set(`specialty_service_${n}_url`,e.target.value)} placeholder="https://..." />
              </div>
            ])}
          </div>
        </div>
      )}

      {tab==='policies' && (
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'8px'}}>Policies & Business Info</h3>
          <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'20px'}}>This info is used by your AI bot to answer client questions accurately.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {POLICIES.map(f=>(
              <div key={f.key} style={{display:'flex',flexDirection:'column',gap:'4px',...((f as any).big?{gridColumn:'1 / -1'}:{})}}>
                <label style={{fontSize:'12px',fontWeight:500,color:'var(--text-muted)'}}>{f.label}</label>
                <p style={{fontSize:'11px',color:'var(--text-muted)'}}>{f.hint}</p>
                {(f as any).big
                  ? <textarea style={{...ta,height:'80px'}} value={tenant?.[f.key]??''} onChange={e=>set(f.key,e.target.value)} placeholder={f.hint} />
                  : <input style={inp} value={tenant?.[f.key]??''} onChange={e=>set(f.key,e.target.value)} placeholder={f.hint} />
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
