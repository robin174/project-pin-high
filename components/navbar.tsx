'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setLoggedIn(!!session?.user)
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 mb-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="space-x-4">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            Dashboard
          </Link>
          <Link href="/add-club" className="text-sm font-medium text-blue-600 hover:underline">
            Add Club
          </Link>
        </div>

        {loggedIn && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-500"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  )
}