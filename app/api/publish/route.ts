// app/api/publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('📥 Données reçues pour publication:')
    console.log(JSON.stringify(data, null, 2))

    // Validation basique
    if (!data.onboarding?.email || !data.onboarding?.nom) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Informations propriétaire manquantes',
          message: 'Veuillez fournir votre nom et email' 
        },
        { status: 400 }
      )
    }

    // 1. Vérifier/Créer l'utilisateur (propriétaire)
    const utilisateur = await prisma.utilisateur.upsert({
      where: { email: data.onboarding.email },
      update: {
        nom: data.onboarding.nom,
        telephone: data.onboarding.telephone || ''
      },
      create: {
        email: data.onboarding.email,
        nom: data.onboarding.nom,
        telephone: data.onboarding.telephone || ''
      }
    })

    console.log('✅ Utilisateur traité - ID:', utilisateur.id)

    // 2. Préparer les données pour le bien - TOUTES LES DONNÉES
    const bienData: any = {
      // === HousingTypeStep ===
      category: data.housingType?.category || 'HOUSE',
      subType: data.housingType?.subType || '',
      privacy: data.housingType?.privacy || 'ENTIRE',
      
      // === LocationStep ===
      country: data.location?.country || 'Bénin',
      city: data.location?.city || '',
      address: data.location?.address || '',
      neighborhood: data.location?.neighborhood || '',
      postalCode: data.location?.postalCode,
      latitude: data.location?.latitude,
      longitude: data.location?.longitude,
      
      // === BasicsStep ===
      size: data.basics?.size,
      floors: data.basics?.floors,
      
      // Champs spécifiques maison
      maxGuests: data.basics?.maxGuests,
      bedrooms: data.basics?.bedrooms,
      beds: data.basics?.beds,
      bathrooms: data.basics?.bathrooms,
      privateEntrance: data.basics?.privateEntrance,
      
      // Champs spécifiques bureau
      employees: data.basics?.employees,
      offices: data.basics?.offices,
      meetingRooms: data.basics?.meetingRooms,
      workstations: data.basics?.workstations,
      
      // Champs spécifiques événement
      eventCapacity: data.basics?.eventCapacity,
      parkingSpots: data.basics?.parkingSpots,
      wheelchairAccessible: data.basics?.wheelchairAccessible,
      hasStage: data.basics?.hasStage,
      hasSoundSystem: data.basics?.hasSoundSystem,
      hasProjector: data.basics?.hasProjector,
      minBookingHours: data.basics?.minBookingHours,
      
      // === PhotosStep ===
      images: data.photos?.map((photo: any) => photo.url).filter(Boolean) || [],
      
      // === TitleStep ===
      title: data.title || '',
      
      // === PriceStep ===
      basePrice: data.price?.basePrice || 0,
      currency: data.price?.currency || 'FCFA',
      weeklyDiscount: data.price?.weeklyDiscount || 0,
      monthlyDiscount: data.price?.monthlyDiscount || 0,
      cleaningFee: data.price?.cleaningFee || 0,
      extraGuestFee: data.price?.extraGuestFee || 0,
      securityDeposit: data.price?.securityDeposit || 0,
      
      // === Rules ===
      checkInTime: data.rules?.checkInTime || '15:00',
      checkOutTime: data.rules?.checkOutTime || '11:00',
      childrenAllowed: data.rules?.childrenAllowed !== false,
      
      // === Statut ===
      isPublished: true,
      
      // === Relation ===
      proprietaireId: utilisateur.id
    }

    // Nettoyer les données undefined pour Prisma
    Object.keys(bienData).forEach(key => {
      if (bienData[key] === undefined) {
        delete bienData[key]
      }
    })

    console.log('📦 Données du bien préparées:', JSON.stringify(bienData, null, 2))

    // 3. Créer le bien
    const bien = await prisma.bien.create({
      data: bienData,
      include: {
        proprietaire: {
          select: {
            id: true,
            nom: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Bien créé - ID:', bien.id)
    console.log('📸 Nombre d\'images:', bienData.images?.length || 0)

    // 4. Créer la description si elle existe
    if (data.description) {
      await prisma.description.create({
        data: {
          summary: data.description.summary || '',
          spaceDescription: data.description.spaceDescription || '',
          guestAccess: data.description.guestAccess || '',
          neighborhoodInfo: data.description.neighborhood || '',
          bienId: bien.id
        }
      })
      console.log('✅ Description créée')
    } else {
      console.log('⚠️ Aucune description fournie')
    }

    // 5. Gérer les équipements
    if (data.amenities && Array.isArray(data.amenities) && data.amenities.length > 0) {
      console.log('📋 Équipements à gérer:', data.amenities.length)
      
      // Pour chaque code d'équipement, on cherche ou crée l'équipement
      const equipmentPromises = data.amenities.map(async (amenityCode: string) => {
        try {
          // Chercher l'équipement par code
          const equipement = await prisma.equipement.findUnique({
            where: { code: amenityCode }
          })
          
          if (equipement) {
            // Créer la relation
            await prisma.equipementBien.create({
              data: {
                bienId: bien.id,
                equipementId: equipement.id
              }
            })
            console.log(`   ➕ Équipement ajouté: ${equipement.nom}`)
            return equipement
          } else {
            console.log(`   ⚠️  Équipement non trouvé: ${amenityCode}`)
            return null
          }
        } catch (equipError) {
          console.log(`   ❌ Erreur avec équipement ${amenityCode}:`, equipError)
          return null
        }
      })

      await Promise.all(equipmentPromises)
      console.log(`✅ ${data.amenities.length} équipements traités`)
    } else {
      console.log('⚠️ Aucun équipement fourni')
    }

    // 6. Réponse finale
    return NextResponse.json({
      success: true,
      message: '🎉 Annonce publiée avec succès !',
      annonceId: bien.id,
      utilisateurId: utilisateur.id,
      data: {
        bienId: bien.id,
        titre: bien.title,
        ville: bien.city,
        prix: `${bien.basePrice} ${bien.currency}`,
        proprietaire: bien.proprietaire.nom,
        images: bienData.images?.length || 0,
        amenities: data.amenities?.length || 0,
        publishedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ ERREUR lors de la publication:', error)
    console.error('Stack:', error.stack)
    
    // Messages d'erreur plus clairs
    let errorMessage = 'Erreur serveur'
    let errorDetails = error.message
    
    if (error.code === 'P2002') {
      errorMessage = 'Un utilisateur avec cet email existe déjà'
    } else if (error.code === 'P2003') {
      errorMessage = 'Erreur de relation avec la base de données'
    } else if (error.code === 'P1001') {
      errorMessage = 'Impossible de se connecter à la base de données'
      errorDetails = 'Vérifiez votre connexion internet et vos identifiants Neon'
    } else if (error.code === 'P2000') {
      errorMessage = 'Une valeur est trop longue pour un champ'
    } else if (error.code === 'P2001') {
      errorMessage = 'Enregistrement non trouvé'
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}