'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        router.push('/dashboard')
      }
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage('Error sending magic link')
    } else {
      setMessage('Check your email for the magic link')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm space-y-6 p-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-semibold text-center">Login / Signup</h1>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleLogin}>
            Send Magic Link
          </Button>
        </div>

        {message && (
          <p className="text-sm text-center text-green-600">{message}</p>
        )}
      </div>
    </main>
  )
}