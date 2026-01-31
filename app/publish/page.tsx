// app/publish/page.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PublishFlow } from '@/components/publish/PublishFlow'
import toast, { Toaster } from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function PublishPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handlePublishComplete = () => {
    toast.success('🎉 Votre annonce est publiée avec succès !', {
      duration: 3000,
      position: 'top-center',
    })

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  // Si ce n'est pas encore le client, affichez un chargement
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
        }}
      />

      {/* ÉTAPE DE PUBLICATION DIRECTE */}
      <PublishFlow onComplete={handlePublishComplete} />
    </>
  )
}