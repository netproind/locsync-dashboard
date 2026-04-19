import { NextResponse } from 'next/server'

export async function GET() {
  const MAKE_API_TOKEN = process.env.MAKE_API_TOKEN!
  const MAKE_TEAM_ID = process.env.MAKE_TEAM_ID || '1325397'

  try {
    const res = await fetch(
      `https://us2.make.com/api/v2/users/me/quota`,
      {
        headers: {
          'Authorization': `Token ${MAKE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.ok) throw new Error(`Make API error: ${res.status}`)
    const data = await res.json()

    return NextResponse.json({
      operations_used: data.quota?.operationsUsed ?? 0,
      operations_limit: data.quota?.operationsLimit ?? 10000,
    })
  } catch (err) {
    console.error('Make usage error:', err)
    return NextResponse.json({ error: 'Failed to fetch Make usage' }, { status: 500 })
  }
}
