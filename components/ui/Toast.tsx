"use client"
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type ToastItem = { id: number; message: string }

type ToastCtx = {
  push: (message: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setItems((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 2000)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div key={t.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="glass rounded-lg px-4 py-2 text-sm">
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
