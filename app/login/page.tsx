"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { setUserEmail } from '@/lib/local'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Offline auth: accept any email/password and store locally
    try {
      if (!email || !password) throw new Error('Email and password required')
      setUserEmail(email)
      router.replace('/dashboard')
    } catch (err:any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass w-full max-w-md rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-white/60 mb-6">Log in to manage your invoices.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full glass rounded-xl px-4 py-3 bg-white/5" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full glass rounded-xl px-4 py-3 bg-white/5" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <button disabled={loading} className="w-full gradient-btn rounded-xl px-4 py-3 font-medium">{loading? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div className="text-sm text-white/70 mt-6">No account? <Link href="/signup" className="underline hover:opacity-80">Sign up</Link></div>
      </motion.div>
    </div>
  )
}
