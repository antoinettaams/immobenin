// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // IMPORTANT : Ne pas nettoyer les tables existantes (sauf equipements si besoin)
  console.log('🧹 Nettoyage des tables d\'équipements...')
  await prisma.equipementBien.deleteMany({})
  await prisma.equipement.deleteMany({})

  console.log('🔧 Création des équipements essentiels...')
  
  // CRÉATION DES ÉQUIPEMENTS AVEC LES MÊMES CODES QUE DANS LE FORMULAIRE
  const equipementsEssentiels = [
    // ============================================
    // ÉQUIPEMENTS MAISON (codes exacts du formulaire)
    // ============================================
    { code: 'wifi_house', nom: 'Wi-Fi', categorie: 'essential', description: 'Connexion internet', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'kitchen_full', nom: 'Cuisine complète', categorie: 'essential', description: 'Équipements de cuisine', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'refrigerator', nom: 'Réfrigérateur', categorie: 'essential', description: 'Frigo avec congélateur', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'microwave', nom: 'Micro-ondes', categorie: 'comfort', description: 'Four micro-ondes', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'oven', nom: 'Four', categorie: 'comfort', description: 'Four électrique ou gaz', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'dishwasher', nom: 'Lave-vaisselle', categorie: 'comfort', description: 'Machine à laver la vaisselle', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'washing_machine', nom: 'Machine à laver', categorie: 'comfort', description: 'Lave-linge disponible', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'dryer', nom: 'Sèche-linge', categorie: 'comfort', description: 'Sèche-linge', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'air_conditioning', nom: 'Climatisation', categorie: 'comfort', description: 'Air conditionné', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'heating', nom: 'Chauffage', categorie: 'comfort', description: 'Chauffage central', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'tv_streaming', nom: 'TV & Streaming', categorie: 'entertainment', description: 'TV + Netflix/Prime', pourMaison: true, pourBureau: true, pourEvenement: false },
    { code: 'iron', nom: 'Fer à repasser', categorie: 'comfort', description: 'Fer et table à repasser', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'swimming_pool', nom: 'Piscine', categorie: 'luxury', description: 'Piscine privée ou partagée', pourMaison: true, pourBureau: false, pourEvenement: true },
    { code: 'garden', nom: 'Jardin', categorie: 'outdoor', description: 'Jardin privatif', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'balcony', nom: 'Balcon', categorie: 'outdoor', description: 'Balcon avec vue', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'bbq', nom: 'Barbecue', categorie: 'outdoor', description: 'BBQ à gaz ou charbon', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'parking_house', nom: 'Parking', categorie: 'essential', description: 'Place de parking', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'terrace', nom: 'Terrasse', categorie: 'outdoor', description: 'Terrasse meublée', pourMaison: true, pourBureau: false, pourEvenement: false },
    { code: 'smoke_detector', nom: 'Détecteur fumée', categorie: 'security', description: 'Alarme incendie', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'first_aid_kit', nom: 'Trousse premiers soins', categorie: 'security', description: 'Trousse médicale', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'fire_extinguisher', nom: 'Extincteur', categorie: 'security', description: 'Extincteur disponible', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'safe', nom: 'Coffre-fort', categorie: 'security', description: 'Coffre sécurisé', pourMaison: true, pourBureau: true, pourEvenement: false },
    { code: 'gym_access', nom: 'Salle de sport', categorie: 'wellness', description: 'Accès salle fitness', pourMaison: true, pourBureau: true, pourEvenement: false },
    { code: 'elevator', nom: 'Ascenseur', categorie: 'comfort', description: 'Ascenseur immeuble', pourMaison: true, pourBureau: true, pourEvenement: false },

    // ============================================
    // ÉQUIPEMENTS BUREAU (codes exacts du formulaire)
    // ============================================
    { code: 'high_speed_wifi', nom: 'Wi-Fi professionnel', categorie: 'essential', description: 'Fibre optique 1Gbps', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'video_conference', nom: 'Visioconférence', categorie: 'work', description: 'Zoom, Teams, Meet', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'projector_hd', nom: 'Projecteur HD', categorie: 'work', description: 'Projecteur 1080p/4K', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'printer_scanner', nom: 'Imprimante/Scanner', categorie: 'work', description: 'Multifonction couleur', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'smart_tv', nom: 'TV connectée', categorie: 'work', description: 'TV pour présentations', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'phone_system', nom: 'Système téléphonique', categorie: 'work', description: 'Lignes VoIP', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'ergonomic_chair', nom: 'Chaise ergonomique', categorie: 'comfort', description: 'Siège confortable', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'adjustable_desk', nom: 'Bureau réglable', categorie: 'comfort', description: 'Hauteur ajustable', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'whiteboard', nom: 'Tableau blanc', categorie: 'work', description: 'Mur effaçable', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'storage_lockers', nom: 'Casiers', categorie: 'work', description: 'Casiers personnels', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'filing_cabinets', nom: 'Armoires classeurs', categorie: 'work', description: 'Rangement documents', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'meeting_table', nom: 'Table de réunion', categorie: 'work', description: 'Table pour 8+ personnes', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'reception_service', nom: 'Réception', categorie: 'service', description: 'Accueil clients', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'mail_handling', nom: 'Gestion courrier', categorie: 'service', description: 'Réception/envoi courrier', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'cleaning_service', nom: 'Nettoyage', categorie: 'service', description: 'Ménage quotidien', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'it_support', nom: 'Support IT', categorie: 'service', description: 'Assistance technique', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'coffee_service', nom: 'Café offert', categorie: 'service', description: 'Café et thé gratuits', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'parking_office', nom: 'Parking dédié', categorie: 'essential', description: 'Parking réservé', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'meeting_rooms', nom: 'Salles de réunion', categorie: 'work', description: 'Réservables gratuitement', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'break_room', nom: 'Salle de pause', categorie: 'comfort', description: 'Espace détente', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'phone_booth', nom: 'Cabine téléphonique', categorie: 'work', description: 'Pour appels privés', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'printing_station', nom: 'Station impression', categorie: 'work', description: 'Impression/scanner', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'kitchenette', nom: 'Cuisinette', categorie: 'comfort', description: 'Petite cuisine', pourMaison: false, pourBureau: true, pourEvenement: false },
    { code: 'bike_parking', nom: 'Parking vélo', categorie: 'service', description: 'Garage à vélos', pourMaison: true, pourBureau: true, pourEvenement: false },

    // ============================================
    // ÉQUIPEMENTS ÉVÉNEMENT (codes exacts du formulaire)
    // ============================================
    { code: 'sound_system', nom: 'Sono professionnelle', categorie: 'event', description: 'Système audio pro', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'wireless_mics', nom: 'Micros sans fil', categorie: 'event', description: 'Micros cravate et main', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'projector_event', nom: 'Projecteur événement', categorie: 'event', description: 'Projecteur haute lumens', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'large_screens', nom: 'Écrans géants', categorie: 'event', description: 'Écrans LED ou projection', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'stage_lighting', nom: 'Éclairage scénique', categorie: 'event', description: 'Lumières programmables', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'dj_equipment', nom: 'Équipement DJ', categorie: 'event', description: 'Table de mixage, platines', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'stage', nom: 'Scène', categorie: 'event', description: 'Scène modulable', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'dance_floor', nom: 'Piste de danse', categorie: 'event', description: 'Piste éclairée', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'backstage_area', nom: 'Coulisses', categorie: 'event', description: 'Espace coulisses', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'dressing_rooms', nom: 'Vestiaires', categorie: 'event', description: 'Loges artistes', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'loading_access', nom: 'Accès chargement', categorie: 'event', description: 'Quai débarquement', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'storage_space', nom: 'Espace stockage', categorie: 'event', description: 'Stockage matériel', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'event_coordinator', nom: 'Coordinateur', categorie: 'service', description: 'Professionnel dédié', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'catering_kitchen', nom: 'Cuisine catering', categorie: 'service', description: 'Cuisine professionnelle', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'bar_service', nom: 'Service bar', categorie: 'service', description: 'Comptoir et barman', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'coat_check', nom: 'Vestiaire manteaux', categorie: 'service', description: 'Service vestiaire', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'security_staff', nom: 'Sécurité', categorie: 'security', description: 'Agents de sécurité', pourMaison: true, pourBureau: true, pourEvenement: true },
    { code: 'valet_parking', nom: 'Voiturier', categorie: 'service', description: 'Service parking voiturier', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'tables_event', nom: 'Tables', categorie: 'event', description: 'Tables ronde/carrée', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'chairs_event', nom: 'Chaises', categorie: 'event', description: 'Chaises événement', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'linens', nom: 'Nappes et serviettes', categorie: 'event', description: 'Linge de table', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'tableware', nom: 'Vaisselle', categorie: 'event', description: 'Assiettes, couverts, verres', pourMaison: false, pourBureau: false, pourEvenement: true },
    { code: 'podium', nom: 'Podium', categorie: 'event', description: 'Estrade conférencier', pourMaison: false, pourBureau: true, pourEvenement: true },
    { code: 'decorations', nom: 'Décoration', categorie: 'event', description: 'Éléments décoratifs', pourMaison: false, pourBureau: false, pourEvenement: true },
  ]

  for (const equip of equipementsEssentiels) {
    // Utilisez upsert pour créer ou mettre à jour sans erreur
    await prisma.equipement.upsert({
      where: { code: equip.code },
      update: equip, // Met à jour si existe déjà
      create: equip  // Crée si n'existe pas
    })
    console.log(`   ✅ ${equip.nom} (${equip.code})`)
  }

  console.log(`🎉 ${equipementsEssentiels.length} équipements créés/mis à jour`)
  
  // Vérification finale
  const totalEquipements = await prisma.equipement.count()
  console.log(`📊 Total équipements dans la base: ${totalEquipements}`)
  
  // Afficher les statistiques par catégorie
  const maisonCount = await prisma.equipement.count({ where: { pourMaison: true } })
  const bureauCount = await prisma.equipement.count({ where: { pourBureau: true } })
  const eventCount = await prisma.equipement.count({ where: { pourEvenement: true } })
  
  console.log(`🏠 Équipements maison: ${maisonCount}`)
  console.log(`🏢 Équipements bureau: ${bureauCount}`)
  console.log(`🎪 Équipements événement: ${eventCount}`)
  
  console.log('✨ Seed terminé avec succès !')
  console.log('💡 Maintenant, quand vous publiez un bien, les équipements seront trouvés dans la base.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })