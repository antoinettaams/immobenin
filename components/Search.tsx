"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search as SearchIcon, Map, Wifi, Home, Users, 
  Bath, Bed, X, Phone, Check, ChevronLeft, ChevronRight, Clock, Image as ImageIcon, MapPin, 
  Building, Maximize, Car, Wind, Music, Bell, Shield, Key,
  Accessibility,
  Droplets,
  ParkingCircle,
  Microwave,
  Cable,
  Utensils,
  DoorOpen,
  Square,
  Briefcase,
  Printer,
  Sofa,
  Presentation,
  GlassWater,
  Dumbbell,
  Trees
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchProps {
  onBack: () => void;  
}

interface EquipementDetail {
  id?: number;
  nom?: string;
  code?: string;
  categorie?: string;
  description?: string | null;
  pourMaison?: boolean;
  pourBureau?: boolean;
  pourEvenement?: boolean;
}

interface PropertyDescription {
  summary?: string;
  spaceDescription?: string;
  guestAccess?: string;
  neighborhoodInfo?: string;
  id?: number;
  bienId?: number;
  createdAt?: Date;
}

interface Property {
  id: number;
  title: string;
  type: string;
  category: "HOUSE" | "OFFICE" | "EVENT";
  subType: string;
  privacy?: string | null;
  location: string;
  city: string;
  address: string;
  country?: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  // PriceStep
  price: number;
  currency: string;
  weeklyDiscount?: number | null;
  monthlyDiscount?: number | null;
  cleaningFee?: number | null;
  extraGuestFee?: number | null;
  securityDeposit?: number | null;
  
  // BasicsStep
  size?: number | null;
  floors?: number | null;
  capacity: number;
  bedrooms?: number | null;
  beds?: number | null;
  bathrooms?: number | null;
  privateEntrance?: boolean | null;
  
  // BasicsStep - Office
  employees?: number | null;
  offices?: number | null;
  meetingRooms?: number | null;
  workstations?: number | null;
  
  // BasicsStep - Event
  eventCapacity?: number | null;
  parkingSpots?: number | null;
  wheelchairAccessible?: boolean | null;
  hasStage?: boolean | null;
  hasSoundSystem?: boolean | null;
  hasProjector?: boolean | null;
  hasCatering?: boolean | null;
  minBookingHours?: number | null;
  
  // Images
  images: string[];
  img: string;
  
  // Description
  description?: PropertyDescription | string;
  
  // Propriétaire
  owner: {
    id?: number;
    name: string;
    phone: string;
    email?: string;
    createdAt?: Date;
  };
  
  // Équipements
  wifi: boolean;
  amenities: string[];
  equipementsDetails?: EquipementDetail[];
  
  // Règles
  checkInTime?: string;
  checkOutTime?: string;
  childrenAllowed?: boolean;
  
  // Autres
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Search: React.FC<SearchProps> = ({ onBack }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lire les paramètres d'URL au chargement
  const initialLocation = searchParams.get('location') || '';
  const initialType = searchParams.get('type') || '';
  const initialGuests = searchParams.get('guests') || '';
  const initialCategory = searchParams.get('category') || '';

  const [location, setLocation] = useState<string>(initialLocation);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [guests, setGuests] = useState<string>(initialGuests);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hasInitialSearch, setHasInitialSearch] = useState<boolean>(false);

