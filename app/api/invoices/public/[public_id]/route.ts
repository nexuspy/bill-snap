import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabaseServer'

export async function GET(_: Request, { params }: { params: { public_id: string } }) {
  const supabase = createSupabaseServer()
  const { data, error } = await supabase.from('invoices').select('*').eq('public_id', params.public_id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ invoice: data })
}
