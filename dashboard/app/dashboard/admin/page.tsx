import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id ?? '').single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: tenants } = await supabase
    .from('tenants')
    .select('tenant_id, loctician_name, salon_name, email, tenant_status, membership_type, trial_end_date, bot_active, created_at, city, state, monthly_fee, assigned_phone_number, bot_phone')
    .order('created_at', { ascending: false })

  const today = new Date()

  return (
    <div className="animate-in">
      <div style={s.header}>
        <div>
          <h1 style={s.title}>All Tenants</h1>
          <p style={s.sub}>{tenants?.length ?? 0} locticians on LocSync</p>
        </div>
        <div style={s.adminBadge}>⭐ Admin View</div>
      </div>

      <div style={s.statsRow}>
        <MiniStat label="Total Tenants" value={String(tenants?.length ?? 0)} />
        <MiniStat label="Active" value={String(tenants?.filter(t => t.tenant_status === 'active').length ?? 0)} good />
        <MiniStat label="On Trial" value={String(tenants?.filter(t => t.tenant_status === 'trial' || !t.tenant_status).length ?? 0)} />
        <MiniStat label="Bot Active" value={String(tenants?.filter(t => t.bot_active).length ?? 0)} good />
      </div>

      <div style={s.panel}>
        <div style={s.tableHead}>
          <span>Loctician / Salon</span>
          <span>Email</span>
          <span>Location</span>
          <span>Status</span>
          <span>Plan</span>
          <span>Bot</span>
          <span>Trial Ends</span>
        </div>
        {tenants?.map(t => {
          const trialEnd = t.trial_end_date ? new Date(t.trial_end_date) : null
          const daysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null
          const isActive = t.tenant_status === 'active'
          return (
            <div key={t.tenant_id} style={s.tableRow}>
              <div>
                <div style={s.tenantName}>{t.loctician_name ?? '—'}</div>
                <div style={s.tenantSalon}>{t.salon_name ?? '—'}</div>
                <div style={s.tenantId}>{t.tenant_id}</div>
              </div>
              <div style={s.cell}>{t.email}</div>
              <div style={s.cell}>{t.city && t.state ? `${t.city}, ${t.state}` : '—'}</div>
              <div>
                <span style={isActive ? s.statusActive : s.statusTrial}>
                  {t.tenant_status ?? 'trial'}
                </span>
              </div>
              <div style={s.cell}>{t.membership_type ?? '—'}{t.monthly_fee ? ` · $${t.monthly_fee}` : ''}</div>
              <div>
                <span style={t.bot_active ? s.dotGood : s.dotPend}>
                  {t.bot_active ? '● Active' : '○ Pending'}
                </span>
              </div>
              <div style={s.cell}>
                {daysLeft !== null
                  ? <span style={daysLeft <= 2 ? {color:'#e05555',fontWeight:600} : {}}>{daysLeft}d left</span>
                  : '—'
                }
              </div>
            </div>
          )
        })}
        {(!tenants || tenants.length === 0) && (
          <div style={s.empty}>No tenants yet</div>
        )}
      </div>
    </div>
  )
}

function MiniStat({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div style={ms.card}>
      <div style={good ? {...ms.val, color:'var(--green)'} : ms.val}>{value}</div>
      <div style={ms.label}>{label}</div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  header: {display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'24px',flexWrap:'wrap',gap:'16px'},
  title: {fontSize:'26px',fontWeight:700,color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px'},
  sub: {fontSize:'14px',color:'var(--text-muted)'},
  adminBadge: {display:'flex',alignItems:'center',gap:'6px',background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'8px',padding:'8px 16px',fontSize:'13px',color:'var(--gold)',fontWeight:600},
  statsRow: {display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'},
  panel: {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'12px',overflow:'hidden'},
  tableHead: {display:'grid',gridTemplateColumns:'2fr 2fr 1.5fr 1fr 1.5fr 1fr 1fr',padding:'12px 20px',borderBottom:'1px solid var(--border)',fontSize:'11px',color:'var(--text-muted)',letterSpacing:'0.05em',textTransform:'uppercase' as const,fontWeight:500},
  tableRow: {display:'grid',gridTemplateColumns:'2fr 2fr 1.5fr 1fr 1.5fr 1fr 1fr',padding:'14px 20px',borderBottom:'1px solid var(--border)',alignItems:'center'},
  tenantName: {fontSize:'13px',fontWeight:600,color:'var(--text-soft)',marginBottom:'2px'},
  tenantSalon: {fontSize:'12px',color:'var(--text-muted)'},
  tenantId: {fontSize:'10px',color:'var(--text-muted)',marginTop:'2px'},
  cell: {fontSize:'12px',color:'var(--text-muted)',wordBreak:'break-all'},
  statusActive: {fontSize:'11px',background:'rgba(76,175,125,0.1)',border:'1px solid rgba(76,175,125,0.2)',borderRadius:'20px',padding:'3px 8px',color:'var(--green)',fontWeight:500},
  statusTrial: {fontSize:'11px',background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'20px',padding:'3px 8px',color:'var(--gold)',fontWeight:500},
  dotGood: {fontSize:'12px',color:'var(--green)',fontWeight:500},
  dotPend: {fontSize:'12px',color:'var(--text-muted)'},
  empty: {padding:'40px',textAlign:'center' as const,fontSize:'14px',color:'var(--text-muted)'},
}

const ms: Record<string, React.CSSProperties> = {
  card: {background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'10px',padding:'16px 20px'},
  val: {fontSize:'28px',fontWeight:800,color:'var(--text)',fontFamily:'Syne,sans-serif',letterSpacing:'-0.03em',marginBottom:'4px'},
  label: {fontSize:'12px',color:'var(--text-muted)'},
}
