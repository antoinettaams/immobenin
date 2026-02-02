// components/publish/steps/TitleStep.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Edit2, Sparkles, TrendingUp, Star, ImageIcon, Home, Building, Calendar, LucideIcon } from 'lucide-react';
import { ListingData } from '../PublishFlow';

interface TitleStepProps {
  data: string;
  propertyCategory: ListingData['propertyType']['category'];
  propertyLocation: ListingData['location'];
  onUpdate: (title: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Type pour la configuration par catégorie
interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
  placeholder: string;
  description: string;
  examples: string[];
  keywords: string[];
  tips: string[];
}

export const TitleStep: React.FC<TitleStepProps> = ({
  data,
  propertyCategory,
  propertyLocation,
  onUpdate,
}) => {
  const [title, setTitle] = useState(data);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configuration par type de bien
  const getCategoryConfig = (): CategoryConfig => {
    const houseConfig: CategoryConfig = {
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Logement',
      placeholder: isMobile ? "Ex: Appart avec vue mer à Cotonou" : "Ex: Magnifique appartement avec vue mer à Cotonou",
      description: "Un bon titre attire plus de voyageurs",
      examples: [
        "Appartement lumineux avec vue sur la ville",
        "Villa moderne avec piscine privée",
        "Studio meublé proche de la plage",
        "Maison traditionnelle avec terrasse",
        "Duplex spacieux dans quartier calme",
        "Loft design avec grande terrasse"
      ],
      keywords: isMobile ? [
        "Lumineux", "Moderne", "Spacieux", "Calme", "Vue",
        "Proche", "Piscine", "Jardin", "Terrasse", "Meublé"
      ] : [
        "Lumineux", "Moderne", "Spacieux", "Calme", "Climatisé",
        "Vue", "Proche plage", "Avec piscine", "Jardin", "Terrasse",
        "Nouveau", "Design", "Meublé", "Familial", "Sécurisé"
      ],
      tips: [
        "Mentionnez les commodités proches",
        "Indiquez les équipements spéciaux",
        "Décrivez l'ambiance",
        "Précisez le type de logement"
      ]
    };

    const officeConfig: CategoryConfig = {
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Bureau',
      placeholder: isMobile ? "Ex: Bureau pro centre-ville avec fibre" : "Ex: Bureau professionnel en centre-ville avec fibre optique",
      description: "Un titre clair attire les professionnels",
      examples: [
        "Bureau moderne avec vue panoramique",
        "Espace coworking avec salles privatives",
        "Bureau équipé dans immeuble d'affaires",
        "Suite exécutive avec salle de conférence",
        "Espace pro avec accès 24/7",
        "Bureau meublé avec fibre optique"
      ],
      keywords: isMobile ? [
        "Pro", "Moderne", "Équipé", "Fibre",
        "Central", "Parking", "Salle réunion", "Flexible"
      ] : [
        "Professionnel", "Moderne", "Équipé", "Fibre optique",
        "Central", "Parking", "Salle réunion", "Coworking",
        "Flexible", "Services inclus", "Climatisé", "Sécurisé"
      ],
      tips: [
        "Indiquez les services inclus",
        "Mentionnez la connexion internet",
        "Précisez les espaces disponibles",
        "Décrivez l'environnement"
      ]
    };

    const eventConfig: CategoryConfig = {
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      label: 'Événementiel',
      placeholder: isMobile ? "Ex: Salle pour 200 personnes" : "Ex: Salle de réception spacieuse pour 200 personnes",
      description: "Un titre attractif pour vos événements",
      examples: [
        "Salle de conférence modulable",
        "Espace événementiel avec jardin",
        "Salle de réception pour mariages",
        "Auditorium de 300 places équipé",
        "Loft industriel pour soirées",
        "Séminaire avec vue mer"
      ],
      keywords: isMobile ? [
        "Spacieux", "Équipé", "Modulable", "Parking",
        "Cuisine", "Scène", "Sonorisation", "Capacité"
      ] : [
        "Spacieux", "Équipé", "Modulable", "Climatisé",
        "Parking", "Cuisine", "Scène", "Sonorisation",
        "Éclairage", "Élégant", "Moderne", "Capacité"
      ],
      tips: [
        "Indiquez la capacité maximum",
        "Mentionnez les équipements",
        "Décrivez l'ambiance",
        "Précisez les types d'événements"
      ]
    };

    switch (propertyCategory) {
      case 'house':
        return houseConfig;
      case 'office':
        return officeConfig;
      case 'event':
        return eventConfig;
      default:
        return houseConfig;
    }
  };

  const categoryConfig = getCategoryConfig();
  const CategoryIcon = categoryConfig.icon;

  useEffect(() => {
    setCharacterCount(title.length);
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 80) {
      setTitle(value);
      onUpdate(value);
    }
  };

  const addKeyword = (keyword: string) => {
    const words = title.split(' ');
    if (words.length < 15 && !title.includes(keyword)) {
      const newTitle = title ? `${title} ${keyword}` : keyword;
      setTitle(newTitle);
      onUpdate(newTitle);
    }
  };

  const applyExample = (example: string) => {
    setTitle(example);
    onUpdate(example);
  };

  // Générer des suggestions personnalisées basées sur la localisation
  const generateLocationBasedTitles = (): string[] => {
    const city = propertyLocation.city || 'Cotonou';
    const neighborhood = propertyLocation.neighborhood || '';
    
    const baseTitles: Record<ListingData['propertyType']['category'], string[]> = {
      house: [
        `Appartement avec balcon à ${neighborhood || city}`,
        `Maison familiale à ${neighborhood || city}`,
        `Studio moderne à ${neighborhood || city}`
      ],
      office: [
        `Bureau pro à ${neighborhood || city}`,
        `Espace travail à ${neighborhood || city}`,
        `Bureau clé en main à ${city}`
      ],
      event: [
        `Salle événementielle à ${city}`,
        `Espace modulable à ${neighborhood || city}`,
        `Lieu de réception à ${city}`
      ]
    };

    return baseTitles[propertyCategory] || [];
  };

  const locationTitles = generateLocationBasedTitles();

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* En-tête avec badge de catégorie */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
          <div className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 ${categoryConfig.bgColor} rounded-full flex items-center gap-1 sm:gap-1.5 md:gap-2`}>
            <CategoryIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${categoryConfig.color}`} />
            <span className={`font-medium text-xs sm:text-sm ${categoryConfig.color.replace('text-', 'text-').replace('600', '800')}`}>
              {categoryConfig.label}
            </span>
          </div>
          <span className="text-gray-500 text-xs sm:text-sm">• Titre de l&apos;annonce</span>
        </div>
        
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 md:mb-3">
          Créez un titre attractif pour votre {categoryConfig.label.toLowerCase()}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          {categoryConfig.description}
        </p>
      </div>

