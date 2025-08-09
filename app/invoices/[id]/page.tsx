"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { currency } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import { getInvoiceById, updateInvoice, deleteInvoice, duplicateInvoice } from '@/lib/local'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function InvoiceDetail() {
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [inv, setInv] = useState<any | null>(null)
  const { push } = useToast()

  useEffect(() => {
    const item = getInvoiceById(params.id)
    setInv(item ?? null)
    setLoading(false)
  }, [params.id])

  const downloadPDF = () => {
    if (!inv) return
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Invoice', 20, 20)
    doc.setFontSize(12)
    doc.text(`Client: ${inv.client_name}`, 20, 32)
    doc.text(`Email: ${inv.client_email}`, 20, 40)
    let y = 54
    inv.services.forEach((s:any)=>{
      doc.text(`${s.name}  x${s.qty}  $${s.price}`, 20, y)
      y += 8
    })
    doc.text(`Total: ${currency(inv.total_amount)}`, 20, y + 6)
    doc.save(`invoice-${inv.id}.pdf`)
  }

  if (loading) return <div className="p-6">Loading…</div>
  if (!inv) return <div className="p-6">Not found</div>

  const [delOpen, setDelOpen] = useState(false)
  const onDelete = () => {
    deleteInvoice(inv.id)
    push('Invoice deleted')
    history.back()
  }
  const onDuplicate = () => {
    const clone = duplicateInvoice(inv.id)
    if (clone) {
      push('Invoice duplicated')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoice</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onDuplicate}>Duplicate</Button>
          <Button variant="ghost" onClick={()=> setDelOpen(true)}>Delete</Button>
          <Button variant="ghost" onClick={downloadPDF}>Download PDF</Button>
          <Button variant="ghost"
            onClick={async()=>{ await navigator.clipboard.writeText(`${location.origin}/p/${inv.public_id}`); push('Link copied'); }}
          >Copy Public Link</Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-2">
        <div className="text-white/60 text-sm">Client</div>
        <div className="font-medium">{inv.client_name}</div>
        <div className="text-sm">{inv.client_email}</div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 font-medium">Items</div>
        <div className="divide-y divide-white/5">
          {inv.services.map((s:any, idx:number)=> (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <div>{s.name}</div>
                <div className="text-xs text-white/60">Qty: {s.qty}</div>
              </div>
              <div>{currency(s.price)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 flex justify-end gap-6 text-sm">
          <div>Tax: {inv.tax}%</div>
          <div>Discount: {inv.discount}%</div>
          <div className="font-medium">Total: {currency(inv.total_amount)}</div>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <Link href={{ pathname: `/p/${inv.public_id}` }} className="underline">View Public Page</Link>
        <Button variant="ghost" onClick={()=>{
          const next = inv.status==='Paid'?'Pending':'Paid'
          updateInvoice(inv.id, { status: next })
          setInv({ ...inv, status: next })
          push(`Marked as ${next}`)
        }}>Mark as {inv.status==='Paid'?'Pending':'Paid'}</Button>
        <Badge color={inv.status==='Paid' ? 'green' : 'amber'}>{inv.status}</Badge>
      </div>

      <Modal open={delOpen} onClose={()=>setDelOpen(false)} title="Delete invoice" actions={
        <>
          <Button variant="ghost" onClick={()=>setDelOpen(false)}>Cancel</Button>
          <Button onClick={onDelete}>Delete</Button>
        </>
      }>
        Are you sure you want to delete this invoice? This action cannot be undone.
      </Modal>
    </div>
  )
}
