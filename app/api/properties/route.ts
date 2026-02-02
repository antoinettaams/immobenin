// app/api/properties/route.ts - COMPLET CORRIGÉ
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Récupérer les biens
    const properties = await prisma.bien.findMany({
      where,
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
              }
            }
          }
        },
        proprietaire: {
          select: {
            id: true,
            nom: true,
            telephone: true,
          },
        },
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
      console.log(`   Images brutes: ${property.images?.length || 0}`);

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

      // CORRECTION DES IMAGES - CRITIQUE
      const cleanImages = (property.images || [])
        .filter((img: any) => {
          if (!img || typeof img !== 'string') {
            console.log(`   ❌ Image non-string ignorée:`, typeof img);
            return false;
          }
          
          const trimmed = img.trim();
          
          // Exclure URLs blob (temporaires)
          if (trimmed.startsWith('blob:')) {
            console.log(`   ❌ URL blob ignorée: ${trimmed.substring(0, 30)}...`);
            return false;
          }
          
          // Vérifier longueur minimale
          if (trimmed.length < 10) {
            console.log(`   ❌ URL trop courte: ${trimmed}`);
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
            
            // Ajouter optimisation d'image si pas déjà présente
            if (!cleanUrl.includes('/upload/q_auto,f_auto/') && cleanUrl.includes('/upload/')) {
              cleanUrl = cleanUrl.replace('/upload/', '/upload/q_auto,f_auto/');
            }
            
            console.log(`   ✅ URL Cloudinary nettoyée: ${cleanUrl.substring(0, 50)}...`);
            return cleanUrl;
          }
          
          // Garder base64 (garder la logique de troncature si présente)
          if (trimmed.startsWith('data:image')) {
            // Si c'est un base64 tronqué avec "...[BASE64_TROP_LONG]"
            if (trimmed.includes('...[BASE64_TROP_LONG]')) {
              const base64Data = trimmed.split('...[BASE64_TROP_LONG]')[0];
              console.log(`   ✅ Base64 tronqué gardé: ${base64Data.substring(0, 30)}...`);
              return base64Data;
            }
            console.log(`   ✅ Base64 complet gardé: ${trimmed.substring(0, 30)}...`);
            return trimmed;
          }
          
          // Autres URLs (placeholder, etc.)
          console.log(`   ✅ Autre URL gardée: ${trimmed.substring(0, 50)}...`);
          return trimmed;
        })
        .filter((img: string) => img && img.length > 0);

      console.log(`   ✅ Images nettoyées: ${cleanImages.length}`);
      
      // Toujours avoir au moins une image
      const images = cleanImages.length > 0 
        ? cleanImages 
        : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

      if (images.length > 0) {
        console.log(`   🎯 Première image: ${images[0].substring(0, 60)}...`);
      }

      // Formater l'objet de réponse
      const formattedProperty = {
        id: property.id,
        title: property.title || `${displayType} à ${property.city}`,
        type: displayType,
        category: property.category,
        subType: property.subType,
        location: property.neighborhood || property.city,
        city: property.city,
        address: property.address,
        price: property.basePrice || 0,
        currency: property.currency || 'FCFA',
        capacity: capacity,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        size: property.size,
        floors: property.floors,
        
        // IMAGES CORRIGÉES
        img: images[0] || '',
        images: images,
        
        wifi: hasWifi,
        amenities: amenities,
        owner: {
          id: property.proprietaire.id,
          name: property.proprietaire.nom,
          phone: property.proprietaire.telephone,
        },
        isPublished: property.isPublished,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
        
        // Informations additionnelles
        features: {
          hasPool: amenities.some(a => a.toLowerCase().includes('piscine')),
          hasAirConditioning: amenities.some(a => a.toLowerCase().includes('climatisation')),
          hasParking: amenities.some(a => a.toLowerCase().includes('parking')),
          hasKitchen: amenities.some(a => a.toLowerCase().includes('cuisine')),
          hasTerrace: amenities.some(a => a.toLowerCase().includes('terrasse') || a.toLowerCase().includes('balcon')),
        },
        
        // Champs spécifiques par catégorie
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
    console.error('Stack trace:', error.stack);
    
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

// OPTIONNEL: Endpoint POST pour créer une propriété
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
    
    // Créer la propriété
    const newProperty = await prisma.bien.create({
      data: {
        title: body.title,
        category: body.category,
        subType: body.subType || '',
        city: body.city || 'Cotonou',
        address: body.address || '',
        basePrice: body.price || 0,
        currency: body.currency || 'FCFA',
        images: body.images || [],
        isPublished: body.isPublished !== undefined ? body.isPublished : false,
        
        // Champs optionnels
        neighborhood: body.neighborhood,
        size: body.size,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        maxGuests: body.maxGuests,
        
        // Propriétaire par défaut (à adapter selon votre logique)
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
      }
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