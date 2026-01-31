import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID depuis l'URL sans utiliser params
    const pathname = request.nextUrl.pathname
    const segments = pathname.split('/')
    const idString = segments[segments.length - 1]
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      )
    }

    const property = await prisma.bien.findUnique({
      where: {
        id: id,
        isPublished: true,
      },
      include: {
        equipements: {
          include: {
            equipement: {
              select: {
                id: true,
                nom: true,
                code: true,
                categorie: true,
                description: true,
                pourMaison: true,
                pourBureau: true,
                pourEvenement: true,
              }
            }
          }
        },
        proprietaire: {
          select: {
            id: true,
            nom: true,
            telephone: true,
            email: true,
          },
        },
        description: true,
      },
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Propriété non trouvée' },
        { status: 404 }
      )
    }

    // Formater la réponse
    let capacity = 0
    let capacityDescription = ""
    if (property.category === 'HOUSE') {
      capacity = property.maxGuests || 0
      capacityDescription = `${capacity} voyageurs maximum`
    } else if (property.category === 'OFFICE') {
      capacity = property.employees || property.workstations || 0
      capacityDescription = `${capacity} personnes (employés/postes)`
    } else if (property.category === 'EVENT') {
      capacity = property.eventCapacity || 0
      capacityDescription = `${capacity} personnes (capacité événement)`
    }

    const amenities = property.equipements
      .map(e => e.equipement?.nom)
      .filter((nom): nom is string => !!nom)

    const amenitiesDetails = property.equipements.map(e => ({
      id: e.equipement?.id,
      nom: e.equipement?.nom,
      code: e.equipement?.code,
      categorie: e.equipement?.categorie,
      description: e.equipement?.description,
      pourMaison: e.equipement?.pourMaison,
      pourBureau: e.equipement?.pourBureau,
      pourEvenement: e.equipement?.pourEvenement,
    })).filter(e => e.nom)

    const hasWifi = amenities.some(amenity => 
      amenity.toLowerCase().includes('wifi') || 
      amenity.toLowerCase().includes('internet')
    )

    const hasPool = amenities.some(amenity => 
      amenity.toLowerCase().includes('piscine')
    )

    const hasAirConditioning = amenities.some(amenity => 
      amenity.toLowerCase().includes('climatisation') ||
      amenity.toLowerCase().includes('air condition')
    )

    const hasParking = amenities.some(amenity => 
      amenity.toLowerCase().includes('parking') ||
      amenity.toLowerCase().includes('garage')
    )

    let displayType = property.subType
    switch (property.category) {
      case 'HOUSE':
        if (!displayType || displayType === 'house') displayType = 'Maison'
        break
      case 'OFFICE':
        if (!displayType || displayType === 'office') displayType = 'Bureau'
        break
      case 'EVENT':
        if (!displayType || displayType === 'event') displayType = 'Salle événement'
        break
    }

    const images = property.images && property.images.length > 0 
      ? property.images 
      : [`https://picsum.photos/600/400?random=${property.id}`]

    const description = property.description || {
      summary: '',
      spaceDescription: '',
      guestAccess: '',
      neighborhoodInfo: property.neighborhood ? `Quartier ${property.neighborhood} à ${property.city}` : `À ${property.city}`,
    }

    // Créer l'objet de base
    const formattedProperty: any = {
      // Informations de base
      id: property.id,
      title: property.title || `${displayType} à ${property.city}`,
      type: displayType,
      subType: property.subType,
      category: property.category,
      privacy: property.privacy,
      
      // Localisation
      location: property.neighborhood || property.city,
      city: property.city,
      address: property.address,
      neighborhood: property.neighborhood,
      postalCode: property.postalCode,
      country: property.country || "Bénin",
      latitude: property.latitude,
      longitude: property.longitude,
      locationDetails: {
        fullAddress: `${property.address}, ${property.neighborhood ? property.neighborhood + ', ' : ''}${property.city}${property.postalCode ? ', ' + property.postalCode : ''}, ${property.country || 'Bénin'}`,
        coordinates: property.latitude && property.longitude ? {
          latitude: property.latitude,
          longitude: property.longitude
        } : undefined
      },
      
      // Prix
      price: property.basePrice || 0,
      currency: property.currency || "FCFA",
      weeklyDiscount: property.weeklyDiscount || 0,
      monthlyDiscount: property.monthlyDiscount || 0,
      cleaningFee: property.cleaningFee || 0,
      extraGuestFee: property.extraGuestFee || 0,
      securityDeposit: property.securityDeposit || 0,
      priceDescription: `${(property.basePrice || 0).toLocaleString("fr-FR")} ${property.currency || 'FCFA'} / ${property.category === 'OFFICE' ? 'mois' : 'nuit'}`,
      
      // Caractéristiques
      capacity: capacity,
      capacityDescription: capacityDescription,
      bedrooms: property.bedrooms || 0,
      beds: property.beds || 0,
      bathrooms: property.bathrooms || 0,
      size: property.size,
      floors: property.floors,
      physicalFeatures: {
        size: property.size,
        floors: property.floors,
        bedrooms: property.bedrooms,
        beds: property.beds,
        bathrooms: property.bathrooms,
        description: `${property.bedrooms || 0} chambre(s), ${property.bathrooms || 0} salle(s) de bain, ${property.size || 0}m²`
      },
      
      // Images
      img: images[0],
      images: images,
      
      // Équipements
      wifi: hasWifi,
      hasPool: hasPool,
      hasAirConditioning: hasAirConditioning,
      hasParking: hasParking,
      amenities: amenities,
      amenitiesDetails: amenitiesDetails,
      
      // Description
      description: description.summary,
      fullDescription: {
        summary: description.summary,
        spaceDescription: description.spaceDescription,
        guestAccess: description.guestAccess,
        neighborhoodInfo: description.neighborhoodInfo
      },
      
      // Règles
      rules: {
        checkInTime: property.checkInTime || '14:00',
        checkOutTime: property.checkOutTime || '12:00',
        childrenAllowed: property.childrenAllowed ?? true,
        checkInDescription: `Arrivée à partir de ${property.checkInTime || '14:00'}`,
        checkOutDescription: `Départ avant ${property.checkOutTime || '12:00'}`,
        extraRules: property.childrenAllowed === false ? "Enfants non autorisés" : "Enfants autorisés"
      },
      
      // Propriétaire
      owner: {
        id: property.proprietaire.id,
        name: property.proprietaire.nom,
        phone: property.proprietaire.telephone,
        email: property.proprietaire.email,
        contactInfo: `Propriétaire: ${property.proprietaire.nom} - ${property.proprietaire.telephone}`,
        contactDetails: {
          name: property.proprietaire.nom,
          email: property.proprietaire.email,
          phone: property.proprietaire.telephone,
          formattedPhone: property.proprietaire.telephone?.replace(/(\d{2})(?=\d)/g, '$1 ') || ''
        }
      },
      
      // Métadonnées
      isPublished: property.isPublished,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      additionalInfo: {
        isPublished: property.isPublished,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
        publishedStatus: property.isPublished ? 'Publié' : 'Brouillon',
        creationDate: property.createdAt.toLocaleDateString('fr-FR'),
        lastUpdate: property.updatedAt.toLocaleDateString('fr-FR')
      },
      
      // Statistiques
      statistics: {
        amenitiesCount: amenities.length,
        imagesCount: images.length,
        descriptionLength: description.summary?.length || 0
      }
    }

    // Ajouter les champs spécifiques HOUSE
    if (property.category === 'HOUSE') {
      formattedProperty.maxGuests = property.maxGuests
      formattedProperty.privateEntrance = property.privateEntrance || false
      formattedProperty.houseFeatures = {
        maxGuests: property.maxGuests,
        privateEntrance: property.privateEntrance,
        beds: property.beds,
        description: `Maison avec ${property.bedrooms || 0} chambre(s), ${property.bathrooms || 0} salle(s) de bain, ${property.maxGuests || 0} personne(s) maximum${property.privateEntrance ? ', Entrée privée' : ''}`
      }
    }

    // Ajouter les champs spécifiques OFFICE
    if (property.category === 'OFFICE') {
      formattedProperty.employees = property.employees
      formattedProperty.offices = property.offices
      formattedProperty.meetingRooms = property.meetingRooms
      formattedProperty.workstations = property.workstations
      formattedProperty.officeFeatures = {
        employees: property.employees,
        offices: property.offices,
        meetingRooms: property.meetingRooms,
        workstations: property.workstations,
        description: `Bureau pour ${property.employees || 0} employé(s), ${property.offices || 0} bureau(x), ${property.meetingRooms || 0} salle(s) de réunion, ${property.workstations || 0} poste(s) de travail`
      }
    }

    // Ajouter les champs spécifiques EVENT
    if (property.category === 'EVENT') {
      formattedProperty.eventCapacity = property.eventCapacity
      formattedProperty.parkingSpots = property.parkingSpots
      formattedProperty.wheelchairAccessible = property.wheelchairAccessible || false
      formattedProperty.hasStage = property.hasStage || false
      formattedProperty.hasSoundSystem = property.hasSoundSystem || false
      formattedProperty.hasProjector = property.hasProjector || false
      formattedProperty.minBookingHours = property.minBookingHours
      formattedProperty.eventFeatures = {
        capacity: property.eventCapacity,
        parking: property.parkingSpots,
        wheelchairAccessible: property.wheelchairAccessible,
        stage: property.hasStage,
        soundSystem: property.hasSoundSystem,
        projector: property.hasProjector,
        minHours: property.minBookingHours,
        description: `Salle événement pour ${property.eventCapacity || 0} personne(s), ${property.parkingSpots || 0} place(s) parking, ${property.minBookingHours || 0} heure(s) minimum${property.wheelchairAccessible ? ', Accès PMR' : ''}${property.hasStage ? ', Avec scène' : ''}${property.hasSoundSystem ? ', Avec sono' : ''}${property.hasProjector ? ', Avec projecteur' : ''}`
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedProperty
    })

  } catch (error: any) {
    console.error('❌ Erreur API property details:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération du bien',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// Méthodes PUT et DELETE (optionnel)
export async function PUT(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname
    const segments = pathname.split('/')
    const idString = segments[segments.length - 1]
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Méthode PUT non implémentée' },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('❌ Erreur API property update:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour du bien'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname
    const segments = pathname.split('/')
    const idString = segments[segments.length - 1]
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Méthode DELETE non implémentée' },
      { status: 501 }
    )
  } catch (error: any) {
    console.error('❌ Erreur API property delete:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression du bien'
    }, { status: 500 })
  }
}