// components/publish/steps/ReviewStep.tsx
"use client";
import React from 'react';
import { 
  Check, 
  Edit2, 
  Users, 
  Star, 
  Shield,
  Home,
  Building,
  MapPin,
  Camera,
  DollarSign,
  Globe,
  AlertCircle
} from 'lucide-react';
import { ListingData } from '../PublishFlow';

interface ReviewStepProps {
  data: ListingData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
  // PROPS POUR LES CONDITIONS
  termsAccepted: boolean;
  infoCertified: boolean;
  onTermsAcceptedChange: (value: boolean) => void;
  onInfoCertifiedChange: (value: boolean) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onEdit,
  onSubmit,
  onBack,
  isLoading = false,
  error = null,
  // DESTRUCTURER LES PROPS DES CONDITIONS
  termsAccepted,
  infoCertified,
  onTermsAcceptedChange,
  onInfoCertifiedChange
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BJ').format(price) + ' FCFA';
  };

  // Déterminer l'unité de temps pour le prix
  const getPriceUnit = () => {
    const { propertyType } = data;
    
    if (propertyType.category === 'office') {
      if (propertyType.subType === 'coworking') return 'jour';
      if (propertyType.subType === 'salle_reunion') return 'heure';
      return 'mois';
    }
    
    if (propertyType.category === 'event') {
      if (propertyType.subType === 'soiree') return 'soirée';
      return 'jour';
    }
    
    return 'nuit'; // Pour house
  };

  const priceUnit = getPriceUnit();

  // Affichage adapté selon le type de bien 
  const getBasicsContent = () => {
    const { basics, propertyType } = data;
    
    if (propertyType.category === 'house') {
      return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Voyageurs max</div>
            <div className="font-bold text-sm sm:text-base">{basics.maxGuests || 0} personnes</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Chambres</div>
            <div className="font-bold text-sm sm:text-base">{basics.bedrooms || 0}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Lits</div>
            <div className="font-bold text-sm sm:text-base">{basics.beds || 0}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Salles de bain</div>
            <div className="font-bold text-sm sm:text-base">{basics.bathrooms || 0}</div>
          </div>
        </div>
      );
    }
    
    if (propertyType.category === 'office') {
      return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Postes de travail</div>
            <div className="font-bold text-sm sm:text-base">{basics.workstations || 0}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Salles de réunion</div>
            <div className="font-bold text-sm sm:text-base">{basics.meetingRooms || 0}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Réception</div>
            <div className="font-bold text-sm sm:text-base">{basics.hasReception ? 'Oui' : 'Non'}</div>
          </div>
        </div>
      );
    }
    
    if (propertyType.category === 'event') {
      return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Capacité</div>
            <div className="font-bold text-sm sm:text-base">{basics.eventCapacity || 0} personnes</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Places parking</div>
            <div className="font-bold text-sm sm:text-base">{basics.parkingSpots || 0}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Cuisine</div>
            <div className="font-bold text-sm sm:text-base">{basics.kitchenAvailable ? 'Oui' : 'Non'}</div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Affichage du type adapté
  const getTypeContent = () => {
    const { propertyType } = data;
    
    const typeLabels = {
      house: 'Logement',
      office: 'Bureau',
      event: 'Événement'
    };
    
    const subTypeLabels: Record<string, string> = {
      'appartement': 'Appartement',
      'villa': 'Villa',
      'studio': 'Studio',
      'coworking': 'Espace Coworking',
      'bureau_prive': 'Bureau Privé',
      'salle_reunion': 'Salle de Réunion',
      'mariage': 'Salle de Mariage',
      'seminaire': 'Salle de Séminaire',
      'soiree': 'Espace Soirée'
    };
    
    const privacyLabels = {
      'entire': 'Espace entier',
      'private': 'Espace privé',
      'shared': 'Espace partagé'
    };

    return (
      <div>
        <div className="font-bold text-sm sm:text-base capitalize">{typeLabels[propertyType.category]}</div>
        <div className="text-gray-600 text-xs sm:text-sm capitalize mt-0.5">
          {subTypeLabels[propertyType.subType] || propertyType.subType}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {privacyLabels[propertyType.privacy]}
        </div>
      </div>
    );
  };

  // Sections à afficher selon le type
  const getSections = () => {
    const { propertyType } = data;
    const sections = [];

    // Section Type 
    sections.push({
      id: 0,
      title: 'Informations de contact',
      icon: Users,
      content: (
        <div>
          <div className="font-bold text-sm sm:text-base">{data.owner.nom}</div>
          <div className="text-gray-600 text-xs sm:text-sm mt-0.5">{data.owner.email}</div>
          <div className="text-xs text-gray-500 mt-1">{data.owner.telephone}</div>
        </div>
      )
    });

    // Section Type d'espace
    sections.push({
      id: 1,
      title: 'Type d\'espace',
      icon: propertyType.category === 'house' ? Home : 
            propertyType.category === 'office' ? Building : Globe,
      content: getTypeContent()
    });

    // Section Localisation
    sections.push({
      id: 2,
      title: 'Localisation',
      icon: MapPin,
      content: (
        <div>
          <div className="font-bold text-sm sm:text-base">{data.location.city}</div>
          <div className="text-gray-600 text-xs sm:text-sm mt-0.5">{data.location.neighborhood}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {data.location.address}
          </div>
        </div>
      )
    });

    // Section Caractéristiques 
    sections.push({
      id: 3,
      title: 'Caractéristiques',
      icon: Users,
      content: getBasicsContent()
    });

    // Section Équipements
    if (data.amenities && data.amenities.length > 0) {
      sections.push({
        id: 4,
        title: 'Équipements',
        icon: Star,
        content: (
          <div>
            <div className="font-bold text-sm sm:text-base">{data.amenities.length} équipements</div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">
              {data.amenities.slice(0, 3).join(', ')}
              {data.amenities.length > 3 && ` et ${data.amenities.length - 3} autres`}
            </div>
          </div>
        )
      });
    }

    // Section Photos
    if (data.photos && data.photos.length > 0) {
      sections.push({
        id: 5,
        title: 'Photos',
        icon: Camera,
        content: (
          <div>
            <div className="font-bold text-sm sm:text-base">{data.photos.length} photos</div>
            <div className="text-gray-600 text-xs mt-0.5 sm:mt-1">
              {data.photos.filter(p => p.isPrimary).length > 0 
                ? 'Photo de couverture sélectionnée' 
                : 'Aucune photo de couverture'
              }
            </div>
          </div>
        )
      });
    }

    // Section Titre
    if (data.title) {
      sections.push({
        id: 6,
        title: 'Titre',
        content: (
          <div>
            <div className="font-bold text-sm sm:text-base line-clamp-2">{data.title}</div>
            <div className="text-gray-600 text-xs mt-0.5 sm:mt-1">
              {data.title.length} caractères
            </div>
          </div>
        )
      });
    }

    // Section Description
    if (data.description && Object.values(data.description).some(val => val)) {
      sections.push({
        id: 7,
        title: 'Description',
        content: (
          <div>
            <div className="font-bold text-sm sm:text-base">4 sections complétées</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
              {data.description.summary ? '✓ ' : '✗ '}Résumé • 
              {data.description.spaceDescription ? ' ✓ ' : ' ✗ '}L'espace • 
              {data.description.guestAccess ? ' ✓ ' : ' ✗ '}Accès • 
              {data.description.neighborhood ? ' ✓ ' : ' ✗ '}Quartier
            </div>
          </div>
        )
      });
    }

    // Section Prix
    sections.push({
      id: 8,
      title: 'Prix',
      icon: DollarSign,
      content: (
        <div>
          <div className="font-bold text-sm sm:text-base">{formatPrice(data.pricing.basePrice)} / {priceUnit}</div>
          <div className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
            {data.pricing.cleaningFee > 0 && `+ ${formatPrice(data.pricing.cleaningFee)} frais de nettoyage`}
            {data.pricing.cleaningFee === 0 && 'Aucun frais supplémentaire'}
          </div>
        </div>
      )
    });
    return sections;
  };

  const sections = getSections();

  const handleEdit = (stepNumber: number) => {
    onEdit(stepNumber);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
      {/* En-tête */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Vérifiez et publiez votre annonce
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          Vérifiez que toutes les informations sont correctes
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Colonne gauche : Récapitulatif */}
        <div className="lg:col-span-2">
          {/* Liste des sections */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Informations de votre annonce
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 sm:p-6 border border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {section.icon && (
                          <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                            <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          </div>
                        )}
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">{section.title}</h4>
                      </div>
                      <div className="pr-8 sm:pr-10">
                        {section.content}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(section.id)}
                      className="ml-2 sm:ml-4 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite : Actions et informations */}
        <div className="lg:col-span-1">
          {/* Carte d'information */}
          <div className="sticky top-6 sm:top-8 space-y-4 sm:space-y-6">
            {/* Statut */}
            <div className="p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Statut de l'annonce
              </h3>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sections complétées</span>
                  <span className="font-bold text-green-600 text-sm sm:text-base">
                    {sections.length}/{sections.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Photos</span>
                  <span className="font-bold text-sm sm:text-base">{data.photos?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Équipements</span>
                  <span className="font-bold text-sm sm:text-base">{data.amenities?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl bg-brand/5 border-brand/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-brand flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">Sécurisé par ImmoBenin</h4>
                </div>
              </div>
              
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-700">Paiements sécurisés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-700">Support 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-700">Protection des données</span>
                </li>
              </ul>
            </div>

            {/* Conditions de publication */}
            <div className="p-4 sm:p-6 border border-gray-200 rounded-xl sm:rounded-2xl bg-white">
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Conditions de publication
              </h4>
              
              <div className="space-y-3 sm:space-y-4">
                {/* Premier Label avec Liens */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => onTermsAcceptedChange(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand flex-shrink-0 cursor-pointer"
                    required
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-snug">
                    J'accepte les{" "}
                    <a 
                      href="/conditions" 
                      className="text-brand hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      conditions générales
                    </a>{" "}
                    et la{" "}
                    <a 
                      href="/confidentialite" 
                      className="text-brand hover:underline font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      politique de confidentialité
                    </a>{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>

                {/* Deuxième Label : Certification */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={infoCertified}
                    onChange={(e) => onInfoCertifiedChange(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand flex-shrink-0 cursor-pointer"
                    required
                  />
                  <span className="text-xs sm:text-sm text-gray-700 leading-snug">
                    Je certifie sur l'honneur que les informations fournies sont exactes et sincères.
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>

                {/* Message d'erreur si non cochés */}
                {!(termsAccepted && infoCertified) && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600">
                    ⚠️ Vous devez accepter toutes les conditions pour publier
                  </div>
                )}
              </div>

              {/* Indicateur de validation */}
              <div className="mt-4 text-center text-xs text-gray-500">
                {(termsAccepted && infoCertified) ? (
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    Toutes les conditions sont remplies
                  </div>
                ) : (
                  <div className="text-red-500">
                    {!termsAccepted && !infoCertified 
                      ? "2 conditions à accepter" 
                      : !termsAccepted 
                      ? "Conditions générales à accepter" 
                      : "Certification des informations requise"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};