  // Fonction pour normaliser les données de l'API
  const normalizePropertyData = (apiData: any): Property => {
    console.log('🔄 Normalisation des données API:', apiData);
    
    // Gestion de la description complète
    let description: PropertyDescription | string = '';
    
    if (apiData.description && typeof apiData.description === 'object') {
      description = {
        summary: apiData.description.summary || '',
        spaceDescription: apiData.description.spaceDescription || '',
        guestAccess: apiData.description.guestAccess || '',
        neighborhoodInfo: apiData.description.neighborhoodInfo || '',
        id: apiData.description.id,
        bienId: apiData.description.bienId,
        createdAt: apiData.description.createdAt ? new Date(apiData.description.createdAt) : undefined
      };
    } else if (typeof apiData.description === 'string') {
      description = apiData.description;
    }

    // IMAGES RÉELLES
    let images: string[] = [];
    let img: string = '';
    
    if (apiData.images && Array.isArray(apiData.images)) {
      images = apiData.images
        .filter((img: any) => {
          if (typeof img !== 'string') return false;
          const trimmed = img.trim();
          
          // Exclure URLs blob
          if (trimmed.startsWith('blob:')) {
            return false;
          }
          
          // Vérifier que c'est une URL valide
          return trimmed.length > 10 && 
                 (trimmed.startsWith('http') || 
                  trimmed.startsWith('data:image') || 
                  trimmed.startsWith('/'));
        })
        .map((img: string) => {
          let trimmed = img.trim();
          
          // Nettoyer base64
          if (trimmed.startsWith('data:image')) {
            trimmed = trimmed.replace('...[BASE64_TROP_LONG]', '');
          }
          
          // Forcer HTTPS pour Cloudinary
          if (trimmed.includes('cloudinary.com') && trimmed.startsWith('http://')) {
            trimmed = trimmed.replace('http://', 'https://');
          }
          
          return trimmed;
        });
      
      img = images[0] || '';
    }

    // Utilisateur avec tous les champs
    const owner = {
      id: apiData.owner?.id,
      name: apiData.owner?.name || apiData.proprietaire?.nom || 'Propriétaire',
      phone: apiData.owner?.phone || apiData.owner?.telephone || '',
      email: apiData.owner?.email || apiData.proprietaire?.email || '',
      createdAt: apiData.owner?.createdAt ? new Date(apiData.owner.createdAt) : 
                apiData.proprietaire?.createdAt ? new Date(apiData.proprietaire.createdAt) : undefined
    };

    // Équipements détaillés
    const amenitiesDetails = apiData.amenitiesDetails || 
                            apiData.equipementsDetails || 
                            (apiData.equipements ? apiData.equipements.map((e: any) => e.equipement) : []);
    
    const amenities = apiData.amenities || 
                     (amenitiesDetails ? amenitiesDetails.map((e: any) => e.nom).filter(Boolean) : []);

    // Capacité calculée selon la catégorie
    let capacity = apiData.capacity || 0;
    if (!capacity) {
      switch (apiData.category) {
        case 'HOUSE':
          capacity = apiData.maxGuests || 0;
          break;
        case 'OFFICE':
          capacity = apiData.employees || 0;
          break;
        case 'EVENT':
          capacity = apiData.eventCapacity || 0;
          break;
      }
    }

    // Type affiché
    let displayType = apiData.type || apiData.displayType || '';
    if (!displayType) {
      switch (apiData.category) {
        case 'HOUSE':
          displayType = apiData.subType && apiData.subType !== 'house' 
            ? apiData.subType.charAt(0).toUpperCase() + apiData.subType.slice(1)
            : 'Maison';
          break;
        case 'OFFICE':
          displayType = apiData.subType && apiData.subType !== 'office'
            ? apiData.subType.charAt(0).toUpperCase() + apiData.subType.slice(1)
            : 'Bureau';
          break;
        case 'EVENT':
          displayType = apiData.subType && apiData.subType !== 'event'
            ? apiData.subType.charAt(0).toUpperCase() + apiData.subType.slice(1)
            : 'Salle événement';
          break;
        default:
          displayType = apiData.subType || 'Propriété';
      }
    }

    return {
      id: apiData.id,
      title: apiData.title || '',
      type: displayType,
      category: apiData.category || 'HOUSE',
      subType: apiData.subType || '',
      privacy: apiData.privacy,
      
      // LocationStep
      location: apiData.location || apiData.neighborhood || apiData.city || '',
      city: apiData.city || '',
      address: apiData.address || '',
      country: apiData.country || 'Bénin',
      postalCode: apiData.postalCode,
      latitude: apiData.latitude,
      longitude: apiData.longitude,
      
      // PriceStep
      price: apiData.price || apiData.basePrice || 0,
      currency: apiData.currency || 'FCFA',
      weeklyDiscount: apiData.weeklyDiscount || apiData.pricing?.weeklyDiscount,
      monthlyDiscount: apiData.monthlyDiscount || apiData.pricing?.monthlyDiscount,
      cleaningFee: apiData.cleaningFee || apiData.pricing?.cleaningFee,
      extraGuestFee: apiData.extraGuestFee || apiData.pricing?.extraGuestFee,
      securityDeposit: apiData.securityDeposit || apiData.pricing?.securityDeposit,
      
      // BasicsStep - Communs
      size: apiData.size,
      floors: apiData.floors,
      capacity,
      bedrooms: apiData.bedrooms,
      beds: apiData.beds,
      bathrooms: apiData.bathrooms,
      privateEntrance: apiData.privateEntrance,
      
      // BasicsStep - Office
      employees: apiData.employees,
      offices: apiData.offices,
      meetingRooms: apiData.meetingRooms,
      workstations: apiData.workstations,
      
      // BasicsStep - Event
      eventCapacity: apiData.eventCapacity,
      parkingSpots: apiData.parkingSpots,
      wheelchairAccessible: apiData.wheelchairAccessible,
      hasStage: apiData.hasStage,
      hasSoundSystem: apiData.hasSoundSystem,
      hasProjector: apiData.hasProjector,
      hasCatering: apiData.hasCatering,
      minBookingHours: apiData.minBookingHours,
      
      // Images
      images,
      img,
      
      // Description
      description,
      
      // Propriétaire
      owner,
      
      // Équipements
      wifi: apiData.wifi || false,
      amenities,
      equipementsDetails: amenitiesDetails,
      
      // Règles
      checkInTime: apiData.checkInTime || apiData.rules?.checkInTime || '15:00',
      checkOutTime: apiData.checkOutTime || apiData.rules?.checkOutTime || '11:00',
      childrenAllowed: apiData.childrenAllowed !== false,
      
      // Autres
      isPublished: apiData.isPublished || false,
      createdAt: apiData.createdAt ? new Date(apiData.createdAt) : undefined,
      updatedAt: apiData.updatedAt ? new Date(apiData.updatedAt) : undefined
    };
  };

