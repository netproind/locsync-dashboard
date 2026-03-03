export default function AppointmentsPage() {
  return (
    <div className="animate-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Appointments</h1>
          <p style={styles.sub}>Bookings captured by your AI receptionist</p>
        </div>
      </div>

      <div style={styles.filterBar}>
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
          <button key={f} style={f === 'All' ? { ...styles.filterBtn, ...styles.filterBtnActive } : styles.filterBtn}>
            {f}
          </button>
        ))}
      </div>

      <div style={styles.panel}>
        <div style={styles.tableHead}>
          <span>Client</span>
          <span>Service</span>
          <span>Date & Time</span>
          <span>Status</span>
        </div>
        <div style={styles.emptyState}>
          <span style={{ fontSize: '32px' }}>📅</span>
          <p style={styles.emptyTitle}>No appointments yet</p>
          <p style={styles.emptyText}>When your AI receptionist books clients, they'll appear here.</p>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  sub: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  filterBtnActive: {
    background: 'var(--gold-dim)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: 'var(--gold-light)',
  },
  panel: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 2fr 1fr',
    padding: '14px 24px',
    borderBottom: '1px solid var(--border)',
    fontSize: '12px',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-soft)',
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
}
