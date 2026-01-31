import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const guests = searchParams.get('guests');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    // Construire les filtres
    const where: any = {
      isPublished: true,
    };

    // Filtrer par localisation (ville ou quartier)
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { neighborhood: { contains: location, mode: 'insensitive' } },
        { address: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Filtrer par type de bien
    if (type) {
      const typeLower = type.toLowerCase();
      
      if (typeLower.includes('maison') || typeLower.includes('house') || typeLower === 'HOUSE') {
        where.category = 'HOUSE';
      } else if (typeLower.includes('bureau') || typeLower.includes('office') || typeLower === 'OFFICE') {
        where.category = 'OFFICE';
      } else if (typeLower.includes('salle') || typeLower.includes('événement') || typeLower.includes('event') || typeLower === 'EVENT') {
        where.category = 'EVENT';
      } else {
        where.subType = { contains: type, mode: 'insensitive' };
      }
    }

    // Filtrer par capacité
    if (guests && !isNaN(parseInt(guests))) {
      const guestCount = parseInt(guests);
      where.OR = [
        { maxGuests: { gte: guestCount } },
        { eventCapacity: { gte: guestCount } },
        { employees: { gte: guestCount } },
      ];
    }

    // Récupérer les biens avec leurs équipements CORRECTEMENT
    const properties = await prisma.bien.findMany({
      where,
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
              }
            }
          }
        },
        proprietaire: {
          select: {
            nom: true,
            telephone: true,
          },
        },
        description: true,
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formater la réponse
    const formattedProperties = properties.map(property => {
      // Déterminer la capacité selon le type
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

      return {
        id: property.id,
        title: property.title || `${displayType} à ${property.city}`,
        type: displayType,
        category: property.category,
        subType: property.subType,
        location: property.neighborhood || property.address,
        city: property.city,
        address: property.address,
        price: property.basePrice || 0,
        currency: property.currency,
        capacity: capacity,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        size: property.size,
        floors: property.floors,
        images: property.images.length > 0 ? property.images : ['https://picsum.photos/600/400?random=' + property.id],
        wifi: hasWifi,
        amenities: amenities,
        owner: {
          name: property.proprietaire.nom,
          phone: property.proprietaire.telephone,
        },
        description: property.description?.summary || '',
        isPublished: property.isPublished,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedProperties,
      total: formattedProperties.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}