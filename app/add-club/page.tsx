'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog'

const CLUB_TYPES = ['Driver', 'Putter', 'Iron', 'Wedge', 'Hybrid', 'Fairway Wood']
const BRANDS = ['Ping', 'Titleist', 'Callaway', 'TaylorMade', 'Cobra', 'Other']

export default function AddClubPage() {
  const [type, setType] = useState('')
  const [brand, setBrand] = useState('')
  const [customBrand, setCustomBrand] = useState("");
  const [model, setModel] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage('You must be logged in.')
      return
    }

    // Use customBrand if brand is "Other"
    const brandToSave = brand === "Other" ? customBrand : brand

    const { error } = await supabase.from('clubs').insert([
      {
        type,
        brand: brandToSave,
        model,
        user_id: user.id,
      },
    ])

    if (error) {
      setMessage('Error adding club')
    } else {
      setMessage('Club added successfully ✅')
      setType('')
      setBrand('')
      setCustomBrand("") // clear custom field if it was used
      setModel('')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-xl font-bold text-center">Add a Golf Club</h1>

        <div className="space-y-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Club Type</option>
            {CLUB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Brand</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {brand === "Other" && (
            <div>
              <Input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="Enter brand name"
                required
              />
            </div>
          )}

          <Input
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleSubmit}>
            Add Club
          </Button>
        </div>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </div>
    </main>
  )
}