import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ADMINS = ['unathair@gmail.com', 'locsyncbot@gmail.com']
  if (!ADMINS.includes(user.email ?? '')) redirect('/dashboard')

  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })

  const total = tenants?.length ?? 0
  const active = tenants?.filter(t => t.tenant_status === 'active').length ?? 0
  const onTrial = tenants?.filter(t => t.tenant_status === 'trial' || t.is_trial).length ?? 0
  const botActive = tenants?.filter(t => t.bot_active).length ?? 0

  return (
    <div className="animate-in">
      <div style={{marginBottom:'28px',display:'flex',alignItems:'center',gap:'12px'}}>
        <h1 style={{fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em'}}>All Tenants</h1>
        <div style={{background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'20px',padding:'4px 12px',fontSize:'12px',color:'var(--gold)',fontWeight:500}}>⭐ Admin View</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {[['Total Tenants',total,'👥'],['Active',active,'✅'],['On Trial',onTrial,'⏳'],['Bot Active',botActive,'🤖']].map(([label,value,icon])=>(
          <div key={label as string} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px',textAlign:'center'}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{icon as string}</div>
            <div style={{fontSize:'28px',fontWeight:700,color:'var(--gold)',fontFamily:'Syne,sans-serif'}}>{value as number}</div>
            <div style={{fontSize:'13px',color:'var(--text-muted)',marginTop:'4px'}}>{label as string}</div>
          </div>
        ))}
      </div>

      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 1fr 1fr',padding:'12px 20px',borderBottom:'1px solid var(--border)',fontSize:'11px',color:'var(--text-muted)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>
          <span>Loctician / Salon</span><span>Email</span><span>Location</span><span>Status</span><span>Plan</span><span>Bot</span><span>Trial</span>
        </div>
        {tenants?.map(t => {
          const trialEnd = t.trial_expires_at ? new Date(t.trial_expires_at) : null
          const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000*60*60*24))) : null
          return (
            <div key={t.id} style={{display:'grid',gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr 1fr 1fr',padding:'14px 20px',borderBottom:'1px solid var(--border)',fontSize:'13px',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:500,color:'var(--text)'}}>{t.loctician_name??'—'}</div>
                <div style={{fontSize:'12px',color:'var(--text-muted)'}}>{t.salon_name??'—'}</div>
              </div>
              <div style={{color:'var(--text-muted)',fontSize:'12px',wordBreak:'break-all'}}>{t.email??'—'}</div>
              <div style={{color:'var(--text-muted)',fontSize:'12px'}}>{t.city??'—'}{t.state?`, ${t.state}`:''}</div>
              <div><span style={{background:t.tenant_status==='active'?'rgba(76,175,125,0.1)':'var(--gold-dim)',color:t.tenant_status==='active'?'var(--green)':'var(--gold)',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:500}}>{t.tenant_status??'trial'}</span></div>
              <div style={{color:'var(--text-muted)',fontSize:'12px'}}>{t.membership_type??'—'}</div>
              <div style={{color:t.bot_active?'var(--green)':'var(--text-muted)',fontSize:'12px'}}>{t.bot_active?'● Active':'○ Pending'}</div>
              <div style={{color:daysLeft!==null&&daysLeft<=2?'#e05555':'var(--text-muted)',fontSize:'12px'}}>{daysLeft!==null?`${daysLeft}d`:'—'}</div>
            </div>
          )
        })}
        {(!tenants || tenants.length === 0) && (
          <div style={{padding:'40px',textAlign:'center',color:'var(--text-muted)'}}>No tenants yet</div>
        )}
      </div>
    </div>
  )
}
