"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search as SearchIcon, Map, Wifi, Home, Building2, Calendar, Users, Bath, Bed, X, Star, Heart, Share2, Phone, Mail, User, Clock, Shield, Check, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchProps {
  onBack: () => void;  
}

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  city: string;
  price: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  img: string;
  wifi: boolean;
  amenities: string[];
}

const properties: Property[] = [
  { 
    id: 1, 
    title: "Villa des Cocotiers", 
    type: "Maison", 
    location: "Haie Vive", 
    city: "Cotonou",
    price: 45000, 
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    img: "https://picsum.photos/600/400?random=101",
    wifi: true,
    amenities: ["Piscine", "Climatisation", "Parking", "Jardin", "Cuisine équipée"]
  },
  { 
    id: 2, 
    title: "Studio Moderne", 
    type: "Appartement", 
    location: "Abomey-Calavi", 
    city: "Abomey-Calavi",
    price: 15000, 
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    img: "https://picsum.photos/600/400?random=102",
    wifi: true,
    amenities: ["Cuisine équipée", "Climatisation", "Ascenseur", "Balcon"]
  },
  { 
    id: 3, 
    title: "Loft Artistique", 
    type: "Appartement", 
    location: "Porto-Novo", 
    city: "Porto-Novo",
    price: 25000, 
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    img: "https://picsum.photos/600/400?random=103",
    wifi: true,
    amenities: ["Terrasse", "Climatisation", "Parking", "Cuisine américaine"]
  },
  { 
    id: 4, 
    title: "Bureau d'affaires", 
    type: "Bureau", 
    location: "Fidjrossè", 
    city: "Cotonou",
    price: 10000, 
    capacity: 10,
    bedrooms: 0,
    bathrooms: 2,
    img: "https://picsum.photos/600/400?random=104",
    wifi: true,
    amenities: ["Salle réunion", "Climatisation", "Parking", "Secrétariat", "Imprimante"]
  },
  { 
    id: 5, 
    title: "Salle Événement Le Palmier", 
    type: "Salle événement", 
    location: "Ouidah", 
    city: "Ouidah",
    price: 60000, 
    capacity: 200,
    bedrooms: 0,
    bathrooms: 5,
    img: "https://picsum.photos/600/400?random=105",
    wifi: true,
    amenities: ["Sonorisation", "Cuisine", "Parking", "Éclairage", "Scène"]
  },
  { 
    id: 6, 
    title: "Appartement vue mer", 
    type: "Appartement", 
    location: "Zone des Ambassades", 
    city: "Cotonou",
    price: 80000, 
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    img: "https://picsum.photos/600/400?random=106",
    wifi: true,
    amenities: ["Vue mer", "Piscine", "Climatisation", "Parking sécurisé", "Gym"]
  },
];

