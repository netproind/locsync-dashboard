import { createClient } from '@/utils/supabase/server'

export const revalidate = 0
export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('loctician_name, salon_name, tenant_id, tenant_status, membership_type, monthly_fee, payment_status, payment_date, last_payment_date, next_billing_date, trial_started_at, trial_expires_at, assigned_phone_number, bot_phone, premium_number, created_at')
    .eq('email', user?.email ?? '')
    .maybeSingle()

  const trialEnd = tenant?.trial_end_date ? new Date(tenant.trial_end_date) : null
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000*60*60*24))) : 7
  const trialPercent = Math.round(((7 - daysLeft) / 7) * 100)
  const isTrial = !tenant?.tenant_status || 
  tenant.tenant_status.toLowerCase().includes('trial')
  const memberSince = tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : '—'

  return (
    <div className="animate-in">
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px'}}>Billing</h1>
        <p style={{fontSize:'14px',color:'var(--text-muted)'}}>Manage your subscription and payment method</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'20px'}}>Account Status</h3>
          {isTrial ? (
            <div style={{textAlign:'center'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'20px',padding:'6px 14px',fontSize:'12px',color:'var(--gold-light)',marginBottom:'16px'}}>
                <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--gold)'}} /> Free Trial
              </div>
              <div style={{fontSize:'60px',fontWeight:800,color:'var(--text)',fontFamily:'Syne,sans-serif',letterSpacing:'-0.04em',lineHeight:'1'}}>{daysLeft}</div>
              <p style={{fontSize:'14px',color:'var(--text-muted)',marginBottom:'16px'}}>days remaining</p>
              <div style={{height:'4px',background:'var(--surface2)',borderRadius:'2px',marginBottom:'16px'}}>
                <div style={{height:'100%',background:'var(--gold)',borderRadius:'2px',width:`${trialPercent}%`}} />
              </div>
              <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:'1.6',marginBottom:'20px'}}>Your 7-day free trial includes all Basic features. Upgrade before it expires to keep your AI receptionist active.</p>
              <a href="https://www.locsync.com/#pricing" target="_blank" style={{display:'inline-block',background:'var(--gold)',color:'#0a0a0a',borderRadius:'8px',padding:'11px 24px',fontSize:'14px',fontWeight:600,fontFamily:'Syne,sans-serif',textDecoration:'none'}}>View Plans & Upgrade →</a>
            </div>
          ) : (
            <div>
              <div style={{display:'inline-block',background:'rgba(76,175,125,0.1)',border:'1px solid rgba(76,175,125,0.2)',borderRadius:'8px',padding:'8px 16px',fontSize:'14px',fontWeight:600,color:'var(--green)',marginBottom:'20px'}}>Active — {tenant?.membership_type}</div>
              {[
                ['Plan', tenant?.membership_type??'—'],
                ['Monthly Fee', tenant?.monthly_fee?`$${tenant.monthly_fee}`:'—'],
                ['Next Billing', tenant?.next_billing_date?new Date(tenant.next_billing_date).toLocaleDateString():'—'],
                ['Last Payment', tenant?.last_payment_date?new Date(tenant.last_payment_date).toLocaleDateString():'—'],
                ['Payment Status', tenant?.payment_status??'—'],
              ].map(([label,value])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{label}</span>
                  <span style={{fontSize:'12px',fontWeight:500,color:'var(--text-soft)'}}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'20px'}}>Subscription Info</h3>
          {[
            ['System ID', tenant?.tenant_id??'—'],
            ['Loctician', tenant?.loctician_name??'—'],
            ['Salon', tenant?.salon_name??'—'],
            ['Member Since', memberSince],
            ['Member Level', tenant?.membership_type??'—'],
            ['Bot Number', tenant?.bot_phone??tenant?.assigned_phone_number??'Pending'],
            ['Number Type', tenant?.premium_number?'Premium (LOCS)':'Standard'],
            ['Account Status', tenant?.tenant_status??'Trial'],
          ].map(([label,value])=>(
            <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:'12px',color:'var(--text-muted)'}}>{label}</span>
              <span style={{fontSize:'12px',fontWeight:500,color:'var(--text-soft)',textAlign:'right',maxWidth:'55%',wordBreak:'break-all'}}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'24px',gridColumn:'1 / -1'}}>
          <h3 style={{fontSize:'15px',fontWeight:600,color:'var(--text)',marginBottom:'20px'}}>Billing History</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr 1fr',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:'11px',color:'var(--text-muted)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500,marginBottom:'4px'}}>
            <span>Date</span><span>Description</span><span>Amount</span><span>Status</span>
          </div>
          {tenant?.payment_date ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr 1fr',padding:'12px 0',fontSize:'13px',color:'var(--text-soft)'}}>
              <span>{new Date(tenant.payment_date).toLocaleDateString()}</span>
              <span>{tenant.membership_type??'Subscription'}</span>
              <span>{tenant.monthly_fee?`$${tenant.monthly_fee}`:'—'}</span>
              <span style={{color:'var(--green)'}}>{tenant.payment_status??'Paid'}</span>
            </div>
          ) : (
            <div style={{padding:'40px 0',textAlign:'center'}}>
              <p style={{fontSize:'14px',color:'var(--text-muted)'}}>No billing history yet</p>
            </div>
          )}
          <div style={{paddingTop:'16px',textAlign:'right'}}>
            <a href="https://www.locsync.com/#pricing" target="_blank" style={{fontSize:'13px',color:'var(--gold)',fontWeight:500}}>View pricing options →</a>
          </div>
        </div>
      </div>
    </div>
  )
}