  // Composant pour afficher une image avec fallback
const PropertyImageDisplay = ({ 
  src, 
  alt, 
  className = "", 
  fallback = true,
  propertyId
}: { 
  src: string; 
  alt: string; 
  className?: string;
  fallback?: boolean;
  propertyId?: number;
}) => {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    if (src && src.trim().length > 10) {
      setIsLoading(true);  
      setHasError(false);
      
      let cleanedSrc = src.trim();
      
      // Nettoyer les base64
      if (cleanedSrc.startsWith('data:image')) {
        cleanedSrc = cleanedSrc.replace('...[BASE64_TROP_LONG]', '');
      }
      
      // Cloudinary HTTPS
      if (cleanedSrc.includes('cloudinary.com') && cleanedSrc.startsWith('http://')) {
        cleanedSrc = cleanedSrc.replace('http://', 'https://');
      }
      
      // Ne pas essayer d'afficher les URLs blob
      if (cleanedSrc.startsWith('blob:')) {
        setImgSrc('');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      setImgSrc(cleanedSrc);
      
      // Précharger l'image
      const img = new Image();
      img.src = cleanedSrc;
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
    } else {
      setImgSrc('');
      setHasError(true);
      setIsLoading(false);
    }
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Pendant le chargement  
  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="animate-pulse bg-gray-300 w-full h-full"></div>
      </div>
    );
  }

