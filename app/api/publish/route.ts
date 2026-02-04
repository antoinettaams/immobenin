// app/api/publish/route.ts - CORRIGÉ COMPLET
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

// Fonction d'upload améliorée avec gestion des erreurs
async function uploadImage(file: File, index: number, bienId?: string): Promise<string> {
  try {
    console.log(`📤 Traitement image ${index + 1}:`, {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      isFileInstance: file instanceof File,
      hasArrayBuffer: typeof file?.arrayBuffer === 'function'
    });

    // Vérifier si c'est un objet File valide
    if (!file || !(file instanceof File) || typeof file.arrayBuffer !== 'function') {
      console.error(`❌ Image ${index + 1}: Objet File invalide`);
      throw new Error('Objet File invalide');
    }

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
  } catch (error: any) {
    console.error(`❌ Erreur upload image ${index + 1}:`, error.message);
    throw error;
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
    
    // CORRECTION CRITIQUE : Vérifier et convertir les fichiers
    const photoEntries = formData.getAll('photos');
    
    // Filtrer et convertir les entrées valides en File
    const photoFiles: File[] = [];
    
    console.log('📤 Photos reçues (brutes):', photoEntries.length);
    
    // SOLUTION ALTERNATIVE PLUS SÛRE
for (let i = 0; i < photoEntries.length; i++) {
  const entry = photoEntries[i];
  const entryAny = entry as any;
  
  console.log(`\n🔍 Photo ${i + 1}:`, {
    type: typeof entry,
    name: entryAny?.name || 'N/A',
    size: entryAny?.size || 'N/A',
  });
  
  // Vérification simple
  if (entry && typeof entry === 'object' && 'name' in entryAny && 'size' in entryAny) {
    try {
      // Essayer de créer un File à partir de l'entrée
      let file: File;
      
      // Vérifier si on peut accéder à arrayBuffer
      if (entryAny.arrayBuffer && typeof entryAny.arrayBuffer === 'function') {
        const buffer = Buffer.from(await entryAny.arrayBuffer());
        file = new File([buffer], entryAny.name || `image_${i}.jpg`, {
          type: entryAny.type || 'image/jpeg'
        });
      } else if (entry instanceof File) {
        // Si c'est déjà un File
        file = entry;
      } else {
        // Si on ne peut pas récupérer les données, passer à la suivante
        console.warn(`⚠️ Photo ${i + 1}: impossible de traiter`);
        continue;
      }
      
      if (file.size > 0) {
        photoFiles.push(file);
        console.log(`✅ Photo ${i + 1} validée: ${file.name}`);
      }
    } catch (error: any) {
      console.error(`❌ Photo ${i + 1} erreur:`, error.message);
    }
  }
}
    
    console.log('\n📤 Publication - Informations:');
    console.log('  • Titre:', data.title);
    console.log('  • Catégorie:', data.housingType?.category);
    console.log('  • Ville:', data.location?.city);
    console.log('  • Photos validées:', photoFiles.length, 'sur', photoEntries.length);
    
    if (photoFiles.length > 0) {
      console.log('  • Noms des photos:');
      photoFiles.forEach((file, i) => {
        console.log(`      ${i + 1}. ${file.name} (${(file.size / 1024).toFixed(1)} KB, ${file.type})`);
      });
    }
    
    console.log('  • Cloudinary:', isCloudinaryConfigured() ? '✅ ACTIF' : '❌ INACTIF (base64)');

    // Créer un tableau d'URLs placeholder temporaires
    const placeholderUrls = photoFiles.length > 0 
      ? Array(photoFiles.length).fill('https://via.placeholder.com/800x600/cccccc/969696?text=Chargement...')
      : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

    console.log('📝 Création du bien...');
    
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
      
      // Images temporaires (placeholders)
      images: placeholderUrls,
      
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
    
    let imageUrls: string[] = [];
    
    if (photoFiles.length > 0) {
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
          console.error(`   ❌ Échec upload: ${error.message}`);
          
          try {
            // Fallback base64
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = buffer.toString('base64');
            const fallbackUrl = `data:${file.type};base64,${base64}`;
            console.log(`   🔄 Fallback base64 activé`);
            return fallbackUrl;
          } catch (fallbackError: any) {
            console.error(`   ❌ Fallback échoué: ${fallbackError.message}`);
            // Dernier recours : placeholder
            return 'https://via.placeholder.com/800x600/cccccc/969696?text=Image+non+disponible';
          }
        }
      });

      imageUrls = await Promise.all(uploadPromises);
    } else {
      console.log('ℹ️ Aucune photo à uploader');
      imageUrls = placeholderUrls;
    }

    // Vérifier les doublons
    const uniqueUrls = [...new Set(imageUrls)];
    if (uniqueUrls.length !== imageUrls.length) {
      console.warn(`⚠️ ATTENTION: ${imageUrls.length - uniqueUrls.length} doublon(s) détecté(s)!`);
    }

    console.log(`\n📊 RÉSUMÉ UPLOAD:`);
    console.log(`✅ Total uploadées: ${imageUrls.length} images`);
    console.log(`🎯 Uniques: ${uniqueUrls.length} images`);
    
    if (imageUrls.length > 0) {
      console.log(`📸 URLs générées:`);
      imageUrls.forEach((url, index) => {
        const displayUrl = url.length > 70 ? url.substring(0, 70) + '...' : url;
        console.log(`   ${index + 1}. ${displayUrl}`);
      });
    }

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
      
      try {
        const allEquipements = await prisma.equipement.findMany({
          select: { id: true, nom: true, code: true }
        });
        
        console.log('📋 Équipements disponibles en base:', allEquipements.length);
        
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
            
            if (equipement) {
              const existingLink = await prisma.equipementBien.findFirst({
                where: { bienId: bienFinal.id, equipementId: equipement.id }
              });
              
              if (!existingLink) {
                await prisma.equipementBien.create({
                  data: { bienId: bienFinal.id, equipementId: equipement.id }
                });
                addedEquipements.push(equipement.nom);
              }
            } else {
              notFoundEquipements.push(normalizedInput);
            }
          } catch (error: any) {
            console.error(`⚠️ Erreur avec équipement ${amenityInput}:`, error.message);
          }
        }
        
        console.log(`\n📊 RÉSUMÉ ÉQUIPEMENTS:`);
        console.log(`✅ ${addedEquipements.length} équipement(s) ajouté(s)`);
        if (notFoundEquipements.length > 0) {
          console.log(`❌ ${notFoundEquipements.length} équipement(s) non trouvé(s):`, notFoundEquipements);
        }
      } catch (error: any) {
        console.error('⚠️ Erreur lors de l\'ajout des équipements:', error.message);
      }
    }

    console.log('\n🎉 PUBLICATION RÉUSSIE !');
    console.log(`📊 Récapitulatif:`);
    console.log(`   • ID: ${bienFinal.id}`);
    console.log(`   • Titre: ${bienFinal.title}`);
    console.log(`   • Catégorie: ${bienFinal.category}`);
    console.log(`   • Images: ${imageUrls.length}`);
    console.log(`   • Cloudinary: ${isCloudinaryConfigured() ? 'Utilisé' : 'Base64'}`);

    return NextResponse.json({
      success: true,
      message: 'Bien publié avec succès',
      data: { 
        id: bienFinal.id,
        title: bienFinal.title,
        imagesCount: imageUrls.length,
        category: bienFinal.category,
        cloudinaryUsed: isCloudinaryConfigured()
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
    } else if (error.message.includes('arrayBuffer is not a function')) {
      errorMessage = 'Erreur dans le traitement des images. Veuillez réessayer.';
      statusCode = 400;
    } else if (error.message.includes('prisma')) {
      errorMessage = 'Erreur base de données. Veuillez réessayer.';
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