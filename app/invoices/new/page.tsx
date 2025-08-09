"use client"
import type React from 'react'
import { useEffect, useState } from 'react'
import { ServiceItem, calcTotals, uid, currency } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { getUserEmail, saveInvoice, getSettings } from '@/lib/local'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function NewInvoice() {
  const { push } = useToast()
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [services, setServices] = useState<ServiceItem[]>([{ name: '', qty: 1, price: 0 }])
  const [tax, setTax] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const r = useRouter()

  useEffect(() => {
    const e = getUserEmail()
    setEmail(e)
    if (!e) r.replace('/login')
    // Load defaults from settings
    const s = getSettings()
    setTax(s.defaultTax || 0)
    setDiscount(s.defaultDiscount || 0)
  }, [r])

  const totals = calcTotals(services, tax, discount)

  const addRow = ()=> setServices(s=>[...s, { name:'', qty:1, price:0 }])
  const updateRow = (i:number, k:keyof ServiceItem, v:any)=> setServices(s=> s.map((row,idx)=> idx===i? { ...row, [k]: k==='name'? v : Number(v) } : row))
  const delRow = (i:number)=> setServices(s=> s.filter((_,idx)=> idx!==i))

  const fillDemo = () => {
    setClientName('Acme Corp')
    setClientEmail('client@example.com')
    setServices([
      { name: 'Design sprint', qty: 1, price: 1200 },
      { name: 'Landing page implementation', qty: 1, price: 1800 },
      { name: 'QA & polish', qty: 1, price: 400 },
    ])
    setNotes('Thank you for your business! Payment due in 15 days.')
    push('Demo items added')
  }

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault()
    setSaving(true)
    try {
      if (!email) throw new Error('Not signed in')
      const id = uid(16)
      const public_id = uid(12)
      saveInvoice({
        id,
        user_email: email,
        client_name: clientName,
        client_email: clientEmail,
        services,
        tax,
        discount,
        notes,
        total_amount: totals.total,
        status: 'Pending',
        public_id,
        created_at: new Date().toISOString(),
      })
      r.replace(`/invoices/${id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Invoice</h1>
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="glass rounded-xl px-4 py-3 bg-white/5" placeholder="Client Name" value={clientName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setClientName(e.target.value)} required />
          <input type="email" className="glass rounded-xl px-4 py-3 bg-white/5" placeholder="Client Email" value={clientEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setClientEmail(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <div className="font-medium flex items-center justify-between">
            <span>Services</span>
            <Button variant="ghost" type="button" onClick={fillDemo}>Fill demo items</Button>
          </div>
          {services.map((row, i)=> (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input className="col-span-6 glass rounded-lg px-3 py-2 bg-white/5" placeholder="Description" value={row.name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>updateRow(i,'name',e.target.value)} />
              <input type="number" className="col-span-2 glass rounded-lg px-3 py-2 bg-white/5" placeholder="Qty" value={row.qty} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>updateRow(i,'qty',e.target.value)} />
              <input type="number" className="col-span-3 glass rounded-lg px-3 py-2 bg-white/5" placeholder="Price" value={row.price} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>updateRow(i,'price',e.target.value)} />
              <button type="button" onClick={()=>delRow(i)} className="col-span-1 text-sm glass rounded-lg px-3 py-2">✕</button>
            </div>
          ))}
          <button type="button" onClick={addRow} className="glass rounded-lg px-3 py-2 text-sm">+ Add service</button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <input type="number" className="glass rounded-lg px-3 py-2 bg-white/5" placeholder="Tax %" value={tax} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTax(Number(e.target.value))} />
          <input type="number" className="glass rounded-lg px-3 py-2 bg-white/5" placeholder="Discount %" value={discount} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setDiscount(Number(e.target.value))} />
          <div className="glass rounded-lg px-3 py-2 bg-white/5">Total: {currency(totals.total)}</div>
        </div>

        <textarea className="w-full glass rounded-xl px-4 py-3 bg-white/5" rows={4} placeholder="Notes" value={notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setNotes(e.target.value)} />

        <div className="flex justify-end">
          <button disabled={saving} className="gradient-btn rounded-xl px-5 py-3">{saving? 'Saving…' : 'Save Invoice'}</button>
        </div>
      </form>
    </div>
  )
}
