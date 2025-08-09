"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Button from './ui/Button'
import { signOut } from '@/lib/local'

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link href={{ pathname: href }} className={["px-3 py-2 rounded-lg hover:bg-white/10 transition", pathname===href? 'bg-white/10' : ''].join(' ')}>
      {label}
    </Link>
  )
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={{ pathname: '/dashboard' }} className="font-semibold text-lg">BillSnap</Link>
        <nav className="flex items-center gap-2">
          <Item href="/dashboard" label="Dashboard" />
          <Item href="/invoices/new" label="New" />
          <Item href="/settings" label="Settings" />
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={()=>{ signOut(); router.replace('/login') }}>Sign out</Button>
        </div>
      </div>
    </header>
  )
}
