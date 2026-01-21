// components/publish/steps/DescriptionStep.tsx
"use client";
import React, { useState } from 'react';
import { Home, MapPin, Users, Edit3, Building, Calendar, Briefcase, Globe, Coffee, Wine, Music, LucideIcon } from 'lucide-react';
import { ListingData } from '../PublishFlow';

interface DescriptionData {
  summary: string;
  spaceDescription: string;
  guestAccess: string;
  neighborhood: string;
}

interface SectionConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  placeholder: string;
  tips: string[];
  example: string;
}

interface CategoryConfig {
  title: string;
  subtitle: string;
  sections: {
    summary: SectionConfig;
    space: SectionConfig;
    access: SectionConfig;
    neighborhood: SectionConfig;
  };
}

interface DescriptionStepProps {
  data: DescriptionData;
  propertyCategory: ListingData['propertyType']['category'];
  propertyLocation: ListingData['location'];
  propertyType: ListingData['propertyType'];
  onUpdate: (data: DescriptionData) => void;
  onNext: () => void;
  onBack: () => void;
}

// Configuration par type de bien
const getCategoryConfig = (category: ListingData['propertyType']['category']): CategoryConfig => {
  const houseConfig: CategoryConfig = {
    title: "Décrivez votre logement",
    subtitle: "Une description détaillée attire plus de voyageurs",
    sections: {
      summary: {
        title: 'Présentation',
        description: 'Donnez envie aux voyageurs de séjourner chez vous',
        icon: Home,
        placeholder: 'Décrivez brièvement votre logement. Quels sont ses atouts principaux ?',
        tips: [
          'Commencez par une phrase accrocheuse',
          'Mentionnez les 2-3 atouts principaux',
          'Décrivez l\'ambiance générale',
          'Terminez par une invitation chaleureuse'
        ],
        example: "Notre magnifique appartement vous offre une vue imprenable sur la ville de Cotonou. Récemment rénové, il combine confort moderne et charme authentique. Idéal pour les voyageurs en quête de sérénité et d'authenticité."
      },
      space: {
        title: 'Le logement',
        description: 'Détaillez chaque pièce, équipements et confort',
        icon: Home,
        placeholder: 'Décrivez chaque pièce, les équipements disponibles, la décoration, le confort...',
        tips: [
          'Décrivez chaque pièce une par une',
          'Mentionnez les équipements inclus',
          'Parlez du confort et de la décoration',
          'Incluez des détails pratiques'
        ],
        example: "L'appartement comprend un salon spacieux avec TV écran plat, une cuisine entièrement équipée (four, micro-ondes, réfrigérateur), deux chambres avec literie de qualité et une salle de bain moderne. La terrasse offre un espace détente avec vue sur la ville."
      },
      access: {
        title: 'Accès des voyageurs',
        description: 'Quels espaces peuvent utiliser les voyageurs ?',
        icon: Users,
        placeholder: 'Quels espaces peuvent utiliser les voyageurs ? Accès aux commodités, équipements partagés...',
        tips: [
          'Précisez quels espaces sont accessibles',
          'Mentionnez les équipements partagés',
          'Indiquez les restrictions éventuelles',
          'Parlez des modalités d\'entrée'
        ],
        example: "Les voyageurs ont accès à tout l'appartement, y compris la cuisine équipée, la terrasse et le WiFi haut débit. Un parking sécurisé est disponible sur demande. Les espaces communs de la résidence (piscine, jardin) sont également accessibles."
      },
      neighborhood: {
        title: 'Le quartier',
        description: 'Décrivez l\'environnement et les alentours',
        icon: MapPin,
        placeholder: 'Décrivez le quartier, les transports, commerces, restaurants à proximité, ambiance...',
        tips: [
          'Décrivez l\'ambiance du quartier',
          'Liste les commerces à proximité',
          'Mentionnez les transports en commun',
          'Recommandez des restaurants/cafés'
        ],
        example: "Situé dans le quartier résidentiel de Haie Vive, vous serez à 10 minutes à pied du centre commercial, à 5 minutes des restaurants locaux et à 15 minutes de la plage. Le quartier est calme, sécurisé et bien desservi par les transports en commun."
      }
    }
  };

  const officeConfig: CategoryConfig = {
    title: "Décrivez votre espace professionnel",
    subtitle: "Une description claire attire les entreprises et professionnels",
    sections: {
      summary: {
        title: 'Présentation du bureau',
        description: 'Votre solution professionnelle idéale',
        icon: Building,
        placeholder: 'Présentez votre espace de travail. Quels sont ses avantages pour les professionnels ?',
        tips: [
          'Mentionnez le type d\'espace (bureau privé, coworking, suite)',
          'Décrivez l\'environnement de travail',
          'Mettez en avant les services professionnels',
          'Parlez de la localisation stratégique'
        ],
        example: "Notre espace de coworking moderne offre un environnement professionnel idéal pour les entrepreneurs et freelances. Situé en plein cœur du quartier d'affaires, il combine confort, technologie et networking de qualité."
      },
      space: {
        title: 'Infrastructures et équipements',
        description: 'Détaillez les installations professionnelles',
        icon: Briefcase,
        placeholder: 'Décrivez les bureaux, salles de réunion, équipements technologiques, espaces communs...',
        tips: [
          'Détaillez les postes de travail',
          'Mentionnez les équipements technologiques',
          'Parlez des espaces de réunion',
          'Décrivez les services de support'
        ],
        example: "L'espace comprend des bureaux ergonomiques, 3 salles de réunion équipées (vidéoprojecteur, tableau blanc), une kitchenette, un salon de détente et une salle de pause. Fibre optique 1Gbps, imprimante/scanner couleur et support IT inclus."
      },
      access: {
        title: 'Accès et horaires',
        description: 'Conditions d\'utilisation des locaux',
        icon: Globe,
        placeholder: 'Horaires d\'accès, modalités d\'entrée, espaces accessibles, services inclus...',
        tips: [
          'Précisez les horaires d\'accès',
          'Mentionnez les services inclus',
          'Décrivez les modalités d\'entrée',
          'Parlez de la flexibilité'
        ],
        example: "Accès 24h/24 et 7j/7 avec badge sécurisé. Les résidents ont accès à toutes les installations, au café/thé illimité, au service de réception et à la gestion du courrier. Parking sécurisé disponible en option."
      },
      neighborhood: {
        title: 'Localisation et accès',
        description: 'Avantages géographiques et desserte',
        icon: MapPin,
        placeholder: 'Localisation stratégique, transports en commun, restaurants d\'affaires, services bancaires à proximité...',
        tips: [
          'Décrivez la localisation stratégique',
          'Mentionnez les transports à proximité',
          'Listez les restaurants d\'affaires',
          'Parlez des services de proximité'
        ],
        example: "Situé dans la tour administrative, à 2 minutes à pied de la station de métro, à proximité des banques, restaurants d'affaires et hôtels. Excellente desserte par les transports en commun et parking facile."
      }
    }
  };

  const eventConfig: CategoryConfig = {
    title: "Décrivez votre espace événementiel",
    subtitle: "Une description complète attire les organisateurs d'événements",
    sections: {
      summary: {
        title: 'Présentation du lieu',
        description: 'Votre lieu idéal pour événements',
        icon: Calendar,
        placeholder: 'Présentez votre espace événementiel. Pour quels types d\'événements est-il adapté ?',
        tips: [
          'Décrivez le style du lieu (moderne, classique, industriel)',
          'Mentionnez les types d\'événements adaptés',
          'Parlez de la capacité d\'accueil',
          'Mettez en avant l\'ambiance'
        ],
        example: "Notre salle de réception élégante est l'endroit parfait pour vos mariages, galas et événements d'entreprise. Avec sa capacité de 300 personnes et son jardin paysager, elle offre un cadre prestigieux et flexible."
      },
      space: {
        title: 'Installations événementielles',
        description: 'Équipements et aménagements spécifiques',
        icon: Music,
        placeholder: 'Décrivez les équipements audiovisuels, la scène, l\'éclairage, la cuisine, les vestiaires...',
        tips: [
          'Détaillez les équipements audiovisuels',
          'Mentionnez les installations scéniques',
          'Parlez de la logistique (catering, vestiaires)',
          'Décrivez les options d\'aménagement'
        ],
        example: "La salle est équipée d'une scène modulable, d'un système son professionnel, d'éclairages LED programmables et de 3 écrans géants. Une cuisine professionnelle, des vestiaires et un espace cocktail de 200m² complètent l'offre."
      },
      access: {
        title: 'Services et accompagnement',
        description: 'Services inclus et conditions',
        icon: Wine,
        placeholder: 'Services inclus (coordination, catering, sécurité), modalités d\'accès, équipements fournis...',
        tips: [
          'Listez les services inclus',
          'Mentionnez l\'accompagnement professionnel',
          'Parlez des options de catering',
          'Décrivez les services de sécurité'
        ],
        example: "Un coordinateur événementiel dédié vous accompagne. Services inclus : équipement audiovisuel, tables/chaises, nappes, vestiaire. Options disponibles : catering, bar service, sécurité, décoration florale."
      },
      neighborhood: {
        title: 'Accessibilité et parking',
        description: 'Accès et commodités pour les invités',
        icon: Coffee,
        placeholder: 'Accès routier, parking disponible, hébergements à proximité, transports en commun...',
        tips: [
          'Décrivez l\'accès routier',
          'Mentionnez le parking disponible',
          'Listez les hébergements proches',
          'Parlez des transports pour invités'
        ],
        example: "Accès facile depuis l'autoroute, parking gratuit pour 200 véhicules. Nombreux hôtels 4* à moins de 10 minutes. Navette depuis l'aéroport organisable. Centre-ville accessible en 15 minutes."
      }
    }
  };

  switch (category) {
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

// Interface pour les sections de l'interface
interface UISection {
  id: 'summary' | 'space' | 'access' | 'neighborhood';
  title: string;
  description: string;
  icon: LucideIcon;
  placeholder: string;
  tips: string[];
  example: string;
  maxLength: number;
  dataKey: keyof DescriptionData;
}

export const DescriptionStep: React.FC<DescriptionStepProps> = ({
  data,
  propertyCategory,
  onUpdate,
}) => {
  const [descriptions, setDescriptions] = useState<DescriptionData>(data);
  const [activeSection, setActiveSection] = useState<'summary' | 'space' | 'access' | 'neighborhood'>('summary');

  const categoryConfig = getCategoryConfig(propertyCategory);
  
  const sections: UISection[] = [
    {
      id: 'summary',
      ...categoryConfig.sections.summary,
      maxLength: 500,
      dataKey: 'summary'
    },
    {
      id: 'space',
      ...categoryConfig.sections.space,
      maxLength: 1000,
      dataKey: 'spaceDescription'
    },
    {
      id: 'access',
      ...categoryConfig.sections.access,
      maxLength: 500,
      dataKey: 'guestAccess'
    },
    {
      id: 'neighborhood',
      ...categoryConfig.sections.neighborhood,
      maxLength: 500,
      dataKey: 'neighborhood'
    }
  ];

  const handleChange = (section: keyof DescriptionData, value: string) => {
    const updated = { ...descriptions, [section]: value };
    setDescriptions(updated);
    onUpdate(updated);
  };

  const activeSectionData = sections.find(s => s.id === activeSection);

  const getCharacterCount = (text: string) => text.length;
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const characterCounts = {
    summary: getCharacterCount(descriptions.summary),
    space: getCharacterCount(descriptions.spaceDescription),
    access: getCharacterCount(descriptions.guestAccess),
    neighborhood: getCharacterCount(descriptions.neighborhood),
  };

  const wordCounts = {
    summary: getWordCount(descriptions.summary),
    space: getWordCount(descriptions.spaceDescription),
    access: getWordCount(descriptions.guestAccess),
    neighborhood: getWordCount(descriptions.neighborhood),
  };

  const canContinue = 
    descriptions.summary.length >= 50 && 
    descriptions.spaceDescription.length >= 100 &&
    descriptions.guestAccess.length >= 20 &&
    descriptions.neighborhood.length >= 30;

  // Badge de catégorie
  const getCategoryBadge = () => {
    switch(propertyCategory) {
      case 'house':
        return { color: 'bg-green-100 text-green-800', icon: Home, label: 'Logement' };
      case 'office':
        return { color: 'bg-blue-100 text-blue-800', icon: Building, label: 'Bureau' };
      case 'event':
        return { color: 'bg-purple-100 text-purple-800', icon: Calendar, label: 'Événement' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Home, label: 'Logement' };
    }
  };

  const categoryBadge = getCategoryBadge();
  const BadgeIcon = categoryBadge.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
      {/* En-tête avec badge */}
      <div className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={`px-3 py-1 sm:px-4 sm:py-2 ${categoryBadge.color} rounded-full flex items-center gap-1 sm:gap-2`}>
            <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-xs sm:text-sm">{categoryBadge.label}</span>
          </div>
          <span className="text-gray-500 text-xs sm:text-sm">• Description détaillée</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          {categoryConfig.title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          {categoryConfig.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Navigation des sections */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 sm:top-8 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const count = characterCounts[section.id];
              const words = wordCounts[section.id];
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all
                    ${isActive 
                      ? 'bg-brand/10 border border-brand' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className={`
                      p-1.5 sm:p-2 rounded-lg flex-shrink-0
                      ${isActive ? 'bg-brand/20 text-brand' : 'bg-gray-200 text-gray-600'}
                    `}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{section.title}</h3>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{section.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {words} mot{words !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs font-medium">
                      <span className={count >= (section.id === 'space' ? 100 : 50) ? 'text-green-600' : 'text-yellow-600'}>
                        {count}/{section.maxLength}
                      </span>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="mt-1.5 w-full bg-gray-200 rounded-full h-0.5 sm:h-1">
                    <div 
                      className="bg-brand h-0.5 sm:h-1 rounded-full"
                      style={{ width: `${Math.min(100, (count / section.maxLength) * 100)}%` }}
                    />
                  </div>
                </button>
              );
            })}
            
            {/* Conseils généraux adaptés */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
              <h4 className="font-bold text-blue-900 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                Conseils d&apos;écriture
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-0.5 sm:space-y-1">
                <li>• Soyez précis et professionnel</li>
                <li>• Utilisez un vocabulaire adapté</li>
                <li>• Mettez en avant les avantages spécifiques</li>
                <li>• Corrigez les fautes d&apos;orthographe</li>
                {propertyCategory === 'house' && <li>• Évoquez l&apos;ambiance et le confort</li>}
                {propertyCategory === 'office' && <li>• Soulignez les avantages professionnels</li>}
                {propertyCategory === 'event' && <li>• Détaillez la logistique événementielle</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Éditeur de texte */}
        <div className="lg:col-span-2">
          {activeSectionData && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-1">
                    <div className="p-1.5 sm:p-2 bg-brand/10 rounded-lg flex-shrink-0">
                      <activeSectionData.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-brand" />
                    </div>
                    <span className="line-clamp-1">{activeSectionData.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">{activeSectionData.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-500">Caractères</div>
                  <div className={`
                    text-xl sm:text-2xl font-bold
                    ${characterCounts[activeSection] >= (activeSection === 'space' ? 100 : 50) 
                      ? 'text-green-600' 
                      : characterCounts[activeSection] > 0 
                        ? 'text-yellow-600' 
                        : 'text-gray-400'
                    }
                  `}>
                    {characterCounts[activeSection]}/{activeSectionData.maxLength}
                  </div>
                </div>
              </div>
              
              {/* Zone de texte */}
              <textarea
                value={descriptions[activeSectionData.dataKey]}
                onChange={(e) => handleChange(activeSectionData.dataKey, e.target.value)}
                placeholder={activeSectionData.placeholder}
                className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none text-sm sm:text-base"
                maxLength={activeSectionData.maxLength}
                rows={8}
              />
              
              {/* Conseils spécifiques */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <h4 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Que dois-je écrire ici ?</h4>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-0.5 sm:space-y-1">
                  {activeSectionData.tips.map((tip: string, index: number) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
              
              {/* Exemple adapté */}
              <div className="mt-4 sm:mt-6">
                <button
                  onClick={() => {
                    handleChange(activeSectionData.dataKey, activeSectionData.example);
                  }}
                  className="text-xs sm:text-sm text-brand hover:text-brand-dark font-medium flex items-center gap-1.5 sm:gap-2"
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  Voir un exemple pour cette section
                </button>
              </div>
            </div>
          )}
          
          {/* Vue d'ensemble */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Progression globale</h3>
            <div className="space-y-3 sm:space-y-4">
              {sections.map((section) => {
                const count = characterCounts[section.id];
                const isComplete = count >= (section.id === 'space' ? 100 : 50);
                
                return (
                  <div key={section.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`
                        w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm
                        ${isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}
                      `}>
                        {isComplete ? '✓' : section.id.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-sm sm:text-base">{section.title}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {count}/{section.id === 'space' ? '100+' : '50+'} caractères
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Indicateur de complétion */}
            <div className="mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">Description complète</div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {canContinue ? '✓ Toutes les sections sont suffisamment remplies' : 'Remplissez toutes les sections pour continuer'}
                  </div>
                </div>
                <div className={`
                  px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base self-start sm:self-auto
                  ${canContinue ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                `}>
                  {canContinue ? '✓ Prêt' : 'En cours'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};