"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { currency } from '@/lib/utils'
import { getInvoiceByPublicId } from '@/lib/local'

export default function PublicInvoice() {
  const params = useParams<{ public_id: string }>()
  const [loading, setLoading] = useState(true)
  const [inv, setInv] = useState<any | null>(null)

  useEffect(() => {
    const item = getInvoiceByPublicId(params.public_id)
    setInv(item ?? null)
    setLoading(false)
  }, [params.public_id])

  if (loading) return <div className="p-6">Loading…</div>
  if (!inv) return <div className="p-6">Not found</div>

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-2xl glass rounded-2xl p-8 space-y-4">
        <div className="text-sm text-white/60">Public Invoice</div>
        <div className="text-2xl font-semibold">{inv.client_name}</div>
        <div className="text-sm">{inv.client_email}</div>
        <div className="divide-y divide-white/5">
          {inv.services.map((s:any, idx:number)=> (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>{s.name} <span className="text-white/50">x{s.qty}</span></div>
              <div>${s.price}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end font-medium">Total: {currency(inv.total_amount)}</div>
        <div className={`${inv.status==='Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} inline-block text-xs px-2 py-1 rounded-full`}>{inv.status}</div>
      </div>
    </div>
  )
}
