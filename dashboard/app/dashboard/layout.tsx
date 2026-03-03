import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Sidebar from './Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role ?? 'tenant'
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar userEmail={user.email ?? ''} role={role} />
      <main style={{ flex:1, marginLeft:'var(--sidebar-width)', padding:'40px', maxWidth:'calc(100vw - var(--sidebar-width))', overflowX:'hidden' }}>
        {children}
      </main>
    </div>
  )
}
