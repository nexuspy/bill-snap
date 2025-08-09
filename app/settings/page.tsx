"use client"
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { getSettings, saveSettings, getUserEmail } from '@/lib/local'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

export default function SettingsPage() {
  const r = useRouter()
  const { push } = useToast()
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('USD')
  const [currencySymbol, setCurrencySymbol] = useState('$')
  const [defaultTax, setDefaultTax] = useState(0)
  const [defaultDiscount, setDefaultDiscount] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // simple auth guard
    const e = getUserEmail()
    if (!e) { r.replace('/login'); return }
    const s = getSettings()
    setCurrency(s.currency)
    setCurrencySymbol(s.currencySymbol)
    setDefaultTax(s.defaultTax)
    setDefaultDiscount(s.defaultDiscount)
    setLoading(false)
  }, [r])

  const currencyMap: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', AUD: '$', CAD: '$', SGD: '$', CNY: '¥'
  }

  const onCurrencyChange = (code: string) => {
    setCurrency(code)
    if (currencyMap[code]) setCurrencySymbol(currencyMap[code])
  }

  const onSave = () => {
    saveSettings({ currency, currencySymbol, defaultTax, defaultDiscount })
    setSaved(true)
    push('Settings saved')
    setTimeout(()=>setSaved(false), 1500)
  }

  if (loading) return <div className="py-8">Loading…</div>

  return (
    <div className="py-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-white/60 mb-1">Currency</div>
            <select className="w-full glass rounded-lg px-3 py-2 bg-white/5" value={currency} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>onCurrencyChange(e.target.value)}>
              {Object.keys(currencyMap).map((code)=> (
                <option className="bg-[#0b1220]" key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">Currency Symbol</div>
            <input className="w-full glass rounded-lg px-3 py-2 bg-white/5" value={currencySymbol} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setCurrencySymbol(e.target.value)} placeholder="$" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-white/60 mb-1">Default Tax %</div>
            <input type="number" className="w-full glass rounded-lg px-3 py-2 bg-white/5" value={defaultTax} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setDefaultTax(Number(e.target.value))} />
          </div>
          <div>
            <div className="text-sm text-white/60 mb-1">Default Discount %</div>
            <input type="number" className="w-full glass rounded-lg px-3 py-2 bg-white/5" value={defaultDiscount} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setDefaultDiscount(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end">
          {saved && <span className="text-sm text-emerald-300">Saved!</span>}
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}
