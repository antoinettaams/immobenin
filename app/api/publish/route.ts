// app/api/publish/route.ts - CORRIGÉ COMPLET
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fonction pour vérifier la configuration Cloudinary
function isCloudinaryConfigured(): boolean {
  const hasConfig = !!(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET
  );
  
  if (!hasConfig) {
    console.warn('⚠️ Cloudinary non configuré - fallback vers base64');
    console.warn('   Vérifiez vos variables CLOUDINARY_* dans .env.local');
  }
  
  return hasConfig;
}

// Fonction d'upload améliorée
async function uploadImage(file: File, index: number, bienId?: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (!isCloudinaryConfigured()) {
    // Fallback vers base64
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
  }
  
  try {
    // Import dynamique pour éviter les erreurs au build
    const { uploadBufferToCloudinary } = await import('@/lib/cloudinary');
    return await uploadBufferToCloudinary(buffer, {
      filename: file.name,
      index: index,
      bienId: bienId
    });
  } catch (error: any) {
    console.error('❌ Erreur Cloudinary, fallback base64:', error.message);
    
    // Fallback vers base64
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Début publication...');
  
  try {
    console.log('🔧 Configuration Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configuré' : '❌ Manquant',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Configuré' : '❌ Manquant',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ (présent)' : '❌ Manquant',
    });
    
    const formData = await request.formData();
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    const photoFiles = formData.getAll('photos') as File[];

    console.log('📤 Publication - Informations:');
    console.log('  • Titre:', data.title);
    console.log('  • Catégorie:', data.housingType?.category);
    console.log('  • Ville:', data.location?.city);
    console.log('  • Photos reçues:', photoFiles.length);
    console.log('  • Noms des photos:', photoFiles.map(f => f.name));
    console.log('  • Cloudinary:', isCloudinaryConfigured() ? '✅ ACTIF' : '❌ INACTIF (base64)');

    // Créer d'abord le bien sans images (pour avoir un ID)
    console.log('📝 Création temporaire du bien pour obtenir un ID...');
    
    const bienDataTemp: any = {
      // Informations de base
      title: data.title || 'Nouveau bien',
      category: data.housingType?.category || 'HOUSE',
      subType: data.housingType?.subType || 'Appartement',
      privacy: data.housingType?.privacy || null,
      
      // Localisation
      country: data.location?.country || 'Bénin',
      city: data.location?.city || 'Cotonou',
      neighborhood: data.location?.neighborhood || '',
      address: data.location?.address || 'Adresse non spécifiée',
      postalCode: data.location?.postalCode || '',
      latitude: data.location?.latitude ? parseFloat(data.location.latitude) : null,
      longitude: data.location?.longitude ? parseFloat(data.location.longitude) : null,
      
      // Caractéristiques communes
      size: data.basics?.size ? parseInt(data.basics.size) : null,
      floors: data.basics?.floors ? parseInt(data.basics.floors) : null,
      
      // Champs spécifiques maison
      maxGuests: data.basics?.maxGuests ? parseInt(data.basics.maxGuests) : null,
      bedrooms: data.basics?.bedrooms ? parseInt(data.basics.bedrooms) : null,
      beds: data.basics?.beds ? parseInt(data.basics.beds) : null,
      bathrooms: data.basics?.bathrooms ? parseInt(data.basics.bathrooms) : null,
      privateEntrance: data.basics?.privateEntrance || false,
      
      // Champs spécifiques bureau
      employees: data.basics?.employees ? parseInt(data.basics.employees) : null,
      offices: data.basics?.offices ? parseInt(data.basics.offices) : null,
      meetingRooms: data.basics?.meetingRooms ? parseInt(data.basics.meetingRooms) : null,
      workstations: data.basics?.workstations ? parseInt(data.basics.workstations) : null,
      
      // Champs spécifiques événement
      eventCapacity: data.basics?.eventCapacity ? parseInt(data.basics.eventCapacity) : null,
      parkingSpots: data.basics?.parkingSpots ? parseInt(data.basics.parkingSpots) : null,
      wheelchairAccessible: data.basics?.wheelchairAccessible || false,
      hasStage: data.basics?.hasStage || false,
      hasSoundSystem: data.basics?.hasSoundSystem || false,
      hasProjector: data.basics?.hasProjector || false,
      minBookingHours: data.basics?.minBookingHours ? parseInt(data.basics.minBookingHours) : null,
      
      // Prix
      basePrice: data.price?.basePrice ? parseFloat(data.price.basePrice) : null,
      currency: data.price?.currency || 'FCFA',
      weeklyDiscount: data.price?.weeklyDiscount ? parseFloat(data.price.weeklyDiscount) : 0,
      monthlyDiscount: data.price?.monthlyDiscount ? parseFloat(data.price.monthlyDiscount) : 0,
      cleaningFee: data.price?.cleaningFee ? parseFloat(data.price.cleaningFee) : 0,
      extraGuestFee: data.price?.extraGuestFee ? parseFloat(data.price.extraGuestFee) : 0,
      securityDeposit: data.price?.securityDeposit ? parseFloat(data.price.securityDeposit) : 0,
      
      // Règles
      checkInTime: data.rules?.checkInTime || '15:00',
      checkOutTime: data.rules?.checkOutTime || '11:00',
      childrenAllowed: data.rules?.childrenAllowed !== false,
      
      // Images temporaires
      images: [],
      
      // Propriétaire
      proprietaire: {
        connectOrCreate: {
          where: { email: data.onboarding?.email || 'default@example.com' },
          create: {
            telephone: data.onboarding?.telephone || '00000000',
            email: data.onboarding?.email || 'default@example.com',
            nom: data.onboarding?.nom || 'Propriétaire Test',
          }
        }
      },
      
      // Statut temporaire
      isPublished: false,
    };

    // Créer le bien temporairement
    const bienTemporaire = await prisma.bien.create({
      data: bienDataTemp
    });

    console.log(`✅ Bien temporaire créé avec ID: ${bienTemporaire.id}`);

    // Upload des images avec l'ID du bien
    console.log('📤 Début upload des images...');
    const uploadPromises = photoFiles.map(async (file, index) => {
      console.log(`\n📤 Upload ${index + 1}/${photoFiles.length}:`);
      console.log(`   📄 Nom: ${file.name}`);
      console.log(`   📊 Taille: ${(file.size / 1024).toFixed(1)} KB`);
      console.log(`   🏷️  Type: ${file.type}`);
      
      try {
        const url = await uploadImage(file, index, bienTemporaire.id.toString());
        console.log(`   ✅ Réussi: ${url.substring(0, 80)}...`);
        return url;
      } catch (error: any) {
        console.error(`   ❌ Échec: ${error.message}`);
        
        // Fallback base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const fallbackUrl = `data:${file.type};base64,${base64}`;
        console.log(`   🔄 Fallback base64 activé`);
        return fallbackUrl;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Vérifier les doublons
    const uniqueUrls = [...new Set(imageUrls)];
    if (uniqueUrls.length !== imageUrls.length) {
      console.warn(`⚠️ ATTENTION: ${imageUrls.length - uniqueUrls.length} doublon(s) détecté(s)!`);
    }

    console.log(`\n📊 RÉSUMÉ UPLOAD:`);
    console.log(`✅ Total uploadées: ${imageUrls.length} images`);
    console.log(`🎯 Uniques: ${uniqueUrls.length} images`);
    imageUrls.forEach((url, index) => {
      console.log(`   ${index + 1}: ${url.substring(0, 70)}...`);
    });

    if (imageUrls.length === 0) {
      console.warn('⚠️ Aucune image traitée - ajout placeholder');
      imageUrls.push('https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin');
    }

    // Mettre à jour le bien avec les images réelles
    console.log(`\n🔄 Mise à jour du bien ${bienTemporaire.id} avec les images...`);
    
    const bienFinal = await prisma.bien.update({
      where: { id: bienTemporaire.id },
      data: {
        images: imageUrls,
        isPublished: true
      }
    });

    console.log(`✅ Bien finalisé avec ID: ${bienFinal.id}`);
    
    // Créer la description
    if (data.description?.summary) {
      try {
        await prisma.description.create({
          data: {
            summary: data.description.summary || '',
            spaceDescription: data.description.spaceDescription || '',
            guestAccess: data.description.guestAccess || '',
            neighborhoodInfo: data.description.neighborhood || '',
            bienId: bienFinal.id
          }
        });
        console.log(`📝 Description créée pour le bien ${bienFinal.id}`);
      } catch (descError: any) {
        console.error('⚠️ Erreur description (non critique):', descError.message);
      }
    }
    
    // AJOUT DES ÉQUIPEMENTS
    if (data.amenities && Array.isArray(data.amenities)) {
      console.log(`🔧 Ajout de ${data.amenities.length} équipement(s)`);
      console.log('📋 Équipements reçus:', data.amenities);
      
      const allEquipements = await prisma.equipement.findMany({
        select: { id: true, nom: true, code: true }
      });
      console.log('📋 Équipements disponibles en base:', allEquipements.map(e => ({ nom: e.nom, code: e.code })));
      
      const addedEquipements: string[] = [];
      const notFoundEquipements: string[] = [];
      
      // Mapping des noms communs
      const commonMappings: Record<string, string> = {
        'wifi': 'wifi_house',
        'wi-fi': 'wifi_house',
        'Wi-Fi': 'wifi_house',
        'climatisation': 'air_conditioning',
        'Climatisation': 'air_conditioning',
        'air conditionné': 'air_conditioning',
        'piscine': 'swimming_pool',
        'Piscine': 'swimming_pool',
        'jardin': 'garden',
        'Jardin': 'garden',
        'parking': 'parking_house',
        'Parking': 'parking_house',
        'terrasse': 'terrace',
        'Terrasse': 'terrace',
        'balcon': 'balcony',
        'Balcon': 'balcony',
        'cuisine': 'kitchen_full',
        'Cuisine': 'kitchen_full',
        'machine à laver': 'washing_machine',
        'Machine à laver': 'washing_machine',
        'tv': 'tv_streaming',
        'TV': 'tv_streaming',
        'télévision': 'tv_streaming',
        'ascenseur': 'elevator',
        'Ascenseur': 'elevator',
        'internet': 'wifi_house',
        'air conditioning': 'air_conditioning',
        'swimming pool': 'swimming_pool',
        'terrace': 'terrace',
        'balcony': 'balcony',
        'kitchen': 'kitchen_full',
        'washing machine': 'washing_machine',
        'television': 'tv_streaming',
        'elevator': 'elevator',
        'fibre optique': 'high_speed_wifi',
        'visioconférence': 'video_conference',
        'projecteur': 'projector_hd',
        'imprimante': 'printer_scanner',
        'sono': 'sound_system',
        'micro': 'wireless_mics',
        'scène': 'stage',
        'piste de danse': 'dance_floor'
      };
      
      for (const amenityInput of data.amenities) {
        try {
          console.log(`\n🔍 Recherche équipement: "${amenityInput}"`);
          
          const normalizedInput = amenityInput.trim();
          let equipement = null;
          
          // Chercher par code
          equipement = allEquipements.find(e => 
            e.code.toLowerCase() === normalizedInput.toLowerCase()
          );
          
          // Chercher par nom
          if (!equipement) {
            equipement = allEquipements.find(e => 
              e.nom.toLowerCase() === normalizedInput.toLowerCase()
            );
          }
          
          // Mapping
          if (!equipement && commonMappings[normalizedInput.toLowerCase()]) {
            const mappedCode = commonMappings[normalizedInput.toLowerCase()];
            equipement = allEquipements.find(e => e.code === mappedCode);
          }
          
          // Recherche partielle
          if (!equipement) {
            equipement = allEquipements.find(e => 
              e.nom.toLowerCase().includes(normalizedInput.toLowerCase()) ||
              e.code.toLowerCase().includes(normalizedInput.toLowerCase())
            );
          }
          
          if (equipement) {
            console.log(`   ✅ Équipement trouvé: ${equipement.nom} (${equipement.code})`);
            
            const existingLink = await prisma.equipementBien.findFirst({
              where: { bienId: bienFinal.id, equipementId: equipement.id }
            });
            
            if (!existingLink) {
              await prisma.equipementBien.create({
                data: { bienId: bienFinal.id, equipementId: equipement.id }
              });
              addedEquipements.push(equipement.nom);
            } else {
              addedEquipements.push(equipement.nom);
            }
          } else {
            console.log(`   ❌ Équipement non trouvé: "${normalizedInput}"`);
            notFoundEquipements.push(normalizedInput);
            
            // Créer l'équipement manquant
            try {
              const newEquipement = await prisma.equipement.create({
                data: {
                  nom: normalizedInput,
                  code: normalizedInput.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
                  description: `Équipement: ${normalizedInput}`,
                  categorie: 'other',
                  pourMaison: data.housingType?.category === 'HOUSE',
                  pourBureau: data.housingType?.category === 'OFFICE',
                  pourEvenement: data.housingType?.category === 'EVENT'
                }
              });
              
              await prisma.equipementBien.create({
                data: { bienId: bienFinal.id, equipementId: newEquipement.id }
              });
              
              addedEquipements.push(newEquipement.nom);
            } catch (createError: any) {
              console.error(`   ❌ Impossible de créer l'équipement:`, createError.message);
            }
          }
        } catch (error: any) {
          console.error(`   ⚠️ Erreur avec équipement ${amenityInput}:`, error.message);
        }
      }
      
      console.log(`\n📊 RÉSUMÉ ÉQUIPEMENTS:`);
      console.log(`✅ ${addedEquipements.length} équipement(s) ajouté(s)`);
      if (notFoundEquipements.length > 0) {
        console.log(`❌ ${notFoundEquipements.length} équipement(s) non trouvé(s):`, notFoundEquipements);
      }
    }

    // Récupérer le bien complet pour vérification
    const bienComplet = await prisma.bien.findUnique({
      where: { id: bienFinal.id },
      select: { images: true, title: true, category: true }
    });

    console.log('\n🎉 PUBLICATION RÉUSSIE !');
    console.log(`📊 Récapitulatif:`);
    console.log(`   • ID: ${bienFinal.id}`);
    console.log(`   • Titre: ${bienComplet?.title}`);
    console.log(`   • Catégorie: ${bienComplet?.category}`);
    console.log(`   • Images: ${bienComplet?.images?.length || 0}`);
    if (bienComplet?.images) {
      bienComplet.images.forEach((url, i) => {
        console.log(`     ${i+1}. ${url.substring(0, 60)}...`);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Bien publié avec succès',
      data: { 
        id: bienFinal.id,
        title: bienFinal.title,
        imagesCount: imageUrls.length,
        category: bienFinal.category,
        cloudinaryUsed: isCloudinaryConfigured(),
        imageUrls: imageUrls.slice(0, 3) // Retourner quelques URLs pour debug
      }
    });
    
  } catch (error: any) {
    console.error('❌ ERREUR DÉTAILLÉE publication:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    let errorMessage = 'Erreur lors de la publication';
    let statusCode = 500;
    
    if (error.message.includes('Unique constraint')) {
      errorMessage = 'Un propriétaire avec cet email existe déjà.';
      statusCode = 409;
    } else if (error.message.includes('Foreign key constraint')) {
      errorMessage = 'Erreur de référence (propriétaire non trouvé).';
      statusCode = 400;
    } else if (error.message.includes('cloud_name')) {
      errorMessage = 'Cloudinary non configuré. Images sauvegardées en local.';
      statusCode = 500;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}