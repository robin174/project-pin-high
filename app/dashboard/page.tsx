'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

type Club = {
  id: string
  type: string
  brand: string
  model: string
}

export default function DashboardPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [editBrand, setEditBrand] = useState('')
  const [editModel, setEditModel] = useState('')
  const [editClubId, setEditClubId] = useState<string | null>(null)

  const fetchClubs = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Not logged in.')
      setLoading(false)
      return
    }

    setUserEmail(user.email || '')

    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      setError('Failed to load clubs.')
    } else {
      setClubs(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  const handleDelete = async (clubId: string) => {
    const { error } = await supabase.from('clubs').delete().eq('id', clubId)
    if (error) {
      console.error('Delete error:', error)
    } else {
      setClubs((prev) => prev.filter((club) => club.id !== clubId))
    }
  }

  const handleSaveEdit = async () => {
    if (!editClubId) return

    const { error } = await supabase
      .from('clubs')
      .update({ brand: editBrand, model: editModel })
      .eq('id', editClubId)

    if (error) {
      console.error('Update failed:', error)
      return
    }

    setClubs((prev) =>
      prev.map((club) =>
        club.id === editClubId ? { ...club, brand: editBrand, model: editModel } : club
      )
    )

    setEditClubId(null)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Your Clubs</h1>
        {userEmail && <p className="text-sm text-center text-gray-600">Signed in as {userEmail}</p>}

        {loading && <p className="text-center">Loading clubs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && clubs.length === 0 && !error && (
          <p className="text-center text-gray-500">No clubs found. Add one!</p>
        )}

        {clubs.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="border-b p-2">Type</th>
                <th className="border-b p-2">Brand</th>
                <th className="border-b p-2">Model</th>
                <th className="border-b p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-gray-50">
                  <td className="border-b p-2">{club.type}</td>
                  <td className="border-b p-2">{club.brand}</td>
                  <td className="border-b p-2">{club.model}</td>
                  <td className="border-b p-2 text-right space-x-2">

                    {/* Edit Club Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditClubId(club.id)
                            setEditBrand(club.brand)
                            setEditModel(club.model)
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Club</DialogTitle>
                          <DialogDescription>Update brand or model.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Brand
                            </label>
                            <input
                              className="w-full border rounded-md px-3 py-2 text-sm"
                              value={editBrand}
                              onChange={(e) => setEditBrand(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Model
                            </label>
                            <input
                              className="w-full border rounded-md px-3 py-2 text-sm"
                              value={editModel}
                              onChange={(e) => setEditModel(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button onClick={handleSaveEdit}>Save</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Club Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this club?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The club will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                            onClick={() => handleDelete(club.id)}
                          >
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}