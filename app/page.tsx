"use client"
import { useEffect, useState } from 'react'
import HelloIntro from '@/components/HelloIntro'
import { useRouter } from 'next/navigation'
import { getUserEmail } from '@/lib/local'

export default function Home() {
  const [introDone, setIntroDone] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (hasSeenIntro === null) {
      const seen = typeof window !== 'undefined' && !!localStorage.getItem('hasSeenIntro')
      setHasSeenIntro(seen)
      if (seen) {
        const loggedIn = !!getUserEmail()
        router.replace(loggedIn ? '/dashboard' : '/login')
      }
      return
    }
    if (!hasSeenIntro && !introDone) return
    const loggedIn = !!getUserEmail()
    router.replace(loggedIn ? '/dashboard' : '/login')
  }, [router, hasSeenIntro, introDone])

  return (
    <>
      <HelloIntro onDone={() => setIntroDone(true)} />
      {hasSeenIntro === false && !introDone && (
        <div className="h-screen w-full flex items-center justify-center">
          <div className="glass rounded-2xl p-6">Loading BillSnap…</div>
        </div>
      )}
    </>
  )
}
