import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    // Attendre que params soit résolu
    const params = await context.params;
    const idString = params.id;
    
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }

    const property = await prisma.bien.findUnique({
      where: {
        id: id,
        isPublished: true,
      },
      include: {
        equipements: {
          include: {
            equipement: {  // IMPORTANT: Inclure l'équipement lui-même
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
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    // Formater la réponse
    let capacity = 0;
    if (property.category === 'HOUSE') {
      capacity = property.maxGuests || 0;
    } else if (property.category === 'OFFICE') {
      capacity = property.employees || 0;
    } else if (property.category === 'EVENT') {
      capacity = property.eventCapacity || 0;
    }

    // Extraire les équipements - CORRECTION ICI
    const amenities = property.equipements.map(e => e.equipement?.nom).filter(Boolean);
    const hasWifi = amenities.some(amenity => 
      amenity.toLowerCase().includes('wifi') || 
      amenity.toLowerCase().includes('internet')
    );

    // Mapper le type pour l'affichage
    let displayType = '';
    switch (property.category) {
      case 'HOUSE':
        displayType = 'Maison';
        break;
      case 'OFFICE':
        displayType = 'Bureau';
        break;
      case 'EVENT':
        displayType = 'Salle événement';
        break;
      default:
        displayType = property.subType || 'Propriété';
    }

    const formattedProperty = {
      id: property.id,
      title: property.title || `${displayType} à ${property.city}`,
      type: displayType,
      category: property.category,
      subType: property.subType,
      location: property.neighborhood || property.address,
      city: property.city,
      address: property.address,
      neighborhood: property.neighborhood,
      postalCode: property.postalCode,
      latitude: property.latitude,
      longitude: property.longitude,
      price: property.basePrice || 0,
      currency: property.currency,
      capacity: capacity,
      bedrooms: property.bedrooms || 0,
      beds: property.beds || 0,
      bathrooms: property.bathrooms || 0,
      size: property.size,
      floors: property.floors,
      images: property.images.length > 0 ? property.images : ['https://picsum.photos/600/400?random=' + property.id],
      wifi: hasWifi,
      amenities: amenities,
      // Informations détaillées des équipements
      equipementsDetails: property.equipements.map(e => ({
        id: e.equipement?.id,
        nom: e.equipement?.nom,
        code: e.equipement?.code,
        categorie: e.equipement?.categorie,
        description: e.equipement?.description,
      })),
      owner: {
        id: property.proprietaire.id,
        name: property.proprietaire.nom,
        phone: property.proprietaire.telephone,
        email: property.proprietaire.email,
      },
      description: property.description || {
        summary: '',
        spaceDescription: '',
        guestAccess: '',
        neighborhoodInfo: '',
      },
      // Champs spécifiques selon le type
      ...(property.category === 'HOUSE' && {
        maxGuests: property.maxGuests,
        privateEntrance: property.privateEntrance,
        checkInTime: property.checkInTime,
        checkOutTime: property.checkOutTime,
        childrenAllowed: property.childrenAllowed,
      }),
      ...(property.category === 'OFFICE' && {
        employees: property.employees,
        offices: property.offices,
        meetingRooms: property.meetingRooms,
        workstations: property.workstations,
      }),
      ...(property.category === 'EVENT' && {
        eventCapacity: property.eventCapacity,
        parkingSpots: property.parkingSpots,
        wheelchairAccessible: property.wheelchairAccessible,
        hasStage: property.hasStage,
        hasSoundSystem: property.hasSoundSystem,
        hasProjector: property.hasProjector,
        minBookingHours: property.minBookingHours,
      }),
      // Informations de prix
      cleaningFee: property.cleaningFee,
      extraGuestFee: property.extraGuestFee,
      securityDeposit: property.securityDeposit,
      weeklyDiscount: property.weeklyDiscount,
      monthlyDiscount: property.monthlyDiscount,
      isPublished: property.isPublished,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedProperty,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}