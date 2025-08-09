import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const revenue = data?.filter(i=>i.status==='Paid').reduce((s,i)=> s + Number(i.total_amount||0), 0) || 0
  const pending = data?.filter(i=>i.status!=='Paid').reduce((s,i)=> s + Number(i.total_amount||0), 0) || 0
  return NextResponse.json({ invoices: data, summary: { revenue, pending } })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const payload = { ...body, user_id: user.id }
  const { data, error } = await supabase.from('invoices').insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
