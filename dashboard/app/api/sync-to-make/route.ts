import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  
  await fetch('https://hook.us2.make.com/g3ye50nir54f1ps7cf7xh7ifpor32lys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  return NextResponse.json({ ok: true })
}
