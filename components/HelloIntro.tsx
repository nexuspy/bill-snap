"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function HelloIntro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = typeof window !== 'undefined' && localStorage.getItem('hasSeenIntro')
    if (!seen) {
      setShow(true)
      const t = setTimeout(() => {
        localStorage.setItem('hasSeenIntro', '1')
        setShow(false)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg width="420" height="160" viewBox="0 0 420 160">
            <path
              className="path-draw"
              d="M20,90 C60,10 120,140 160,80 C200,20 240,160 280,80 C320,0 360,120 400,60"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text x="50%" y="120" textAnchor="middle" fill="#ffffff88" style={{ fontFamily: 'ui-sans-serif, system-ui', fontWeight: 300, fontSize: 22 }}>Hello</text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
