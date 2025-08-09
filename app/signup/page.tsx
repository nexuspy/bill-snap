"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { setUserEmail } from '@/lib/local'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!email || !password) throw new Error('Email and password required')
      setUserEmail(email)
      router.replace('/dashboard')
    } catch (err:any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass w-full max-w-md rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-sm text-white/60 mb-6">Sign up to start billing.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full glass rounded-xl px-4 py-3 bg-white/5" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full glass rounded-xl px-4 py-3 bg-white/5" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <button disabled={loading} className="w-full gradient-btn rounded-xl px-4 py-3 font-medium">{loading? 'Creating…' : 'Sign up'}</button>
        </form>
        <div className="text-sm text-white/70 mt-6">Have an account? <Link href="/login" className="underline hover:opacity-80">Log in</Link></div>
      </motion.div>
    </div>
  )
}
