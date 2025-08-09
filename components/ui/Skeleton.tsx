import { motion } from 'framer-motion'

export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 0.3, 0.6] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className={[
        'rounded-md bg-white/10',
        className,
      ].join(' ')}
    />
  )
}