export const Search: React.FC<SearchProps> = ({ onBack }) => {
  const router = useRouter();
  const [location, setLocation] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Numéro WhatsApp (à modifier plus tard avec votre vrai numéro)
  const whatsappNumber = "229XXXXXXXX"; // Remplacez XXXXXXXXX par votre numéro réel
  const whatsappMessage = (property: Property) => `Bonjour ! Je suis intéressé(e) par la réservation de "${property.title}" à ${property.location}, ${property.city} pour ${property.capacity} personne(s). Prix : ${property.price.toLocaleString("fr-FR")} FCFA/nuit. Pouvez-vous me donner plus d'informations ?`;

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBackClick = (): void => {
    onBack();
  };

  const handlePropertyClick = (property: Property): void => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    // Empêcher le défilement du body quand la modale est ouverte
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = (): void => {
    setSelectedProperty(null);
    document.body.style.overflow = 'auto';
  };

  const handleWhatsAppReservation = (property: Property, e: React.MouseEvent): void => {
    e.stopPropagation();
    
    // Encode le message pour l'URL
    const encodedMessage = encodeURIComponent(whatsappMessage(property));
    
    // Crée l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Ouvre WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
    
    // Ferme la modale après redirection
    handleCloseModal();
  };

  const handleSearchSubmit = (): void => {
    setIsSearching(true);
    filterProperties();
  };

  const handleShowAllProperties = (): void => {
    setLocation("");
    setPropertyType("");
    setGuests("");
    setFilteredProperties(properties);
    setIsSearching(false);
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (location.trim().toLowerCase() === "cotonou") {
      filtered = filtered.filter(property => 
        property.city.toLowerCase() === "cotonou"
      );
    } else if (location.trim()) {
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(location.toLowerCase()) ||
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (propertyType.trim()) {
      const type = propertyType.toLowerCase();
      if (type === "appartement" || type === "appartements") {
        filtered = filtered.filter(property => property.type === "Appartement");
      } else if (type === "maison" || type === "maisons") {
        filtered = filtered.filter(property => property.type === "Maison");
      } else if (type === "bureau" || type === "bureaux") {
        filtered = filtered.filter(property => property.type === "Bureau");
      } else if (type === "salle" || type === "salles") {
        filtered = filtered.filter(property => property.type === "Salle événement");
      } else {
        filtered = filtered.filter(property => 
          property.type.toLowerCase().includes(type)
        );
      }
    }

    if (guests.trim()) {
      const guestNumber = parseInt(guests);
      if (!isNaN(guestNumber) && guestNumber > 0) {
        filtered = filtered.filter(property => property.capacity >= guestNumber);
      }
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    if (location || propertyType || guests) {
      filterProperties();
      setIsSearching(true);
    }
  }, [location, propertyType, guests]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const activeFiltersCount = [
    location.trim(), 
    propertyType.trim(), 
    guests.trim()
  ].filter(Boolean).length;

  // Simuler d'autres images pour la galerie
  const propertyImages = selectedProperty ? [
    selectedProperty.img,
    `https://picsum.photos/600/400?random=${selectedProperty.id + 100}`,
    `https://picsum.photos/600/400?random=${selectedProperty.id + 200}`,
    `https://picsum.photos/600/400?random=${selectedProperty.id + 300}`
  ] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Barre de recherche fixe en haut sur mobile */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-200 md:hidden">
        <div className="container mx-auto px-4 py-3">
          {/* Bouton Retour et Voir tout en ligne */}
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handleBackClick} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
              aria-label="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Retour</span>
            </button>
            
            {isSearching && (
              <button 
                onClick={handleShowAllProperties}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:border-brand hover:bg-brand/5 transition-colors text-sm font-semibold"
                aria-label="Voir toutes les propriétés"
              >
                Voir tout
              </button>
            )}
          </div>
          
          {/* Barre de recherche mobile compacte */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Destination..." 
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Destination"
              />
            </div>
            
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Type..." 
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Type de bien"
              />
            </div>
            
            <button 
              onClick={handleSearchSubmit}
              className="bg-brand text-white p-3 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center"
              aria-label="Rechercher"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Champ voyageurs */}
          <div className="mb-2">
            <input 
              type="number" 
              min="1"
              placeholder="Nombre de voyageurs" 
              className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl outline-none placeholder:text-gray-400 text-sm"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Nombre de voyageurs"
            />
          </div>
          
          {/* Filtres actifs compacts */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
                </span>
                <button 
                  onClick={handleShowAllProperties}
                  className="text-brand text-xs font-medium hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Effacer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version desktop (inchangée) */}
      <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header & Search Bar desktop */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-20 bg-white/95 backdrop-blur-sm z-30 py-4 -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={handleBackClick} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 self-start md:self-auto order-1 md:order-none"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold md:hidden">Retour</span>
          </button>
          
          <div className="flex-1 w-full md:max-w-2xl mx-auto order-3 md:order-none mt-4 md:mt-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center border-2 border-gray-200 hover:border-brand transition-colors shadow-sm rounded-2xl sm:rounded-full p-3 sm:p-2">
              {/* Destination */}
              <div className="flex-1 pb-3 sm:pb-0 sm:pr-4 border-b sm:border-b-0 sm:border-r border-gray-200 mb-3 sm:mb-0">
                <div className="text-xs font-bold text-gray-800 mb-1">Destination</div>
                <input 
                  type="text" 
                  placeholder="Ex: Cotonou, Porto-Novo..." 
                  className="w-full text-base text-gray-800 outline-none placeholder:text-gray-400 bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Destination"
                />
              </div>
              
              {/* Type de bien */}
              <div className="flex-1 pb-3 sm:pb-0 sm:px-4 border-b sm:border-b-0 sm:border-r border-gray-200 mb-3 sm:mb-0">
                <div className="text-xs font-bold text-gray-800 mb-1">Type de bien</div>
                <input 
                  type="text" 
                  placeholder="Maison, appartement..." 
                  className="w-full text-base text-gray-800 outline-none placeholder:text-gray-400 bg-transparent"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Type de bien"
                />
              </div>
              
              {/* Voyageurs */}
              <div className="flex-1 sm:pr-4">
                <div className="text-xs font-bold text-gray-800 mb-1">Voyageurs</div>
                <div className="flex items-center justify-between">
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Nombre" 
                    className="w-full text-base text-gray-800 outline-none placeholder:text-gray-400 bg-transparent"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Nombre de voyageurs"
                  />
                  <button 
                    onClick={handleSearchSubmit}
                    className="bg-brand text-white p-3 rounded-full hover:bg-brand-dark transition-colors ml-2 flex items-center justify-center gap-2 sm:hidden"
                    aria-label="Rechercher"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Bouton Rechercher - version desktop */}
              <button 
                onClick={handleSearchSubmit}
                className="hidden sm:flex bg-brand text-white p-3 rounded-full hover:bg-brand-dark transition-colors ml-2 items-center justify-center gap-2"
                aria-label="Rechercher"
              >
                <SearchIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Rechercher</span>
              </button>
            </div>
          </div>

          {isSearching && (
            <button 
              onClick={handleShowAllProperties}
              className="hidden md:flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:border-brand hover:bg-brand/5 transition-colors text-sm font-semibold order-2 md:order-none"
              aria-label="Voir toutes les propriétés"
            >
              Voir tout
            </button>
          )}
        </div>
      </div>

      {/* Contenu principal avec marge pour la barre fixe mobile */}
      <div className={`${isMobile ? 'pt-64' : 'pt-24 md:pt-0'} pb-20 container mx-auto px-4 sm:px-6 lg:px-8`}>
        
        {/* Afficher les filtres actifs uniquement sur desktop */}
        {!isMobile && activeFiltersCount > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Filtres appliqués ({activeFiltersCount})
              </h3>
              <button 
                onClick={handleShowAllProperties}
                className="text-brand text-sm font-medium hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Tout effacer
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {location.trim() && (
                <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  <Map className="w-3 h-3" />
                  <span className="font-medium">Ville:</span> {location}
                </div>
              )}
              {propertyType.trim() && (
                <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  <Home className="w-3 h-3" />
                  <span className="font-medium">Type:</span> {propertyType}
                </div>
              )}
              {guests.trim() && (
                <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span className="font-medium">Personnes:</span> {guests}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {isSearching ? (
              <>
                {filteredProperties.length} résultat{filteredProperties.length > 1 ? "s" : ""} pour "
                {location && <span className="text-brand">{location} </span>}
                {propertyType && <span className="text-brand">{propertyType} </span>}
                {guests && <span className="text-brand">{guests} personne{parseInt(guests) > 1 ? "s" : ""}</span>}
                "
              </>
            ) : (
              `Toutes nos propriétés (${properties.length})`
            )}
          </h2>
          
          {filteredProperties.length === 0 && isSearching && (
            <p className="text-gray-600 mt-2">
              Aucun résultat trouvé. Essayez d'autres critères ou{" "}
              <button 
                onClick={handleShowAllProperties}
                className="text-brand font-medium hover:underline"
              >
                affichez toutes les propriétés
              </button>
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div 
              key={property.id} 
              className="group cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              role="button"
              tabIndex={0}
              onClick={() => handlePropertyClick(property)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePropertyClick(property);
                }
              }}
              aria-label={`Voir ${property.title} à ${property.location}`}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-200">
                <img 
                  src={property.img} 
                  alt={property.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                  {property.type}
                </div>
              </div>
              
              {/* Contenu */}
              <div className="p-4">
                {/* Titre et localisation */}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {property.location}, {property.city}
                </p>
                
                {/* Infos principales */}
                <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                  {property.type !== "Bureau" && property.type !== "Salle événement" && (
                    <>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{property.capacity} pers.</span>
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} ch.</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} sdb</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {property.type === "Bureau" && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Capacité: {property.capacity} pers.</span>
                    </div>
                  )}
                  
                  {property.type === "Salle événement" && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Jusqu&apos;à {property.capacity} pers.</span>
                    </div>
                  )}
                </div>
                
                {/* WiFi et équipements */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.wifi && (
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      <Wifi className="w-3 h-3" />
                      WiFi
                    </div>
                  )}
                  
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <div key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {amenity}
                    </div>
                  ))}
                </div>
                
                {/* Prix */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 text-lg">
                      {property.price.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="text-gray-600 text-sm ml-1">/nuit</span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleWhatsAppReservation(property, e)}
                    className="text-brand font-semibold text-sm hover:text-brand-dark transition-colors"
                    aria-label={`Réserver ${property.title}`}
                  >
                    Réserver →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && isSearching && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune propriété ne correspond à votre recherche
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Essayez de modifier vos critères ou consultez toutes nos propriétés disponibles
            </p>
            <button 
              onClick={handleShowAllProperties}
              className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
            >
              Voir toutes les propriétés
            </button>
          </div>
        )}
      </div>

      {/* Floating Map Button (Mobile/Tablet) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:hidden z-40">
        <button 
          onClick={handleShowAllProperties}
          className="bg-brand text-white px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2 hover:bg-brand-dark transition-transform"
          aria-label="Voir toutes les propriétés"
        >
          <SearchIcon className="w-4 h-4" />
          Voir tout
        </button>
      </div>

      {/* Modale pour afficher les détails du profil */}
      <AnimatePresence>
        {selectedProperty && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleCloseModal}
            />
            
            {/* Modale */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 md:inset-20 bg-white rounded-2xl md:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la modale */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Détails du bien
                  </h2>
                </div>
              </div>
              
              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* Galerie d'images */}
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={propertyImages[currentImageIndex]}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Boutons de navigation galerie */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Indicateurs d'images */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {propertyImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Aller à l'image ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Badge type */}
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full text-sm font-semibold">
                    {selectedProperty.type}
                  </div>
                </div>
                
                {/* Contenu principal */}
                <div className="p-4 md:p-6">
                  {/* Titre et localisation */}
                  <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {selectedProperty.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Map className="w-5 h-5" />
                      <span className="text-lg">
                        {selectedProperty.location}, {selectedProperty.city}
                      </span>
                    </div>
                  </div>
                  
                  {/* Prix et notation */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        {selectedProperty.price.toLocaleString("fr-FR")} FCFA
                        <span className="text-gray-600 text-lg ml-2">/nuit</span>
                      </div>
                      <div className="text-gray-600">Taxes et frais inclus</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => handleWhatsAppReservation(selectedProperty, e)}
                        className="bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        Réserver sur WhatsApp
                      </button>
                    </div>
                  </div>
                  
                  {/* Caractéristiques principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                      <Users className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                      <div className="text-sm text-gray-600">Voyageurs</div>
                      <div className="text-lg font-bold">{selectedProperty.capacity} pers.</div>
                    </div>
                    
                    {selectedProperty.bedrooms > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                        <Bed className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                        <div className="text-sm text-gray-600">Chambres</div>
                        <div className="text-lg font-bold">{selectedProperty.bedrooms}</div>
                      </div>
                    )}
                    
                    {selectedProperty.bathrooms > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                        <Bath className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                        <div className="text-sm text-gray-600">Salles de bain</div>
                        <div className="text-lg font-bold">{selectedProperty.bathrooms}</div>
                      </div>
                    )}
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                      <Wifi className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                      <div className="text-sm text-gray-600">WiFi</div>
                      <div className="text-lg font-bold">{selectedProperty.wifi ? "Oui" : "Non"}</div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProperty.title} est un magnifique {selectedProperty.type.toLowerCase()} situé à {selectedProperty.location}, {selectedProperty.city}. 
                      Ce bien offre un espace spacieux et confortable pouvant accueillir jusqu'à {selectedProperty.capacity} personnes. 
                      Idéal pour les familles, les groupes d'amis ou les voyages d'affaires.
                    </p>
                  </div>
                  
                  {/* Équipements et services */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Équipements et services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                      {selectedProperty.wifi && (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">WiFi haute vitesse</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bouton de réservation principal */}
                  <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-200 -mx-4 md:-mx-6 px-4 md:px-6">
                    <button 
                      onClick={(e) => handleWhatsAppReservation(selectedProperty, e)}
                      className=" bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-lg"
                    >
                      <Phone className="w-6 h-6" />
                      Réserver sur WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bouton de fermeture mobile */}
              <div className="md:hidden p-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};