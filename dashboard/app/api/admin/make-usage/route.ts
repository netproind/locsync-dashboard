import { NextResponse } from 'next/server'

export async function GET() {
  const MAKE_API_TOKEN = process.env.MAKE_API_TOKEN!
  const MAKE_TEAM_ID = process.env.MAKE_TEAM_ID || '1325397'

  try {
    const res = await fetch(
      `https://us2.make.com/api/v2/scenarios/consumptions?teamId=${MAKE_TEAM_ID}`,
      {
        headers: {
          'Authorization': `Token ${MAKE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Make API error:', res.status, text)
      throw new Error(`Make API error: ${res.status}`)
    }

    const data = await res.json()
    const consumptions = data.scenarioConsumptions ?? []
    const totalOps = consumptions.reduce((sum: number, s: any) => sum + (s.operations ?? 0), 0)

    return NextResponse.json({
      operations_used: totalOps,
      operations_limit: 10000,
      last_reset: data.lastReset ?? null
    })
  } catch (err) {
    console.error('Make usage error:', err)
    return NextResponse.json({ error: 'Failed to fetch Make usage' }, { status: 500 })
  }
}
