// app/api/properties/[id]/route.ts - CORRIGÉ COMPLET
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
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

    console.log(`🔍 Recherche du bien ${id}...`);
    
    const property = await prisma.bien.findUnique({
      where: { id: id },
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

    console.log(`✅ Bien ${id} trouvé: ${property.title}`);
    console.log(`📊 Images stockées: ${property.images?.length || 0}`);

    // CORRECTION DES IMAGES - Filtrer et nettoyer
    const cleanImages = (property.images || [])
      .filter((img: any) => {
        if (!img || typeof img !== 'string') return false;
        
        const trimmed = img.trim();
        
        // Exclure les URLs blob (non persistantes)
        if (trimmed.startsWith('blob:')) {
          console.warn(`⚠️ URL blob ignorée: ${trimmed.substring(0, 50)}...`);
          return false;
        }
        
        // Vérifier la longueur minimale
        return trimmed.length > 10;
      })
      .map((img: string) => {
        const trimmed = img.trim();
        
        // Nettoyer les URLs Cloudinary
        if (trimmed.includes('cloudinary.com')) {
          // S'assurer d'avoir HTTPS
          let cleanUrl = trimmed.startsWith('http://') 
            ? trimmed.replace('http://', 'https://')
            : trimmed;
          
          // Ajouter l'optimisation si pas déjà présente
          if (!cleanUrl.includes('/upload/q_auto,f_auto/') && cleanUrl.includes('/upload/')) {
            cleanUrl = cleanUrl.replace('/upload/', '/upload/q_auto,f_auto/');
          }
          
          return cleanUrl;
        }
        
        // Garder les base64 tels quels
        if (trimmed.startsWith('data:image')) {
          return trimmed;
        }
        
        return trimmed;
      })
      .filter((img: string) => img && img.length > 0);

    console.log(`🎯 Images nettoyées: ${cleanImages.length}`);
    if (cleanImages.length > 0) {
      console.log(`   Première image: ${cleanImages[0].substring(0, 70)}...`);
    }

    // Si pas d'images, ajouter un placeholder
    const images = cleanImages.length > 0 
      ? cleanImages 
      : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

    // Formatage de la réponse
    let capacity = 0;
    let capacityDescription = "";
    
    if (property.category === 'HOUSE') {
      capacity = property.maxGuests || 0;
      capacityDescription = `${capacity} voyageurs maximum`;
    } else if (property.category === 'OFFICE') {
      capacity = property.employees || property.workstations || 0;
      capacityDescription = `${capacity} personnes`;
    } else if (property.category === 'EVENT') {
      capacity = property.eventCapacity || 0;
      capacityDescription = `${capacity} personnes`;
    }

    const amenities = property.equipements
      .map(e => e.equipement?.nom)
      .filter((nom): nom is string => !!nom);

    const displayType = property.subType || 
      (property.category === 'HOUSE' ? 'Maison' : 
       property.category === 'OFFICE' ? 'Bureau' : 
       'Salle événement');

    const formattedProperty = {
      // Informations de base
      id: property.id,
      title: property.title || `${displayType} à ${property.city}`,
      type: displayType,
      category: property.category,
      subType: property.subType,
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
      locationDetails: `${property.address}, ${property.neighborhood ? property.neighborhood + ', ' : ''}${property.city}`,
      
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
      
      // IMAGES CORRIGÉES
      img: images[0] || '',
      images: images,
      
      // Équipements
      amenities: amenities,
      hasWifi: amenities.some(a => 
        a.toLowerCase().includes('wifi') || 
        a.toLowerCase().includes('internet')
      ),
      hasPool: amenities.some(a => a.toLowerCase().includes('piscine')),
      hasAirConditioning: amenities.some(a => 
        a.toLowerCase().includes('climatisation') ||
        a.toLowerCase().includes('air condition')
      ),
      hasParking: amenities.some(a => 
        a.toLowerCase().includes('parking') ||
        a.toLowerCase().includes('garage')
      ),
      
      // Description
      description: property.description?.summary || '',
      fullDescription: {
        summary: property.description?.summary || '',
        spaceDescription: property.description?.spaceDescription || '',
        guestAccess: property.description?.guestAccess || '',
        neighborhoodInfo: property.description?.neighborhoodInfo || 
          (property.neighborhood ? `Quartier ${property.neighborhood} à ${property.city}` : `À ${property.city}`)
      },
      
      // Règles
      rules: {
        checkInTime: property.checkInTime || '14:00',
        checkOutTime: property.checkOutTime || '12:00',
        childrenAllowed: property.childrenAllowed ?? true,
        checkInDescription: `Arrivée à partir de ${property.checkInTime || '14:00'}`,
        checkOutDescription: `Départ avant ${property.checkOutTime || '12:00'}`
      },
      
      // Propriétaire
      owner: {
        id: property.proprietaire.id,
        name: property.proprietaire.nom,
        phone: property.proprietaire.telephone,
        email: property.proprietaire.email,
        contactInfo: `Propriétaire: ${property.proprietaire.nom}`
      },
      
      // Métadonnées
      isPublished: property.isPublished,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      
      // Champs spécifiques
      ...(property.category === 'HOUSE' && {
        maxGuests: property.maxGuests,
        privateEntrance: property.privateEntrance || false
      }),
      ...(property.category === 'OFFICE' && {
        employees: property.employees,
        offices: property.offices,
        meetingRooms: property.meetingRooms,
        workstations: property.workstations
      }),
      ...(property.category === 'EVENT' && {
        eventCapacity: property.eventCapacity,
        parkingSpots: property.parkingSpots,
        wheelchairAccessible: property.wheelchairAccessible || false,
        hasStage: property.hasStage || false,
        hasSoundSystem: property.hasSoundSystem || false,
        hasProjector: property.hasProjector || false,
        minBookingHours: property.minBookingHours
      })
    };

    console.log(`✅ Réponse préparée pour le bien ${id}`);
    console.log(`📊 Images envoyées: ${formattedProperty.images.length}`);

    return NextResponse.json({
      success: true,
      data: formattedProperty
    });

  } catch (error: any) {
    console.error('❌ Erreur API property details:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération du bien',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}