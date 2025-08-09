export type ServiceItem = { name: string; qty: number; price: number }
export type Invoice = {
  id: string
  user_email: string
  client_name: string
  client_email: string
  services: ServiceItem[]
  tax: number
  discount: number
  notes?: string
  total_amount: number
  status: 'Paid' | 'Pending'
  public_id: string
  created_at: string
}
export type AppSettings = {
  currency: string // e.g. USD, EUR, INR
  currencySymbol: string // e.g. $, €, ₹
  defaultTax: number // percentage
  defaultDiscount: number // percentage
}

const USER_KEY = 'bs_user'
const INVOICES_KEY = 'bs_invoices'
const SETTINGS_KEY = 'bs_settings'

export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null')?.email ?? null } catch { return null }
}
export function setUserEmail(email: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify({ email }))
}
export function signOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

function readAll(): Invoice[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(INVOICES_KEY) || '[]') } catch { return [] }
}
function writeAll(list: Invoice[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(INVOICES_KEY, JSON.stringify(list))
}

export function listInvoices(email: string): Invoice[] {
  return readAll().filter(i => i.user_email === email)
}
export function getInvoiceById(id: string): Invoice | undefined {
  return readAll().find(i => i.id === id)
}
export function getInvoiceByPublicId(public_id: string): Invoice | undefined {
  return readAll().find(i => i.public_id === public_id)
}
export function saveInvoice(inv: Invoice) {
  const list = readAll()
  list.unshift(inv)
  writeAll(list)
}
export function updateInvoice(id: string, patch: Partial<Invoice>) {
  const list = readAll()
  const idx = list.findIndex(i => i.id === id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch }
    writeAll(list)
  }
}

export function deleteInvoice(id: string) {
  const list = readAll()
  const next = list.filter(i => i.id !== id)
  writeAll(next)
}

export function duplicateInvoice(id: string): Invoice | undefined {
  const list = readAll()
  const src = list.find(i => i.id === id)
  if (!src) return undefined
  const now = Date.now()
  const clone: Invoice = {
    ...src,
    id: `${src.id}-copy-${now}`,
    public_id: `${src.public_id}-copy-${now}`,
    status: 'Pending',
    created_at: new Date(now).toISOString(),
  }
  list.unshift(clone)
  writeAll(list)
  return clone
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  currencySymbol: '$',
  defaultTax: 0,
  defaultDiscount: 0,
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings
  try {
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {}) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(s: Partial<AppSettings>) {
  if (typeof window === 'undefined') return
  const merged = { ...getSettings(), ...s }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
}
