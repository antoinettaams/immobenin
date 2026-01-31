import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Solution pour Next.js 15.1+
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const idString = params.id
    const id = parseInt(idString)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      )
    }

    // Le reste du code de votre API...
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

    // ... (tout le reste du code de formattage reste identique)
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

    const formattedProperty = {
      id: property.id,
      title: property.title || `${displayType} à ${property.city}`,
      type: displayType,
      subType: property.subType,
      category: property.category,
      privacy: property.privacy,
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
      price: property.basePrice || 0,
      currency: property.currency || "FCFA",
      weeklyDiscount: property.weeklyDiscount || 0,
      monthlyDiscount: property.monthlyDiscount || 0,
      cleaningFee: property.cleaningFee || 0,
      extraGuestFee: property.extraGuestFee || 0,
      securityDeposit: property.securityDeposit || 0,
      priceDescription: `${(property.basePrice || 0).toLocaleString("fr-FR")} ${property.currency || 'FCFA'} / ${property.category === 'OFFICE' ? 'mois' : 'nuit'}`,
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
      img: images[0],
      images: images,
      wifi: hasWifi,
      hasPool: hasPool,
      hasAirConditioning: hasAirConditioning,
      hasParking: hasParking,
      amenities: amenities,
      amenitiesDetails: amenitiesDetails,
      description: description.summary,
      fullDescription: {
        summary: description.summary,
        spaceDescription: description.spaceDescription,
        guestAccess: description.guestAccess,
        neighborhoodInfo: description.neighborhoodInfo
      },
      rules: {
        checkInTime: property.checkInTime || '14:00',
        checkOutTime: property.checkOutTime || '12:00',
        childrenAllowed: property.childrenAllowed ?? true,
        checkInDescription: `Arrivée à partir de ${property.checkInTime || '14:00'}`,
        checkOutDescription: `Départ avant ${property.checkInTime || '12:00'}`,
        extraRules: property.childrenAllowed === false ? "Enfants non autorisés" : "Enfants autorisés"
      },
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
      ...(property.category === 'HOUSE' && {
        maxGuests: property.maxGuests,
        privateEntrance: property.privateEntrance || false,
        houseFeatures: {
          maxGuests: property.maxGuests,
          privateEntrance: property.privateEntrance,
          beds: property.beds,
          description: `Maison avec ${property.bedrooms || 0} chambre(s), ${property.bathrooms || 0} salle(s) de bain, ${property.maxGuests || 0} personne(s) maximum${property.privateEntrance ? ', Entrée privée' : ''}`
        }
      }),
      ...(property.category === 'OFFICE' && {
        employees: property.employees,
        offices: property.offices,
        meetingRooms: property.meetingRooms,
        workstations: property.workstations,
        officeFeatures: {
          employees: property.employees,
          offices: property.offices,
          meetingRooms: property.meetingRooms,
          workstations: property.workstations,
          description: `Bureau pour ${property.employees || 0} employé(s), ${property.offices || 0} bureau(x), ${property.meetingRooms || 0} salle(s) de réunion, ${property.workstations || 0} poste(s) de travail`
        }
      }),
      ...(property.category === 'EVENT' && {
        eventCapacity: property.eventCapacity,
        parkingSpots: property.parkingSpots,
        wheelchairAccessible: property.wheelchairAccessible || false,
        hasStage: property.hasStage || false,
        hasSoundSystem: property.hasSoundSystem || false,
        hasProjector: property.hasProjector || false,
        minBookingHours: property.minBookingHours,
        eventFeatures: {
          capacity: property.eventCapacity,
          parking: property.parkingSpots,
          wheelchairAccessible: property.wheelchairAccessible,
          stage: property.hasStage,
          soundSystem: property.hasSoundSystem,
          projector: property.hasProjector,
          minHours: property.minBookingHours,
          description: `Salle événement pour ${property.eventCapacity || 0} personne(s), ${property.parkingSpots || 0} place(s) parking, ${property.minBookingHours || 0} heure(s) minimum${property.wheelchairAccessible ? ', Accès PMR' : ''}${property.hasStage ? ', Avec scène' : ''}${property.hasSoundSystem ? ', Avec sono' : ''}${property.hasProjector ? ', Avec projecteur' : ''}`
        }
      }),
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
      statistics: {
        amenitiesCount: amenities.length,
        imagesCount: images.length,
        descriptionLength: description.summary?.length || 0
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