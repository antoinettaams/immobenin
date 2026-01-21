"use client";
import React, { useState } from 'react';

// Import des étapes
import { HousingTypeStep } from './steps/HousingTypeStep';
import { LocationStep } from './steps/LocationStep';
import { BasicsStep } from './steps/BasicsStep';
import { AmenitiesStep } from './steps/AmenitiesStep';
import { PhotosStep } from './steps/PhotosStep';
import { TitleStep } from './steps/TitleStep';
import { DescriptionStep } from './steps/DescriptionStep';
import { PriceStep } from './steps/PriceStep';
import { ReviewStep } from './steps/ReviewStep';

// Types de données Airbnb-like
export interface ListingData {
  propertyType: { 
    category: 'house' | 'office' | 'event';
    subType: string;
    privacy: 'entire' | 'private' | 'shared';
  };

  location: {
    country: string;
    city: string;
    neighborhood: string;
    address: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };

  basics: {
    // Pour maison
    maxGuests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    privateEntrance?: boolean;
    
    // Pour bureau
    employees?: number;
    offices?: number;
    meetingRooms?: number;
    workstations?: number;
    hasReception?: boolean;
    
    // Pour événement
    eventCapacity?: number;
    kitchenAvailable?: boolean;
    parkingSpots?: number;
    wheelchairAccessible?: boolean;
    hasStage?: boolean;
    hasSoundSystem?: boolean;
    hasProjector?: boolean;
    hasCatering?: boolean;
    
    // Commun
    size?: number;
    floors?: number;
  };

  amenities: string[];

  photos: Array<{
    id: string;
    url: string;
    file: File | null;
    isPrimary: boolean;
  }>;

  title: string;

  description: {
    summary: string;
    spaceDescription: string;
    guestAccess: string;
    neighborhood: string;
  };

  pricing: {
    basePrice: number;
    currency: string;
    weeklyDiscount: number;
    monthlyDiscount: number;
    cleaningFee: number;
    extraGuestFee: number;
    securityDeposit: number;
  };

  rules: {
    checkInTime: string;
    checkOutTime: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    partiesAllowed: boolean;
    childrenAllowed: boolean;
  };
}

interface PublishFlowProps {
  onComplete?: () => void;
}

export const PublishFlow: React.FC<PublishFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [listingData, setListingData] = useState<ListingData>({
    propertyType: { category: 'house', subType: '', privacy: 'entire' },
    location: { country: 'Bénin', city: '', neighborhood: '', address: '' },
    basics: {
      // Valeurs par défaut pour maison
      maxGuests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      size: 50,
      floors: 0,
      privateEntrance: false,
    },
    amenities: [],
    photos: [],
    title: '',
    description: { summary: '', spaceDescription: '', guestAccess: '', neighborhood: '' },
    pricing: {
      basePrice: 0,
      currency: 'FCFA',
      weeklyDiscount: 10,
      monthlyDiscount: 20,
      cleaningFee: 0,
      extraGuestFee: 0,
      securityDeposit: 0,
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      childrenAllowed: true,
    }
  });

  // Mise à jour des données
  const updateData = <K extends keyof ListingData>(section: K, data: ListingData[K]) => {
    setListingData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 9) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => prev - 1);
    }
  };

  // Fonction pour sauvegarder et quitter
  const handleSaveAndExit = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem('draft_listing', JSON.stringify(listingData));
    
    // Afficher un message de confirmation
    alert('Votre annonce a été sauvegardée en brouillon. Vous pouvez la reprendre plus tard.');
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };

  // Fonction pour publier (dans ReviewStep)
  const handlePublish = () => {
    // Nettoyer le brouillon
    localStorage.removeItem('draft_listing');
    
    // Soumettre les données
    console.log('Publication complète:', listingData);
    onComplete?.();
    
    // Rediriger vers l'accueil
    window.location.href = '/';
  };

  // Rendu de l'étape actuelle
  const renderStep = () => {
    const { propertyType } = listingData;
    
    switch (currentStep) {
      case 1:
        return (
          <HousingTypeStep
            data={listingData.propertyType}
            onUpdate={(data) => updateData('propertyType', data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <LocationStep
            data={listingData.location}
            onUpdate={(data) => updateData('location', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <BasicsStep
            data={listingData.basics}
            propertyCategory={propertyType.category}
            onUpdate={(data) => updateData('basics', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <AmenitiesStep
            data={listingData.amenities}
            propertyCategory={listingData.propertyType.category}
            onUpdate={(data) => updateData('amenities', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <PhotosStep
            data={listingData.photos}
            onUpdate={(data) => updateData('photos', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <TitleStep
            data={listingData.title}
            propertyCategory={listingData.propertyType.category}
            propertyLocation={listingData.location}
            onUpdate={(data) => updateData('title', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <DescriptionStep
            data={listingData.description}
            propertyCategory={listingData.propertyType.category}
            propertyLocation={listingData.location}
            propertyType={listingData.propertyType}
            onUpdate={(data) => updateData('description', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 8:
        return (
          <PriceStep
            data={listingData.pricing}
            propertyCategory={listingData.propertyType.category}
            propertySubType={listingData.propertyType.subType}
            onUpdate={(data) => updateData('pricing', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 9:
        return (
          <ReviewStep
            data={listingData}
            onEdit={(stepNumber) => setCurrentStep(stepNumber)}
            onSubmit={handlePublish} // Utiliser la nouvelle fonction
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-brand">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2C16 2 3 10 3 18C3 24 8 29 16 31C24 29 29 24 29 18C29 10 16 2 16 2ZM16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19Z" />
                  <path d="M16 6L24 13V24H8V13L16 6Z" fill="white" fillOpacity="0.3"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ImmoBenin</span>
            </div>

            {/* Bouton sauvegarder - MODIFIÉ */}
            <button 
              onClick={handleSaveAndExit}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sauvegarder et quitter
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 max-w-5xl mx-auto px-8 py-8">
        {renderStep()}
      </main>

      {/* Footer avec barre de progression simple (Airbnb style) */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4">
          {/* Barre de progression horizontale simple */}
          <div className="relative mb-6">
            {/* Ligne de fond */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            
            {/* Ligne de progression */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 8) * 100}%` }}
            />
            
            {/* Points d'étape (juste des points, pas de titres) */}
            <div className="relative flex justify-between">
              {Array.from({ length: 9 }).map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                
                return (
                  <div key={index} className="relative flex flex-col items-center">
                    {/* Point simple */}
                    <div className={`
                      w-3 h-3 rounded-full border-2 z-10
                      transition-all duration-300
                      ${isCompleted 
                        ? 'bg-brand border-brand' 
                        : isActive 
                          ? 'bg-white border-brand' 
                          : 'bg-white border-gray-300'
                      }
                    `}>
                      {isCompleted && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white m-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boutons de navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Retour
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === 9} // Désactiver dans ReviewStep
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 9
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-brand text-white hover:bg-brand/90'
              }`}
            >
              {currentStep === 9 ? 'Publier' : 'Suivant'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};