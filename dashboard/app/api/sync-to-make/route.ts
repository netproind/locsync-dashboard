import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log('sync-to-make called')
  const body = await req.json()
  
  await fetch('https://hook.us2.make.com/plojf12wui5wxzo04u9p75g5xvwynee7', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  return NextResponse.json({ ok: true })
}