      {/* Zone de saisie du titre */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className={`relative ${isFocused ? 'z-10' : ''}`}>
          <textarea
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={categoryConfig.placeholder}
            className="w-full text-sm sm:text-base md:text-lg p-3 sm:p-4 md:p-6 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none h-28 sm:h-32 min-h-[112px] sm:min-h-[120px]"
            maxLength={80}
            rows={3}
          />
          
          {/* Compteur de caractères */}
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {characterCount}/80
          </div>
          
          {/* Indicateur de qualité */}
          <div className={`absolute -top-6 sm:-top-8 -right-1 flex items-center transition-opacity ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`
              text-xs px-2 py-0.5 rounded-full whitespace-nowrap
              ${characterCount >= 20 && characterCount <= 60 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
              }
            `}>
              {characterCount >= 20 && characterCount <= 60 ? '✓ Bonne longueur' : 'À améliorer'}
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-2 sm:mt-3 md:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Qualité du titre</span>
            <span className="text-xs font-medium text-gray-900">
              {Math.min(100, Math.floor((characterCount / 60) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-brand h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.floor((characterCount / 60) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conseils spécifiques au type */}
      <div className={`mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 ${categoryConfig.bgColor.replace('100', '50')} rounded-lg sm:rounded-xl border ${categoryConfig.color.replace('600', '200')}`}>
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
          <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${categoryConfig.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm sm:text-base ${categoryConfig.color.replace('600', '900')} mb-1.5 sm:mb-2 md:mb-3`}>
              Conseils pour un titre efficace
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className={`w-3 h-3 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    Mots-clés recherchés
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className={`w-3 h-3 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    Caractéristiques uniques
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Edit2 className={`w-3 h-3 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    20-60 caractères idéal
                  </span>
                </div>
              </div>
              <div className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '700')}`}>
                <p className="mb-1">Pour un {categoryConfig.label.toLowerCase()} :</p>
                <ul className="space-y-0.5">
                  {categoryConfig.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-xs sm:text-sm">• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mots-clés suggérés par catégorie */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
          Mots-clés populaires
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
          {categoryConfig.keywords.map((keyword: string) => (
            <button
              key={keyword}
              onClick={() => addKeyword(keyword)}
              className={`px-2 sm:px-2.5 py-1 ${categoryConfig.bgColor} hover:opacity-90 ${categoryConfig.color.replace('600', '800')} rounded-full text-xs font-medium transition-colors whitespace-nowrap`}
            >
              + {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Titres suggérés par localisation */}
      {propertyLocation.city && (
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">
            Suggestions pour {propertyLocation.city}
            {propertyLocation.neighborhood && ` (${propertyLocation.neighborhood})`}
          </h3>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {locationTitles.map((suggestion: string, index: number) => (
              <button
                key={index}
                onClick={() => applyExample(suggestion)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exemples de titres par catégorie */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
          Exemples performants
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {categoryConfig.examples.map((example: string, index: number) => (
            <button
              key={index}
              onClick={() => applyExample(example)}
              className="p-2.5 sm:p-3 md:p-4 border border-gray-200 rounded-lg text-left hover:border-gray-300 hover:shadow-sm transition-all group w-full"
            >
              <div className="flex items-start gap-2">
                <div className={`p-1 ${categoryConfig.bgColor} rounded group-hover:opacity-90 flex-shrink-0`}>
                  <Edit2 className={`w-3 h-3 ${categoryConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">{example}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {example.length} caractères • {example.split(' ').length} mots
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prévisualisation adaptée */}
      {title && (
        <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-gray-50 rounded-lg sm:rounded-xl">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Aperçu sur la plateforme
          </h3>
          <div className="p-2.5 sm:p-3 md:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5 mb-1 flex-wrap">
                  <div className={`px-1.5 py-0.5 ${categoryConfig.bgColor} rounded text-xs font-medium ${categoryConfig.color} flex-shrink-0`}>
                    {categoryConfig.label}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">★ Nouveau</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 mb-0.5">
                  {title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {propertyLocation.city || 'Cotonou'}
                  {propertyLocation.neighborhood && ` • ${propertyLocation.neighborhood}`}
                </p>
                <p className="text-gray-900 font-bold mt-1 text-sm sm:text-base">
                  {propertyCategory === 'house' ? '10 000 FCFA / nuit' :
                   propertyCategory === 'office' ? '150 000 FCFA / mois' :
                   '500 000 FCFA / journée'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};