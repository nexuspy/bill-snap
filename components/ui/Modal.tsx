"use client"
import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  actions?: ReactNode
}

export default function Modal({ open, onClose, title, children, actions }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
            className="relative glass rounded-2xl p-6 w-full max-w-md">
            {title && <div className="text-lg font-semibold mb-2">{title}</div>}
            <div className="text-sm text-white/80">{children}</div>
            {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
