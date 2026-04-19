import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

  try {
    // Fetch voice calls
    const callsRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json?StartTime>=${startDate}&StartTime<=${endDate}&PageSize=1000`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    )
    const callsData = await callsRes.json()
    const calls = callsData.calls ?? []
    const voiceCalls = calls.length
    const voiceMinutes = calls.reduce((sum: number, c: any) => sum + (parseInt(c.duration) || 0), 0) / 60

    // Fetch SMS
    const smsRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json?DateSent>=${startDate}&DateSent<=${endDate}&PageSize=1000`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    )
    const smsData = await smsRes.json()
    const smsCount = smsData.messages?.length ?? 0

    // Estimate cost (Twilio pricing approximation)
    const voiceCost = voiceMinutes * 0.0085
    const smsCost = smsCount * 0.0079
    const totalCost = voiceCost + smsCost

    return NextResponse.json({
      voice_calls: voiceCalls,
      voice_minutes: Math.round(voiceMinutes),
      sms_count: smsCount,
      total_cost: totalCost.toFixed(2)
    })
  } catch (err) {
    console.error('Twilio usage error:', err)
    return NextResponse.json({ error: 'Failed to fetch Twilio usage' }, { status: 500 })
  }
}
