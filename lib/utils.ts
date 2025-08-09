export type ServiceItem = { name: string; qty: number; price: number }

export function calcTotals(services: ServiceItem[], taxPct: number, discountPct: number) {
  const subtotal = services.reduce((s, i) => s + i.qty * i.price, 0)
  const tax = subtotal * (taxPct / 100)
  const discount = subtotal * (discountPct / 100)
  const total = Math.max(0, subtotal + tax - discount)
  return { subtotal, tax, discount, total }
}

export function currency(n: number) {
  // Lazy import to avoid SSR issues; falls back to USD
  let code = 'USD'
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('bs_settings')
      const s = raw ? JSON.parse(raw) : null
      code = s?.currency || 'USD'
    }
  } catch {}
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(n || 0)
}

export function uid(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length)
}
