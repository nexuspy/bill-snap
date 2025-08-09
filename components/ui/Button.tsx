"use client"
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  className?: string
}

export default function Button({ children, onClick, type='button', variant='primary', disabled, className }: Props) {
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = variant === 'primary'
    ? 'gradient-btn'
    : 'bg-white/10 hover:bg-white/15'
  return (
    <motion.button whileTap={{ scale: 0.98 }} type={type} onClick={onClick} disabled={disabled}
      className={[base, styles, className].filter(Boolean).join(' ')}>
      {children}
    </motion.button>
  )
}
