// app/api/user/listings/count/route.ts - CORRIGÉ
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Récupérer l'email depuis les query params
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        count: 0, 
        error: 'Email requis' 
      }, { status: 400 })
    }
    
    // D'abord, trouver l'utilisateur
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
      select: { id: true, email: true, nom: true }
    })
    
    if (!utilisateur) {
      // Si l'utilisateur n'existe pas encore, il a 0 annonces
      return NextResponse.json({ 
        success: true, 
        count: 0,
        limit: 5,
        canPublish: true,
        remaining: 5
      })
    }
    
    // Compter les annonces de l'utilisateur
    const count = await prisma.bien.count({
      where: {
        proprietaireId: utilisateur.id
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      count,
      limit: 5,
      canPublish: count < 5,
      remaining: Math.max(0, 5 - count)
    })
    
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { 
        success: false,
        count: 0,
        error: 'Erreur lors de la vérification',
        canPublish: true // En cas d'erreur, on laisse publier
      },
      { status: 500 }
    )
  }
}