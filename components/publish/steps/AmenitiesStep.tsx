"use client";
import React, { useState } from 'react';
import { 
  Wifi, Tv, Wind, Coffee, Utensils, Car, 
  Shield, Key, Flame, Droplets, Thermometer, 
  Volume2, Trees, Dumbbell,
  Smartphone, WashingMachine, Printer,
  Monitor, Music, Video, 
  Building, Users, Briefcase, SquareStack,
  Table, Home, Calendar,
  Headphones, Sofa, Lock, 
  Phone, ParkingCircle, Wine,
  WindIcon as Fan, Palette,
  CheckCircle, XCircle, Microwave as MicrowaveIcon,
  Refrigerator as RefrigeratorIcon
} from 'lucide-react';

interface AmenitiesStepProps {
  data: string[];
  propertyCategory: "house" | "office" | "event";
  onUpdate: (amenities: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Composant pour l'icône de chaise
const ChairIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

// Composant pour l'icône de four
const OvenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

// ============================================
// ÉQUIPEMENTS POUR MAISONS (LOGIQUE TOURISTIQUE)
// ============================================
const houseAmenities = [
  {
    title: 'Équipements essentiels',
    icon: Home,
    items: [
      { id: 'wifi_house', label: 'Wi-Fi', icon: Wifi, description: 'Connexion internet' },
      { id: 'kitchen_full', label: 'Cuisine complète', icon: Utensils, description: 'Équipements de cuisine' },
      { id: 'refrigerator', label: 'Réfrigérateur', icon: RefrigeratorIcon, description: 'Frigo avec congélateur' },
      { id: 'microwave', label: 'Micro-ondes', icon: MicrowaveIcon, description: 'Four micro-ondes' },
      { id: 'oven', label: 'Four', icon: OvenIcon, description: 'Four électrique ou gaz' },
      { id: 'dishwasher', label: 'Lave-vaisselle', icon: WashingMachine, description: 'Machine à laver la vaisselle' },
    ]
  },
  {
    title: 'Confort du logement',
    icon: Shield,
    items: [
      { id: 'washing_machine', label: 'Machine à laver', icon: WashingMachine, description: 'Lave-linge disponible' },
      { id: 'dryer', label: 'Sèche-linge', icon: Wind, description: 'Sèche-linge' },
      { id: 'air_conditioning', label: 'Climatisation', icon: Thermometer, description: 'Air conditionné' },
      { id: 'heating', label: 'Chauffage', icon: Flame, description: 'Chauffage central' },
      { id: 'tv_streaming', label: 'TV & Streaming', icon: Tv, description: 'TV + Netflix/Prime' },
      { id: 'iron', label: 'Fer à repasser', icon: Wind, description: 'Fer et table à repasser' },
    ]
  },
  {
    title: 'Extérieur et loisirs',
    icon: Trees,
    items: [
      { id: 'swimming_pool', label: 'Piscine', icon: Droplets, description: 'Piscine privée ou partagée' },
      { id: 'garden', label: 'Jardin', icon: Trees, description: 'Jardin privatif' },
      { id: 'balcony', label: 'Balcon', icon: Trees, description: 'Balcon avec vue' },
      { id: 'bbq', label: 'Barbecue', icon: Flame, description: 'BBQ à gaz ou charbon' },
      { id: 'parking_house', label: 'Parking', icon: ParkingCircle, description: 'Place de parking' },
      { id: 'terrace', label: 'Terrasse', icon: Trees, description: 'Terrasse meublée' },
    ]
  },
  {
    title: 'Sécurité et services',
    icon: Key,
    items: [
      { id: 'smoke_detector', label: 'Détecteur fumée', icon: Flame, description: 'Alarme incendie' },
      { id: 'first_aid_kit', label: 'Trousse premiers soins', icon: Shield, description: 'Trousse médicale' },
      { id: 'fire_extinguisher', label: 'Extincteur', icon: Flame, description: 'Extincteur disponible' },
      { id: 'safe', label: 'Coffre-fort', icon: Lock, description: 'Coffre sécurisé' },
      { id: 'gym_access', label: 'Salle de sport', icon: Dumbbell, description: 'Accès salle fitness' },
      { id: 'elevator', label: 'Ascenseur', icon: Wind, description: 'Ascenseur immeuble' },
    ]
  }
];

// ============================================
// ÉQUIPEMENTS POUR BUREAUX (ESPACES PROFESSIONNELS)
// ============================================
const officeAmenities = [
  {
    title: 'Technologie professionnelle',
    icon: Wifi,
    items: [
      { id: 'high_speed_wifi', label: 'Wi-Fi professionnel', icon: Wifi, description: 'Fibre optique 1Gbps' },
      { id: 'video_conference', label: 'Visioconférence', icon: Monitor, description: 'Zoom, Teams, Meet' },
      { id: 'projector_hd', label: 'Projecteur HD', icon: Monitor, description: 'Projecteur 1080p/4K' },
      { id: 'printer_scanner', label: 'Imprimante/Scanner', icon: Printer, description: 'Multifonction couleur' },
      { id: 'smart_tv', label: 'TV connectée', icon: Tv, description: 'TV pour présentations' },
      { id: 'phone_system', label: 'Système téléphonique', icon: Phone, description: 'Lignes VoIP' },
    ]
  },
  {
    title: 'Mobilier de bureau',
    icon: Briefcase,
    items: [
      { id: 'ergonomic_chair', label: 'Chaise ergonomique', icon: Sofa, description: 'Siège confortable' },
      { id: 'adjustable_desk', label: 'Bureau réglable', icon: Table, description: 'Hauteur ajustable' },
      { id: 'whiteboard', label: 'Tableau blanc', icon: SquareStack, description: 'Mur effaçable' },
      { id: 'storage_lockers', label: 'Casiers', icon: Lock, description: 'Casiers personnels' },
      { id: 'filing_cabinets', label: 'Armoires classeurs', icon: Shield, description: 'Rangement documents' },
      { id: 'meeting_table', label: 'Table de réunion', icon: Table, description: 'Table pour 8+ personnes' },
    ]
  },
  {
    title: 'Services professionnels',
    icon: Building,
    items: [
      { id: 'reception_service', label: 'Réception', icon: Users, description: 'Accueil clients' },
      { id: 'mail_handling', label: 'Gestion courrier', icon: Shield, description: 'Réception/envoi courrier' },
      { id: 'cleaning_service', label: 'Nettoyage', icon: Shield, description: 'Ménage quotidien' },
      { id: 'it_support', label: 'Support IT', icon: Smartphone, description: 'Assistance technique' },
      { id: 'coffee_service', label: 'Café offert', icon: Coffee, description: 'Café et thé gratuits' },
      { id: 'parking_office', label: 'Parking dédié', icon: ParkingCircle, description: 'Parking réservé' },
    ]
  },
  {
    title: 'Espaces communs',
    icon: Users,
    items: [
      { id: 'meeting_rooms', label: 'Salles de réunion', icon: SquareStack, description: 'Réservables gratuitement' },
      { id: 'break_room', label: 'Salle de pause', icon: Coffee, description: 'Espace détente' },
      { id: 'phone_booth', label: 'Cabine téléphonique', icon: Phone, description: 'Pour appels privés' },
      { id: 'printing_station', label: 'Station impression', icon: Printer, description: 'Impression/scanner' },
      { id: 'kitchenette', label: 'Cuisinette', icon: Utensils, description: 'Petite cuisine' },
      { id: 'bike_parking', label: 'Parking vélo', icon: Car, description: 'Garage à vélos' },
    ]
  }
];

// ============================================
// ÉQUIPEMENTS POUR ÉVÉNEMENTS (SALLES ÉVÉNEMENTIELLES)
// ============================================
const eventAmenities = [
  {
    title: 'Équipements audiovisuels',
    icon: Video,
    items: [
      { id: 'sound_system', label: 'Sono professionnelle', icon: Headphones, description: 'Système audio pro' },
      { id: 'wireless_mics', label: 'Micros sans fil', icon: Volume2, description: 'Micros cravate et main' },
      { id: 'projector_event', label: 'Projecteur événement', icon: Monitor, description: 'Projecteur haute lumens' },
      { id: 'large_screens', label: 'Écrans géants', icon: Tv, description: 'Écrans LED ou projection' },
      { id: 'stage_lighting', label: 'Éclairage scénique', icon: Palette, description: 'Lumières programmables' },
      { id: 'dj_equipment', label: 'Équipement DJ', icon: Music, description: 'Table de mixage, platines' },
    ]
  },
  {
    title: 'Infrastructure événement',
    icon: Building,
    items: [
      { id: 'stage', label: 'Scène', icon: Sofa, description: 'Scène modulable' },
      { id: 'dance_floor', label: 'Piste de danse', icon: Music, description: 'Piste éclairée' },
      { id: 'backstage_area', label: 'Coulisses', icon: Shield, description: 'Espace coulisses' },
      { id: 'dressing_rooms', label: 'Vestiaires', icon: Home, description: 'Loges artistes' },
      { id: 'loading_access', label: 'Accès chargement', icon: Car, description: 'Quai débarquement' },
      { id: 'storage_space', label: 'Espace stockage', icon: Shield, description: 'Stockage matériel' },
    ]
  },
  {
    title: 'Services événementiels',
    icon: Calendar,
    items: [
      { id: 'event_coordinator', label: 'Coordinateur', icon: Users, description: 'Professionnel dédié' },
      { id: 'catering_kitchen', label: 'Cuisine catering', icon: Utensils, description: 'Cuisine professionnelle' },
      { id: 'bar_service', label: 'Service bar', icon: Wine, description: 'Comptoir et barman' },
      { id: 'coat_check', label: 'Vestiaire manteaux', icon: Shield, description: 'Service vestiaire' },
      { id: 'security_staff', label: 'Sécurité', icon: Lock, description: 'Agents de sécurité' },
      { id: 'valet_parking', label: 'Voiturier', icon: Car, description: 'Service parking voiturier' },
    ]
  },
  {
    title: 'Mobilier événement',
    icon: Table,
    items: [
      { id: 'tables_event', label: 'Tables', icon: Table, description: 'Tables ronde/carrée' },
      { id: 'chairs_event', label: 'Chaises', icon: ChairIcon, description: 'Chaises événement' },
      { id: 'linens', label: 'Nappes et serviettes', icon: Shield, description: 'Linge de table' },
      { id: 'tableware', label: 'Vaisselle', icon: Utensils, description: 'Assiettes, couverts, verres' },
      { id: 'podium', label: 'Podium', icon: Users, description: 'Estrade conférencier' },
      { id: 'decorations', label: 'Décoration', icon: Palette, description: 'Éléments décoratifs' },
    ]
  }
];

export const AmenitiesStep: React.FC<AmenitiesStepProps> = ({
  data,
  propertyCategory,
  onUpdate,
  onNext,
  onBack,
}) => {
  console.log("🔍 AmenitiesStep - Catégorie reçue:", propertyCategory);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(data);
  const [searchTerm, setSearchTerm] = useState('');

  const getAmenityCategories = () => {
    switch(propertyCategory) {
      case "house":
        return houseAmenities;
      case "office":
        return officeAmenities;
      case "event":
        return eventAmenities;
      default:
        return houseAmenities;
    }
  };

  const amenityCategories = getAmenityCategories();

  const toggleAmenity = (amenityId: string) => {
    const newSelection = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter(id => id !== amenityId)
      : [...selectedAmenities, amenityId];
    
    setSelectedAmenities(newSelection);
    onUpdate(newSelection);
  };

  const filteredCategories = amenityCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const getTitle = () => {
    switch(propertyCategory) {
      case "house":
        return "Quels équipements proposez-vous dans votre logement ?";
      case "office":
        return "Quels équipements et services professionnels ?";
      case "event":
        return "Quels équipements événementiels sont inclus ?";
      default:
        return "Quels équipements proposez-vous ?";
    }
  };

  const getDescription = () => {
    switch(propertyCategory) {
      case "house":
        return "Les voyageurs recherchent ces équipements pour leur confort";
      case "office":
        return "Ces services aident les professionnels à travailler efficacement";
      case "event":
        return "Ces équipements sont essentiels pour organiser des événements réussis";
      default:
        return "Sélectionnez les équipements disponibles";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
      {/* En-tête avec indication de catégorie */}
      <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium">
            {propertyCategory === "house" && "🏠 Logement"}
            {propertyCategory === "office" && "🏢 Bureau"}
            {propertyCategory === "event" && "🎪 Événement"}
          </div>
          <span className="text-xs sm:text-sm text-gray-500">• Équipements spécifiques</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-3">
          {getTitle()}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          {getDescription()}
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6 sm:mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={`Rechercher un équipement...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 sm:p-4 pl-10 sm:pl-12 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none text-sm sm:text-base"
          />
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Compteur d'équipements */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            selectedAmenities.length > 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <span className="font-bold text-sm sm:text-lg">{selectedAmenities.length}</span>
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm sm:text-base">Équipements sélectionnés</div>
            <div className="text-xs sm:text-sm text-gray-500">
              {selectedAmenities.length === 0 ? "Aucun équipement sélectionné" :
               `${selectedAmenities.length} équipement${selectedAmenities.length > 1 ? 's' : ''} choisi${selectedAmenities.length > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
        {selectedAmenities.length > 0 && (
          <button
            onClick={() => {
              setSelectedAmenities([]);
              onUpdate([]);
            }}
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium px-2 sm:px-3 py-1 sm:py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tout effacer</span>
            <span className="sm:hidden">Effacer</span>
          </button>
        )}
      </div>

      {/* Liste des équipements par catégorie */}
      <div className="space-y-8 sm:space-y-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.title}>
                {/* En-tête de catégorie */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {category.items.length} option{category.items.length > 1 ? 's' : ''} disponible{category.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Grille d'équipements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {category.items.map((item) => {
                    const isSelected = selectedAmenities.includes(item.id);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleAmenity(item.id)}
                        className={`
                          p-3 sm:p-4 md:p-5 border rounded-lg sm:rounded-xl text-left transition-colors
                          hover:border-gray-300
                          ${isSelected 
                            ? 'border-brand bg-brand/5' 
                            : 'border-gray-200 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`
                            p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0
                            ${isSelected ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600'}
                          `}>
                            {item.id === 'oven' ? (
                              <OvenIcon />
                            ) : item.id === 'chairs_event' ? (
                              <ChairIcon />
                            ) : (
                              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">{item.label}</h3>
                              {isSelected && (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-brand flex items-center justify-center flex-shrink-0 ml-1 sm:ml-2">
                                  <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Aucun équipement trouvé</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Aucun équipement ne correspond à "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm sm:text-base text-brand hover:text-brand-dark font-medium"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
};