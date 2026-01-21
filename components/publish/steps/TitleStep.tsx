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
  const [titleLength, setTitleLength] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Configuration par type de bien
  const getCategoryConfig = (): CategoryConfig => {
    const houseConfig: CategoryConfig = {
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Logement',
      placeholder: "Ex: Magnifique appartement avec vue mer à Cotonou",
      description: "Un bon titre attire plus de voyageurs",
      examples: [
        "Appartement lumineux avec vue sur la ville",
        "Villa moderne avec piscine privée et jardin",
        "Studio meublé proche de la plage et des commerces",
        "Maison traditionnelle avec terrasse et climatisation",
        "Duplex spacieux dans quartier résidentiel calme",
        "Loft design avec hauts plafonds et grande terrasse"
      ],
      keywords: [
        "Lumineux", "Moderne", "Spacieux", "Calme", "Climatisé",
        "Vue", "Proche plage", "Avec piscine", "Jardin", "Terrasse",
        "Nouveau", "Design", "Meublé", "Familial", "Sécurisé"
      ],
      tips: [
        "Mentionnez les commodités proches (plage, centre-ville)",
        "Indiquez les équipements spéciaux (piscine, jardin)",
        "Décrivez l'ambiance (calme, lumineux, cosy)",
        "Précisez le type de logement (appartement, villa, studio)"
      ]
    };

    const officeConfig: CategoryConfig = {
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Bureau',
      placeholder: "Ex: Bureau professionnel en centre-ville avec fibre optique",
      description: "Un titre clair attire les professionnels",
      examples: [
        "Bureau moderne en open-space avec vue panoramique",
        "Espace de coworking avec salles de réunion privatives",
        "Bureau privé équipé dans immeuble d'affaires",
        "Suite exécutive avec salle de conférence intégrée",
        "Espace professionnel avec accès 24/7 et services inclus",
        "Bureau meublé avec fibre optique et parking sécurisé"
      ],
      keywords: [
        "Professionnel", "Moderne", "Équipé", "Fibre optique",
        "Central", "Parking", "Salle réunion", "Coworking",
        "Flexible", "Services inclus", "Climatisé", "Sécurisé",
        "Vue", "Silencieux", "Prestigieux"
      ],
      tips: [
        "Indiquez les services professionnels inclus",
        "Mentionnez la qualité de la connexion internet",
        "Précisez les espaces communs disponibles",
        "Décrivez l'environnement de travail"
      ]
    };

    const eventConfig: CategoryConfig = {
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      label: 'Événementiel',
      placeholder: "Ex: Salle de réception spacieuse pour 200 personnes",
      description: "Un titre attractif pour vos événements",
      examples: [
        "Salle de conférence modulable avec équipement audiovisuel",
        "Espace événementiel avec jardin et terrasse couverte",
        "Salle de réception élégante pour mariages et galas",
        "Auditorium équipé de 300 places avec scène",
        "Loft industriel pour soirées d'entreprise et lancements",
        "Séminaire avec vue mer et équipements high-tech"
      ],
      keywords: [
        "Spacieux", "Équipé", "Modulable", "Climatisé",
        "Parking", "Cuisine", "Scène", "Sonorisation",
        "Éclairage", "Élégant", "Moderne", "Capacité",
        "Jardin", "Terrasse", "Premium"
      ],
      tips: [
        "Indiquez la capacité d'accueil maximum",
        "Mentionnez les équipements spéciaux (scène, sono)",
        "Décrivez l'ambiance et le style du lieu",
        "Précisez les types d'événements adaptés"
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
      setTitleLength(value.length);
      onUpdate(value);
    }
  };

  const addKeyword = (keyword: string) => {
    const words = title.split(' ');
    if (words.length < 15 && !title.includes(keyword)) {
      const newTitle = title ? `${title} ${keyword}` : keyword;
      setTitle(newTitle);
      setTitleLength(newTitle.length);
      onUpdate(newTitle);
    }
  };

  const applyExample = (example: string) => {
    setTitle(example);
    setTitleLength(example.length);
    onUpdate(example);
  };

  const canContinue = title.length >= 10 && title.split(' ').length >= 3;

  // Générer des suggestions personnalisées basées sur la localisation
  const generateLocationBasedTitles = (): string[] => {
    const city = propertyLocation.city || 'Cotonou';
    const neighborhood = propertyLocation.neighborhood || '';
    
    const baseTitles: Record<ListingData['propertyType']['category'], string[]> = {
      house: [
        `Bel appartement avec balcon à ${neighborhood || city}`,
        `Maison familiale dans quartier calme de ${city}`,
        `Studio moderne au cœur de ${neighborhood || city}`
      ],
      office: [
        `Bureau professionnel dans le centre d'affaires de ${city}`,
        `Espace de travail à ${neighborhood || city} avec tous services`,
        `Bureau clé en main dans immeuble moderne à ${city}`
      ],
      event: [
        `Salle événementielle au centre de ${city}`,
        `Espace modulable pour séminaires à ${neighborhood || city}`,
        `Lieu de réception avec parking à ${city}`
      ]
    };

    return baseTitles[propertyCategory] || [];
  };

  const locationTitles = generateLocationBasedTitles();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
      {/* En-tête avec badge de catégorie */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={`px-3 py-1 sm:px-4 sm:py-2 ${categoryConfig.bgColor} rounded-full flex items-center gap-1 sm:gap-2`}>
            <CategoryIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${categoryConfig.color}`} />
            <span className={`font-medium text-xs sm:text-sm ${categoryConfig.color.replace('text-', 'text-').replace('600', '800')}`}>
              {categoryConfig.label}
            </span>
          </div>
          <span className="text-gray-500 text-xs sm:text-sm">• Titre de l&apos;annonce</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Créez un titre attractif pour votre {categoryConfig.label.toLowerCase()}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          {categoryConfig.description}
        </p>
      </div>

      {/* Zone de saisie du titre */}
      <div className="mb-6 sm:mb-10">
        <div className={`relative ${isFocused ? 'z-10' : ''}`}>
          <textarea
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={categoryConfig.placeholder}
            className="w-full text-base sm:text-lg md:text-xl p-4 sm:p-6 border-2 border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none h-32 sm:h-32 min-h-[120px] sm:min-h-[128px]"
            maxLength={80}
            rows={3}
          />
          
          {/* Compteur de caractères */}
          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-xs sm:text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
            {characterCount}/80
          </div>
          
          {/* Indicateur de qualité */}
          <div className={`absolute -top-8 sm:-top-10 right-0 flex items-center gap-1 sm:gap-2 transition-opacity ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
            <div className={`
              text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full
              ${characterCount >= 20 && characterCount <= 60 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
              }
            `}>
              {characterCount >= 20 && characterCount <= 60 ? '✓ Bonne longueur' : 'Trop court/long'}
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs sm:text-sm text-gray-600">Qualité du titre</span>
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {Math.min(100, Math.floor((characterCount / 60) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-brand h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.floor((characterCount / 60) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conseils spécifiques au type */}
      <div className={`mb-6 sm:mb-10 p-4 sm:p-6 ${categoryConfig.bgColor.replace('100', '50')} rounded-xl sm:rounded-2xl border ${categoryConfig.color.replace('600', '200')}`}>
        <div className="flex items-start gap-3 sm:gap-4">
          <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${categoryConfig.color} flex-shrink-0 mt-0.5 sm:mt-1`} />
          <div>
            <h3 className={`font-bold text-sm sm:text-base ${categoryConfig.color.replace('600', '900')} mb-2 sm:mb-3`}>
              Conseils pour un titre efficace pour {categoryConfig.label.toLowerCase()}s
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    Utilisez des mots-clés recherchés
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    Mentionnez des caractéristiques uniques
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Edit2 className={`w-3 h-3 sm:w-4 sm:h-4 ${categoryConfig.color}`} />
                  <span className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '800')}`}>
                    Entre 20 et 60 caractères idéalement
                  </span>
                </div>
              </div>
              <div className={`text-xs sm:text-sm ${categoryConfig.color.replace('600', '700')}`}>
                <p className="mb-1 sm:mb-2">Pour un {categoryConfig.label.toLowerCase()} :</p>
                <ul className="list-disc list-inside space-y-1">
                  {categoryConfig.tips.map((tip: string, index: number) => (
                    <li key={index} className="text-xs sm:text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mots-clés suggérés par catégorie */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Mots-clés populaires pour {categoryConfig.label.toLowerCase()}s
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categoryConfig.keywords.map((keyword: string) => (
            <button
              key={keyword}
              onClick={() => addKeyword(keyword)}
              className={`px-2 sm:px-3 py-1 sm:py-2 ${categoryConfig.bgColor} hover:opacity-90 ${categoryConfig.color.replace('600', '800')} rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap`}
            >
              + {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Titres suggérés par localisation */}
      {propertyLocation.city && (
        <div className="mb-4 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
            Suggestions pour {propertyLocation.city}
            {propertyLocation.neighborhood && ` (${propertyLocation.neighborhood})`}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {locationTitles.map((suggestion: string, index: number) => (
              <button
                key={index}
                onClick={() => applyExample(suggestion)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exemples de titres par catégorie */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Exemples de titres performants
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {categoryConfig.examples.map((example: string, index: number) => (
            <button
              key={index}
              onClick={() => applyExample(example)}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl text-left hover:border-gray-300 hover:shadow-sm transition-all group w-full"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 ${categoryConfig.bgColor} rounded-lg group-hover:opacity-90 flex-shrink-0`}>
                  <Edit2 className={`w-3 h-3 sm:w-4 sm:h-4 ${categoryConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{example}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
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
        <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
            Aperçu sur la plateforme
          </h3>
          <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                  <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 ${categoryConfig.bgColor} rounded text-xs font-medium ${categoryConfig.color} flex-shrink-0`}>
                    {categoryConfig.label}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">★ Nouveau</span>
                </div>
                <h4 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 mb-1">
                  {title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {propertyLocation.city || 'Cotonou'}
                  {propertyLocation.neighborhood && ` • ${propertyLocation.neighborhood}`}
                </p>
                <p className="text-gray-900 font-bold mt-1.5 sm:mt-2 text-sm sm:text-base">
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