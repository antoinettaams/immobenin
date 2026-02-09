// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const guests = searchParams.get('guests');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    console.log('🔍 Recherche propriétés avec filtres:', {
      location,
      type,
      guests,
      limit,
      offset
    });

    // Construire les filtres
    const where: any = {
      isPublished: true,
    };

    // Filtrer par localisation
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { neighborhood: { contains: location, mode: 'insensitive' } },
        { address: { contains: location, mode: 'insensitive' } },
      ];
    }

    // Filtrer par type
    if (type) {
      const typeLower = type.toLowerCase();
      
      if (typeLower.includes('maison') || typeLower.includes('house') || typeLower === 'house') {
        where.category = 'HOUSE';
      } else if (typeLower.includes('bureau') || typeLower.includes('office') || typeLower === 'office') {
        where.category = 'OFFICE';
      } else if (typeLower.includes('salle') || typeLower.includes('événement') || typeLower.includes('event') || typeLower === 'event') {
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

    console.log('📋 Filtres Prisma:', JSON.stringify(where, null, 2));

    const properties = await prisma.bien.findMany({
      where,
      // INCLURE TOUTES LES RELATIONS 
      include: {
        description: true,
        proprietaire: true,
        equipements: {
          include: {
            equipement: true
          }
        }
      }, 
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Nombre de biens récupérés: ${properties.length}`);

    // Formater la réponse
    const formattedProperties = properties.map(property => {
      console.log(`🔍 Traitement du bien ${property.id}: ${property.title}`);

      console.log('   ✅ maxGuests:', property.maxGuests);
      console.log('   ✅ employees:', property.employees);
      console.log('   ✅ eventCapacity:', property.eventCapacity);
      console.log('   ✅ bedrooms:', property.bedrooms);
      console.log('   ✅ bathrooms:', property.bathrooms);
      console.log('   ✅ floors:', property.floors);

      // Déterminer la capacité
      let capacity = 0;
      if (property.category === 'HOUSE') {
        capacity = property.maxGuests || 0;
      } else if (property.category === 'OFFICE') {
        capacity = property.employees || 0;
      } else if (property.category === 'EVENT') {
        capacity = property.eventCapacity || 0;
      }

      // Extraire les équipements
      const amenities = property.equipements
        .map(e => e.equipement?.nom)
        .filter((nom): nom is string => !!nom);
      
      const hasWifi = amenities.some(amenity => 
        amenity.toLowerCase().includes('wifi') || 
        amenity.toLowerCase().includes('internet')
      );

      // Format display type
      let displayType = '';
      switch (property.category) {
        case 'HOUSE':
          displayType = property.subType && property.subType !== 'house' 
            ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
            : 'Maison';
          break;
        case 'OFFICE':
          displayType = property.subType && property.subType !== 'office'
            ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
            : 'Bureau';
          break;
        case 'EVENT':
          displayType = property.subType && property.subType !== 'event'
            ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
            : 'Salle événement';
          break;
        default:
          displayType = property.subType || 'Propriété';
      }

      // NETTOYAGE DES IMAGES
      const cleanImages = (property.images || [])
        .filter((img: any) => {
          if (!img || typeof img !== 'string') {
            return false;
          }
          
          const trimmed = img.trim();
          
          // Exclure URLs blob (temporaires)
          if (trimmed.startsWith('blob:')) {
            return false;
          }
          
          // Vérifier longueur minimale
          if (trimmed.length < 10) {
            return false;
          }
          
          return true;
        })
        .map((img: string) => {
          const trimmed = img.trim();
          
          // Nettoyer URLs Cloudinary
          if (trimmed.includes('cloudinary.com')) {
            let cleanUrl = trimmed;
            
            // Forcer HTTPS
            if (cleanUrl.startsWith('http://')) {
              cleanUrl = cleanUrl.replace('http://', 'https://');
            }
            
            // Ajouter optimisation d'image
            if (!cleanUrl.includes('/upload/q_auto,f_auto/') && cleanUrl.includes('/upload/')) {
              cleanUrl = cleanUrl.replace('/upload/', '/upload/q_auto,f_auto/');
            }
            
            return cleanUrl;
          }
          
          return trimmed;
        })
        .filter((img: string) => img && img.length > 0);

      // Assurer au moins une image
      const images = cleanImages.length > 0 
        ? cleanImages 
        : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

      // FORMATION DE L'OBJET COMPLET  
      const formattedProperty = {
        // === Tous les champs de Bien ===
        id: property.id,
        title: property.title || `${displayType} à ${property.city}`,
        category: property.category,
        subType: property.subType,
        privacy: property.privacy,
        
        // LocationStep
        country: property.country,
        city: property.city,
        neighborhood: property.neighborhood,
        address: property.address,
        postalCode: property.postalCode,
        latitude: property.latitude,
        longitude: property.longitude,
        
        // BasicsStep - Champs communs
        size: property.size,
        floors: property.floors,
        
        // BasicsStep - Maison
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        beds: property.beds,
        bathrooms: property.bathrooms,
        privateEntrance: property.privateEntrance || false,
        
        // BasicsStep - Bureau
        employees: property.employees,
        offices: property.offices,
        meetingRooms: property.meetingRooms,
        workstations: property.workstations,
        
        // BasicsStep - Événement
        eventCapacity: property.eventCapacity,
        parkingSpots: property.parkingSpots,
        wheelchairAccessible: property.wheelchairAccessible || false,
        hasStage: property.hasStage || false,
        hasSoundSystem: property.hasSoundSystem || false,
        hasProjector: property.hasProjector || false,
        hasCatering: (property as any).hasCatering || false, 
        minBookingHours: property.minBookingHours,
        
        // TitleStep
        displayType: displayType,
        
        // PriceStep
        basePrice: property.basePrice || 0,
        currency: property.currency || 'FCFA',
        weeklyDiscount: property.weeklyDiscount || 0,
        monthlyDiscount: property.monthlyDiscount || 0,
        cleaningFee: property.cleaningFee || 0,
        extraGuestFee: property.extraGuestFee || 0,
        securityDeposit: property.securityDeposit || 0,
        
        // Rules
        checkInTime: property.checkInTime || '15:00',
        checkOutTime: property.checkOutTime || '11:00',
        childrenAllowed: property.childrenAllowed !== false,
        
        // Images
        images: images,
        img: images[0] || '',
        
        // Statut
        isPublished: property.isPublished,
        
        // === DescriptionStep ===
        description: property.description ? {
          summary: property.description.summary,
          spaceDescription: property.description.spaceDescription,
          guestAccess: property.description.guestAccess,
          neighborhood: property.description.neighborhoodInfo,
          createdAt: property.description.createdAt.toISOString(),
        } : null,
        
        // === Utilisateur ===
        owner: {
          id: property.proprietaire.id,
          name: property.proprietaire.nom,
          phone: property.proprietaire.telephone,
          email: property.proprietaire.email,
        },
        
        // === AmenitiesStep ===
        amenities: amenities,
        amenitiesDetails: property.equipements.map(e => ({
          id: e.equipement.id,
          code: e.equipement.code,
          nom: e.equipement.nom,
          description: e.equipement.description,
          categorie: e.equipement.categorie,
        })),
        
        wifi: hasWifi,
        
        // Features calculées
        features: {
          hasPool: amenities.some(a => a.toLowerCase().includes('piscine')),
          hasAirConditioning: amenities.some(a => a.toLowerCase().includes('climatisation')),
          hasParking: amenities.some(a => a.toLowerCase().includes('parking')),
          hasKitchen: amenities.some(a => a.toLowerCase().includes('cuisine')),
          hasTerrace: amenities.some(a => a.toLowerCase().includes('terrasse') || a.toLowerCase().includes('balcon')),
        },
        
        // Capacité calculée
        capacity: capacity,
        location: property.neighborhood || property.city,
        price: property.basePrice || 0,
        
        // Timestamps
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      };

      return formattedProperty;
    });

    console.log(`✅ ${formattedProperties.length} propriétés formatées avec succès`);

    return NextResponse.json({
      success: true,
      data: formattedProperties,
      total: formattedProperties.length,
      meta: {
        location: location || 'tous',
        type: type || 'tous',
        guests: guests || 'tous',
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des propriétés:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération des propriétés',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Endpoint POST 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 Création nouvelle propriété:', body);
    
    // Validation basique
    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Titre et catégorie requis' },
        { status: 400 }
      );
    }
    
    // Créer l'objet de données 
    const createData: any = {
      // Tous les champs de Bien
      title: body.title,
      category: body.category,
      subType: body.subType || '',
      
      // LocationStep
      city: body.city || 'Cotonou',
      address: body.address || '',
      neighborhood: body.neighborhood,
      country: body.country || 'Bénin',
      postalCode: body.postalCode,
      latitude: body.latitude,
      longitude: body.longitude,
      
      // BasicsStep
      size: body.size,
      floors: body.floors,
      maxGuests: body.maxGuests,
      bedrooms: body.bedrooms,
      beds: body.beds,
      bathrooms: body.bathrooms,
      privateEntrance: body.privateEntrance,
      employees: body.employees,
      offices: body.offices,
      meetingRooms: body.meetingRooms,
      workstations: body.workstations,
      eventCapacity: body.eventCapacity,
      parkingSpots: body.parkingSpots,
      wheelchairAccessible: body.wheelchairAccessible,
      // hasStage: body.hasStage,
      // hasSoundSystem: body.hasSoundSystem,
      // hasProjector: body.hasProjector,
      // hasCatering: body.hasCatering,
      minBookingHours: body.minBookingHours,
      
      // PriceStep
      basePrice: body.price || 0,
      currency: body.currency || 'FCFA',
      weeklyDiscount: body.weeklyDiscount || 0,
      monthlyDiscount: body.monthlyDiscount || 0,
      cleaningFee: body.cleaningFee || 0,
      extraGuestFee: body.extraGuestFee || 0,
      securityDeposit: body.securityDeposit || 0,
      
      // Rules
      checkInTime: body.checkInTime || '15:00',
      checkOutTime: body.checkOutTime || '11:00',
      childrenAllowed: body.childrenAllowed !== false,
      
      // Images
      images: body.images || [],
      
      // Privacy
      privacy: body.privacy,
      
      // Statut
      isPublished: body.isPublished !== undefined ? body.isPublished : false,
      
      // Relation avec Utilisateur
      proprietaire: {
        connectOrCreate: {
          where: { email: body.ownerEmail || 'default@example.com' },
          create: {
            email: body.ownerEmail || 'default@example.com',
            nom: body.ownerName || 'Propriétaire',
            telephone: body.ownerPhone || '00000000'
          }
        }
      }
    };
    
    const newProperty = await prisma.bien.create({
      data: createData
    });
    
    console.log(`✅ Propriété créée avec ID: ${newProperty.id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Propriété créée avec succès',
      data: { id: newProperty.id }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Erreur création propriété:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}