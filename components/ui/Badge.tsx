import { ReactNode } from 'react'

type Props = { children: ReactNode; color?: 'green' | 'amber' | 'slate'; className?: string }

export default function Badge({ children, color='slate', className }: Props) {
  const map = {
    green: 'bg-emerald-500/20 text-emerald-300',
    amber: 'bg-amber-500/20 text-amber-300',
    slate: 'bg-white/10 text-white/80',
  } as const
  return (
    <span className={["inline-block text-xs px-2 py-1 rounded-full", map[color], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
