import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(_: NextRequest) {
  // Offline mode: no auth checks
  return NextResponse.next()
}

export const config = {
  matcher: [] as string[]
}
