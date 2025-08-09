"use client"
import type React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getUserEmail, listInvoices, updateInvoice, signOut, duplicateInvoice, deleteInvoice } from '@/lib/local'
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { currency } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export default function Dashboard() {
  const router = useRouter()
  const { push } = useToast()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const e = getUserEmail()
    setEmail(e)
    if (!e) {
      router.replace('/login')
      return
    }
    setItems(listInvoices(e))
  }, [router])

  const filtered = useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter((i) =>
      i.client_name?.toLowerCase().includes(q) || i.client_email?.toLowerCase().includes(q)
    )
  }, [items, query])

  const summary = useMemo(() => {
    const revenue = items.filter(i=>i.status==='Paid').reduce((a,b)=>a + (b.total_amount||0),0)
    const pending = items.filter(i=>i.status!=='Paid').reduce((a,b)=>a + (b.total_amount||0),0)
    return { revenue, pending, count: items.length }
  }, [items])

  const toggleStatus = async (id: string, status: 'Paid' | 'Pending') => {
    updateInvoice(id, { status })
    if (email) setItems(listInvoices(email))
    push(`Marked as ${status}`)
  }

  const onDuplicate = (id: string) => {
    const clone = duplicateInvoice(id)
    if (email) setItems(listInvoices(email))
    if (clone) push('Invoice duplicated')
    return clone
  }
  const [delId, setDelId] = useState<string | null>(null)
  const confirmDelete = () => {
    if (delId) {
      deleteInvoice(delId)
      if (email) setItems(listInvoices(email))
      setDelId(null)
      push('Invoice deleted')
    }
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="ghost" onClick={() => { signOut(); router.replace('/login') }}>Sign out</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 rounded-xl">
          <div className="text-white/60 text-sm">Total Revenue</div>
          <div className="text-2xl mt-1">{currency(summary.revenue)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 rounded-xl">
          <div className="text-white/60 text-sm">Pending</div>
          <div className="text-2xl mt-1">{currency(summary.pending)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass p-5 rounded-xl">
          <div className="text-white/60 text-sm">Invoices</div>
          <div className="text-2xl mt-1">{summary.count}</div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between">
        <input placeholder="Search invoices..." className="w-full md:w-80 px-3 py-2 rounded-lg bg-white/10 outline-none"
          value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setQuery(e.target.value)} />
        <Link href={{ pathname: '/invoices/new' }} className="ml-4 gradient-btn px-4 py-2 rounded-lg">New Invoice</Link>
      </div>

      <div className="glass rounded-xl divide-y divide-white/5">
        {filtered.map((inv: any) => (
          <div key={inv.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{inv.client_name}</div>
              <div className="text-xs text-white/60">{inv.client_email}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge color={inv.status==='Paid' ? 'green' : 'amber'}>{inv.status}</Badge>
              <div className="w-28 text-right">{currency(inv.total_amount)}</div>
              <Button variant="ghost" onClick={() => toggleStatus(inv.id, inv.status==='Paid'?'Pending':'Paid')}>Toggle</Button>
              <Button variant="ghost" onClick={() => onDuplicate(inv.id)}>Duplicate</Button>
              <Button variant="ghost" onClick={() => setDelId(inv.id)}>Delete</Button>
              <Link href={{ pathname: `/invoices/${inv.id}` }} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15">View</Link>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Delete invoice" actions={
        <>
          <Button variant="ghost" onClick={()=>setDelId(null)}>Cancel</Button>
          <Button onClick={confirmDelete}>Delete</Button>
        </>
      }>
        Are you sure you want to delete this invoice? This action cannot be undone.
      </Modal>
    </div>
  )
}