  // Si pas d'image ou erreur
  if (!imgSrc || hasError || imgSrc === '') {
    if (!fallback) return null;
    
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <span className="text-gray-500 text-xs">Image non disponible</span>
          {propertyId && (
            <span className="text-gray-400 text-xs block mt-1">Bien #{propertyId}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      onLoad={() => setIsLoading(false)}
      onError={handleError}
      loading="lazy" 
      crossOrigin="anonymous"
    />
  );
};

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger les propriétés au démarrage avec les paramètres d'URL
  useEffect(() => {
    fetchProperties({
      location: initialLocation,
      type: initialType,
      guests: initialGuests
    });
    
    // Si on a des paramètres d'URL
    if (initialLocation || initialType || initialGuests) {
      setIsSearching(true);
      setHasInitialSearch(true);
    }
  }, []);

  const fetchProperties = async (filters?: { location?: string; type?: string; guests?: string }) => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (filters?.location) params.append('location', filters.location);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.guests) params.append('guests', filters.guests);
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        const normalizedProperties = data.data.map((property: any) => normalizePropertyData(property));
        setFilteredProperties(normalizedProperties);
      } else {
        console.error('Erreur lors du chargement des propriétés:', data.error);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropertyDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const normalizedProperty = normalizePropertyData(data.data);
        setSelectedProperty(normalizedProperty);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'hidden';
      } else {
        console.error('Erreur API:', data.error);
        alert(`Erreur: ${data.error}`);
      }
    } catch (error: any) {
      console.error('Erreur réseau:', error);
      alert('Erreur réseau lors du chargement des détails');
    }
  };

  const handleBackClick = (): void => {
    onBack();
  };

  const handlePropertyClick = (property: Property): void => {
    fetchPropertyDetails(property.id);
  };

  const handleCloseModal = (): void => {
    setSelectedProperty(null);
    document.body.style.overflow = 'auto';
  };

  // Fonction pour formater le numéro WhatsApp
  const formatWhatsAppNumber = (phoneNumber: string): string => {
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '229' + cleaned.substring(1);
    }
    
    if (cleaned.startsWith('229')) {
      cleaned = cleaned;
    } else if (cleaned.length === 9 && !cleaned.startsWith('229')) {
      cleaned = '229' + cleaned;
    }
    
    return cleaned;
  };

  // Message WhatsApp avec toutes les informations
  const createWhatsAppMessage = (property: Property): string => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    let message = `Bonjour ${property.owner.name},\n\n`;
    message += `Je suis intéressé(e) par votre bien "${property.title}" à ${property.location}, ${property.city}.\n\n`;
    
    message += `📋 **Informations de réservation :**\n`;
    message += `• Type de bien : ${property.type}\n`;
    message += `• Capacité : ${property.capacity} personne(s)\n`;
    
    if (guests) {
      message += `• Nombre de voyageurs : ${guests}\n`;
    }
    
    message += `\n💰 **Informations tarifaires :**\n`;
    message += `• Prix par nuit : ${property.price.toLocaleString("fr-FR")} ${property.currency}\n`;
    
    if (property.cleaningFee && property.cleaningFee > 0) {
      message += `• Frais de ménage : ${property.cleaningFee.toLocaleString("fr-FR")} ${property.currency}\n`;
    }
    
    if (property.securityDeposit && property.securityDeposit > 0) {
      message += `• Caution : ${property.securityDeposit.toLocaleString("fr-FR")} ${property.currency}\n`;
    }
    
    message += `\n❓ **Mes questions :**\n`;
    message += `1. Le bien est-il disponible ?\n`;
    message += `2. Quelles sont les modalités de paiement ?\n`;
    message += `3. Y a-t-il des règles particulières à respecter ?\n\n`;
    
    message += `Merci de me répondre au plus vite !\n\n`;
    message += `Cordialement.`;
    
    return message;
  };

  const handleWhatsAppReservation = (property: Property, e: React.MouseEvent): void => {
    e.stopPropagation();
    
    const whatsappNumber = formatWhatsAppNumber(property.owner.phone);
    const message = createWhatsAppMessage(property);
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    handleCloseModal();
  };

  const handleQuickWhatsApp = (property: Property, e: React.MouseEvent): void => {
    e.stopPropagation();
    
    const whatsappNumber = formatWhatsAppNumber(property.owner.phone);
    const quickMessage = `Bonjour ${property.owner.name}, je suis intéressé(e) par "${property.title}" à ${property.location}, ${property.city}. Pourriez-vous m'en dire plus ?`;
    const encodedMessage = encodeURIComponent(quickMessage);
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSearchSubmit = (): void => {
    setIsSearching(true);
    filterProperties();
    
    // Mettre à jour l'URL avec les paramètres de recherche
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('type', propertyType);
    if (guests) params.append('guests', guests);
    
    const newUrl = `/search?${params.toString()}`;
    router.push(newUrl);
  };

  const handleShowAllProperties = (): void => {
    setLocation("");
    setPropertyType("");
    setGuests("");
    setIsSearching(false);
    fetchProperties();
    
    // Réinitialiser l'URL
    router.push('/search');
  };

  const filterProperties = () => {
    fetchProperties({ location, type: propertyType, guests });
  };

  useEffect(() => {
    if (hasInitialSearch) return;
    
    if (location || propertyType || guests) {
      const timeoutId = setTimeout(() => {
        filterProperties();
        setIsSearching(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [location, propertyType, guests, hasInitialSearch]);

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

  // Images pour la galerie
  const propertyImages = selectedProperty ? selectedProperty.images : [];

  const nextImage = () => {
    if (propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
    }
  };

  const prevImage = () => {
    if (propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
    }
  };

  // Fonction pour formater le type de bien
  const formatPropertyType = (category: "HOUSE" | "OFFICE" | "EVENT", subType: string) => {
    switch (category) {
      case "HOUSE": return "Maison";
      case "OFFICE": return "Bureau";
      case "EVENT": return "Salle événement";
      default: return subType || "Propriété";
    }
  };

  // Rendu d'un badge d'icône pour les équipements
  const renderAmenityBadge = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    
    // Mapping des icônes avec lucide-react
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
      return <Wifi className="w-3 h-3" />;
    } else if (lowerAmenity.includes('piscine') || lowerAmenity.includes('pool')) {
      return <Droplets className="w-3 h-3" />;
    } else if (lowerAmenity.includes('parking') || lowerAmenity.includes('garage')) {
      return <ParkingCircle className="w-3 h-3" />;
    } else if (lowerAmenity.includes('climatisation') || lowerAmenity.includes('air')) {
      return <Wind className="w-3 h-3" />;
    } else if (lowerAmenity.includes('cuisine') || lowerAmenity.includes('kitchen')) {
      return <Microwave className="w-3 h-3" />;
    } else if (lowerAmenity.includes('tv') || lowerAmenity.includes('télé') || lowerAmenity.includes('television')) {
      return <Cable className="w-3 h-3" />;
    } else if (lowerAmenity.includes('sono') || lowerAmenity.includes('sound') || lowerAmenity.includes('musique')) {
      return <Music className="w-3 h-3" />;
    } else if (lowerAmenity.includes('projecteur') || lowerAmenity.includes('projector')) {
      return <Presentation className="w-3 h-3" />;
    } else if (lowerAmenity.includes('catering') || lowerAmenity.includes('restauration') || lowerAmenity.includes('repas')) {
      return <Utensils className="w-3 h-3" />;
    } else if (lowerAmenity.includes('pmr') || lowerAmenity.includes('handicapé') || lowerAmenity.includes('accessibilité')) {
      return <Accessibility className="w-3 h-3" />;
    } else if (lowerAmenity.includes('réception') || lowerAmenity.includes('accueil')) {
      return <Bell className="w-3 h-3" />;
    } else if (lowerAmenity.includes('sécurité') || lowerAmenity.includes('security')) {
      return <Shield className="w-3 h-3" />;
    } else if (lowerAmenity.includes('entrée') || lowerAmenity.includes('entrance')) {
      return <DoorOpen className="w-3 h-3" />;
    } else if (lowerAmenity.includes('surface') || lowerAmenity.includes('m²') || lowerAmenity.includes('mètre')) {
      return <Square className="w-3 h-3" />;
    } else if (lowerAmenity.includes('bureau') || lowerAmenity.includes('office')) {
      return <Briefcase className="w-3 h-3" />;
    } else if (lowerAmenity.includes('réunion') || lowerAmenity.includes('meeting')) {
      return <Printer className="w-3 h-3" />;
    } else if (lowerAmenity.includes('salle') || lowerAmenity.includes('room')) {
      return <Sofa className="w-3 h-3" />;
    } else if (lowerAmenity.includes('bar') || lowerAmenity.includes('boisson')) {
      return <GlassWater className="w-3 h-3" />;
    } else if (lowerAmenity.includes('fitness') || lowerAmenity.includes('sport')) {
      return <Dumbbell className="w-3 h-3" />;
    } else if (lowerAmenity.includes('jardin') || lowerAmenity.includes('garden')) {
      return <Trees className="w-3 h-3" />;
    } else if (lowerAmenity.includes('balcon') || lowerAmenity.includes('terrasse')) {
      return <Home className="w-3 h-3" />;
    } else if (lowerAmenity.includes('douche') || lowerAmenity.includes('shower')) {
      return <Bath className="w-3 h-3" />;
    } else if (lowerAmenity.includes('lit') || lowerAmenity.includes('bed')) {
      return <Bed className="w-3 h-3" />;
    }
    
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Barre de recherche */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-200 md:hidden">
        <div className="container mx-auto px-4 py-3">
          {/* Bouton Retour */}
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
          
          {/* Barre de recherche */}
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

      {/* Version desktop */}
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
              
              {/* Bouton Rechercher */}
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

      {/* Contenu principal */}
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        )}

        {/* Résultats */}
        {!isLoading && (
          <>
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
                  `Toutes nos propriétés (${filteredProperties.length})`
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

            {/* Results Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="group cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
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
                    <PropertyImageDisplay
                      src={property.images && property.images.length > 0 ? property.images[0] : ''}
                      alt={property.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      propertyId={property.id}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                      {property.type}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-4">
                    {/* Titre et localisation */}
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {property.location}, {property.city}
                    </p>
                    
                    {/* Infos principales */}
                    <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-700 mb-3 flex-wrap">
                      {property.category !== "OFFICE" && property.category !== "EVENT" && (
                        <>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{property.capacity} pers.</span>
                          </div>
                          {property.bedrooms && property.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{property.bedrooms} ch.</span>
                            </div>
                          )}
                          {property.bathrooms && property.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms} sdb</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {property.category === "OFFICE" && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>Capacité: {property.capacity} pers.</span>
                        </div>
                      )}
                      
                      {property.category === "EVENT" && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Jusqu&apos;à {property.capacity} pers.</span>
                        </div>
                      )}
                      
                      {property.size && (
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span>{property.size} m²</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Équipements */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {property.wifi && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          <Wifi className="w-3 h-3" />
                          <span className="hidden sm:inline">WiFi</span>
                        </div>
                      )}
                      
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {renderAmenityBadge(amenity)}
                          <span className="hidden sm:inline">{amenity}</span>
                          <span className="sm:hidden">{amenity.length > 8 ? `${amenity.substring(0, 8)}...` : amenity}</span>
                        </div>
                      ))}
                      
                      {property.amenities.length > 3 && (
                        <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{property.amenities.length - 3}
                        </div>
                      )}
                    </div>
                    
                    {/* Prix */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <span className="font-bold text-gray-900 text-lg">
                          {property.price.toLocaleString("fr-FR")} {property.currency}
                        </span>
                        <span className="text-gray-600 text-sm ml-1">/nuit</span>
                      </div>
                      
                      <button 
                        onClick={(e) => handleQuickWhatsApp(property, e)}
                        className="text-brand font-semibold text-sm hover:text-brand-dark transition-colors px-3 py-1 rounded-lg bg-brand/5 hover:bg-brand/10 flex items-center gap-1"
                        aria-label={`Contacter ${property.owner.name} pour ${property.title}`}
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">Contacter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProperties.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isSearching ? "Aucune propriété ne correspond à votre recherche" : "Aucune propriété disponible"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {isSearching 
                    ? "Essayez de modifier vos critères ou consultez toutes nos propriétés disponibles"
                    : "Aucune propriété n'est actuellement disponible. Revenez plus tard !"}
                </p>
                {isSearching && (
                  <button 
                    onClick={handleShowAllProperties}
                    className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
                  >
                    Voir toutes les propriétés
                  </button>
                )}
              </div>
            )}
          </>
        )}
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
            
            {/* Modale - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 md:inset-4 md:inset-10 lg:inset-20 bg-white md:rounded-2xl lg:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la modale */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
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
                <div className="hidden md:block text-sm text-gray-600">
                  Propriétaire : {selectedProperty.owner.name}
                </div>
              </div>
              
              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* Galerie d'images */}
                {propertyImages.length > 0 ? (
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <PropertyImageDisplay
                      src={propertyImages[currentImageIndex]}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Boutons de navigation galerie */}
                    {propertyImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                          aria-label="Image précédente"
                        >
                          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                          aria-label="Image suivante"
                        >
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        
                        {/* Indicateurs d'images */}
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
                          {propertyImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                                index === currentImageIndex 
                                  ? 'bg-white w-4 md:w-8' 
                                  : 'bg-white/50 hover:bg-white/80'
                              }`}
                              aria-label={`Aller à l'image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Badge type */}
                    <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                      {selectedProperty.type}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video bg-gray-200 overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Aucune image disponible</p>
                    </div>
                  </div>
                )}
                
                {/* Contenu principal */}
                <div className="p-4 md:p-6">
                  {/* Titre et localisation */}
                  <div className="mb-6">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {selectedProperty.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-base md:text-lg">
                        {selectedProperty.location}, {selectedProperty.city}
                        {selectedProperty.country && `, ${selectedProperty.country}`}
                      </span>
                    </div>
                    {selectedProperty.address && (
                      <p className="text-gray-500 text-sm md:text-base mt-1">
                        {selectedProperty.address}
                      </p>
                    )}
                  </div>
                  
                  {/* Prix et réservation */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                        {selectedProperty.price.toLocaleString("fr-FR")} {selectedProperty.currency}
                        <span className="text-gray-600 text-base md:text-lg ml-2">/nuit</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        Contactez {selectedProperty.owner.name} sur WhatsApp
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleWhatsAppReservation(selectedProperty, e)}
                      className="bg-green-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Phone className="w-4 h-4 md:w-5 md:h-5" />
                      Réserver sur WhatsApp
                    </button>
                  </div>
                  
                  {/* Caractéristiques principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                      <Users className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                      <div className="text-xs md:text-sm text-gray-600">Voyageurs</div>
                      <div className="text-base md:text-lg font-bold">{selectedProperty.capacity} pers.</div>
                    </div>
                    
                    {selectedProperty.bedrooms && selectedProperty.bedrooms > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Bed className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">Chambres</div>
                        <div className="text-base md:text-lg font-bold">{selectedProperty.bedrooms}</div>
                      </div>
                    )}
                    
                    {selectedProperty.bathrooms && selectedProperty.bathrooms > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Bath className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">Salles de bain</div>
                        <div className="text-base md:text-lg font-bold">{selectedProperty.bathrooms}</div>
                      </div>
                    )}
                    
                    {selectedProperty.size && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Maximize className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">Surface</div>
                        <div className="text-base md:text-lg font-bold">{selectedProperty.size} m²</div>
                      </div>
                    )}
                    
                    {selectedProperty.floors !== undefined && selectedProperty.floors !== null && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Building className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">Étages</div>
                        <div className="text-base md:text-lg font-bold">{selectedProperty.floors}</div>
                      </div>
                    )}
                    
                    {selectedProperty.parkingSpots && selectedProperty.parkingSpots > 0 && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Car className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">Parking</div>
                        <div className="text-base md:text-lg font-bold">{selectedProperty.parkingSpots} places</div>
                      </div>
                    )}
                    
                    {selectedProperty.wheelchairAccessible && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Accessibility className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">PMR</div>
                        <div className="text-base md:text-lg font-bold text-green-600">Oui</div>
                      </div>
                    )}
                    
                    {selectedProperty.wifi && (
                      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-center">
                        <Wifi className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-gray-700" />
                        <div className="text-xs md:text-sm text-gray-600">WiFi</div>
                        <div className="text-base md:text-lg font-bold text-green-600">Oui</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    {typeof selectedProperty.description === 'string' ? (
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {selectedProperty.description}
                      </p>
                    ) : selectedProperty.description && typeof selectedProperty.description === 'object' && 'summary' in selectedProperty.description ? (
                      <>
                        {selectedProperty.description.summary && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">Description</h4>
                            <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                              {selectedProperty.description.summary}
                            </p>
                          </>
                        )}
                        
                        {selectedProperty.description.spaceDescription && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">L'espace</h4>
                            <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                              {selectedProperty.description.spaceDescription}
                            </p>
                          </>
                        )}
                        
                        {selectedProperty.description.guestAccess && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">Accès des voyageurs</h4>
                            <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                              {selectedProperty.description.guestAccess}
                            </p>
                          </>
                        )}
                        
                        {selectedProperty.description.neighborhoodInfo && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-2 text-base md:text-lg">Le quartier</h4>
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {selectedProperty.description.neighborhoodInfo}
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-700 italic text-sm md:text-base">Aucune description disponible</p>
                    )}
                  </div>
                  
                  {/* Équipements et services */}
                  <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Équipements et services</h3>
                    {selectedProperty.equipementsDetails && selectedProperty.equipementsDetails.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {selectedProperty.equipementsDetails.map((equipement, index) => (
                          <div key={equipement.id || index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-gray-700 font-medium text-sm md:text-base">{equipement.nom}</span>
                              {equipement.description && (
                                <p className="text-gray-500 text-xs md:text-sm mt-0.5">{equipement.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : selectedProperty.amenities && selectedProperty.amenities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {selectedProperty.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                            <span className="text-gray-700 text-sm md:text-base">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm md:text-base">Aucun équipement ou service renseigné</p>
                    )}
                  </div>
                  
                  {/* Informations propriétaire */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">À propos du propriétaire</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{selectedProperty.owner.name}</div>
                        <div className="text-gray-600 text-xs md:text-sm">Propriétaire</div>
                        <div className="text-gray-700 text-xs md:text-sm mt-0.5 truncate">
                          Contact : {selectedProperty.owner.phone}
                        </div>
                        {selectedProperty.owner.email && (
                          <div className="text-gray-700 text-xs md:text-sm mt-0.5 truncate">
                            Email : {selectedProperty.owner.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton de réservation principal */}
                  <div className="sticky bottom-0 bg-white pt-3 pb-3 md:pt-4 md:pb-4 border-t border-gray-200 -mx-4 md:-mx-6 px-4 md:px-6">
                    <button 
                      onClick={(e) => handleWhatsAppReservation(selectedProperty, e)}
                      className="w-full bg-green-600 text-white px-4 py-3 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base md:text-lg"
                    >
                      <Phone className="w-5 h-5 md:w-6 md:h-6" />
                      Contacter {selectedProperty.owner.name} sur WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bouton de fermeture mobile */}
              <div className="md:hidden p-4 border-t border-gray-200 bg-white">
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