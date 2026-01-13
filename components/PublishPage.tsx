"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Trees, CheckCircle2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/Button';

interface PublishPageProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Parlons de votre logement" },
  { id: 2, title: "Où est-il situé ?" },
  { id: 3, title: "Ajoutons des photos" },
  { id: 4, title: "Fixez votre prix" }
] as const;

interface HousingType {
  icon: React.ElementType;
  label: string;
}

const housingTypes: HousingType[] = [
  { icon: Home, label: "Maison" },
  { icon: Building2, label: "Appartement" },
  { icon: Trees, label: "Jardin / Terrain" },
  { icon: Home, label: "Chambre" },
  { icon: Building2, label: "Bureau" },
  { icon: Trees, label: "Événement" },
];

interface FormData {
  type: string;
  location: string;
  price: string;
}

export const PublishPage: React.FC<PublishPageProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({ 
    type: '', 
    location: '', 
    price: '' 
  });

  const nextStep = (): void => {
    if (currentStep < steps.length) {
      setCurrentStep(c => c + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(c => c - 1);
    } else {
      onBack();
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            key="step-1"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto"
            aria-labelledby="step-1-title"
          >
            <h2 
              id="step-1-title"
              className="text-3xl font-bold mb-8 text-center md:text-left"
            >
              Lequel de ces choix décrit le mieux votre logement ?
            </h2>
            <div 
              className="grid grid-cols-2 gap-4"
              role="radiogroup"
              aria-label="Types de logement"
            >
              {housingTypes.map((type, idx) => {
                const IconComponent = type.icon;
                return (
                  <button 
                    key={idx}
                    onClick={() => handleInputChange('type', type.label)}
                    className={`p-6 border rounded-xl flex flex-col items-center md:items-start gap-3 transition-all focus:outline-none focus:ring-2 focus:ring-brand ${
                      formData.type === type.label 
                        ? 'border-brand bg-brand/5 ring-2 ring-brand' 
                        : 'border-gray-200 hover:border-gray-900'
                    }`}
                    role="radio"
                    aria-checked={formData.type === type.label}
                    aria-label={type.label}
                  >
                    <IconComponent 
                      className={`w-8 h-8 ${formData.type === type.label ? 'text-brand' : 'text-gray-600'}`}
                      aria-hidden="true"
                    />
                    <span className="font-semibold">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            key="step-2"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto"
            aria-labelledby="step-2-title"
          >
            <h2 
              id="step-2-title"
              className="text-3xl font-bold mb-2 text-center md:text-left"
            >
              Où est situé votre logement ?
            </h2>
            <p className="text-gray-500 mb-8 text-center md:text-left">
              Votre adresse n&apos;est partagée avec les voyageurs qu&apos;une fois la réservation effectuée.
            </p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Ville (ex: Cotonou)" 
                className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                aria-label="Ville où se trouve votre logement"
              />
              <input 
                type="text" 
                placeholder="Quartier (ex: Haie Vive)" 
                className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                aria-label="Quartier où se trouve votre logement"
              />
              <button 
                type="button"
                className="flex items-center gap-2 text-brand font-bold p-2 hover:bg-brand/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label="Utiliser ma position actuelle"
              >
                <span className="underline">Utiliser ma position actuelle</span>
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            key="step-3"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto"
            aria-labelledby="step-3-title"
          >
            <h2 
              id="step-3-title"
              className="text-3xl font-bold mb-2 text-center md:text-left"
            >
              Ajoutez des photos
            </h2>
            <p className="text-gray-500 mb-8 text-center md:text-left">
              Pour démarrer, il vous faut 5 photos. Vous pourrez en ajouter d&apos;autres plus tard.
            </p>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
              role="button"
              tabIndex={0}
              aria-label="Zone de dépôt de photos"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Trigger file upload
                }
              }}
            >
              <UploadCloud 
                className="w-16 h-16 text-gray-400 mb-4" 
                aria-hidden="true" 
              />
              <span className="font-bold text-lg mb-2">
                Glissez vos photos ici
              </span>
              <span className="text-sm text-gray-500 mb-6">
                ou choisissez-les depuis votre appareil
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                aria-label="Importer des photos"
              >
                Importer des photos
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            key="step-4"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto text-center md:text-left"
            aria-labelledby="step-4-title"
          >
            <h2 
              id="step-4-title"
              className="text-3xl font-bold mb-2"
            >
              Fixez votre prix
            </h2>
            <p className="text-gray-500 mb-8">
              Vous pouvez le modifier à tout moment.
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <label htmlFor="price-input" className="sr-only">
                Prix par nuit en FCFA
              </label>
              <div className="relative">
                <input 
                  id="price-input"
                  type="text" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="25000" 
                  className="w-48 text-6xl font-bold text-gray-900 tracking-tighter text-center md:text-left outline-none placeholder:text-gray-200 bg-transparent"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value.replace(/[^0-9]/g, ''))}
                  aria-label="Prix par nuit en FCFA"
                />
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-lg text-gray-500">
                  FCFA
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-xl flex items-start gap-4">
              <div 
                className="p-2 bg-white rounded-full shadow-sm text-brand"
                aria-hidden="true"
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold mb-1">
                  Prix suggéré : 28.000 FCFA
                </h4>
                <p className="text-sm text-gray-600">
                  Basé sur des logements similaires à {formData.location || 'votre zone'}.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <div key="default">Contenu par défaut</div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-white z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
    >
      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-gray-100">
        <button 
          onClick={onBack}
          className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand rounded-full p-1"
          aria-label="Retour à l'accueil"
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            fill="currentColor" 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-brand"
            aria-hidden="true"
          >
            <path d="M16 2C16 2 3 10 3 18C3 24 8 29 16 31C24 29 29 24 29 18C29 10 16 2 16 2ZM16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19Z" />
            <path d="M16 6L24 13V24H8V13L16 6Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </button>
        <div className="hidden md:block">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            aria-label="Enregistrer et quitter"
          >
            Enregistrer et quitter
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side (Form) */}
        <main className="w-full md:w-1/2 overflow-y-auto p-6 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </main>

        {/* Right Side (Visual) - Hidden on mobile */}
        <div 
          className="hidden md:flex w-1/2 bg-gradient-to-br from-brand/5 to-brand/10 items-center justify-center p-12 relative overflow-hidden"
          aria-hidden="true"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
              backgroundSize: 'auto'
            }}
          />
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-md"
          >
            {currentStep === 1 && (
              <h3 className="text-4xl font-extrabold text-brand-dark leading-tight">
                Commençons par l&apos;essentiel.
              </h3>
            )}
            {currentStep === 2 && (
              <h3 className="text-4xl font-extrabold text-brand-dark leading-tight">
                Les voyageurs aiment savoir où ils vont.
              </h3>
            )}
            {currentStep === 3 && (
              <h3 className="text-4xl font-extrabold text-brand-dark leading-tight">
                Une image vaut mille mots.
              </h3>
            )}
            {currentStep === 4 && (
              <h3 className="text-4xl font-extrabold text-brand-dark leading-tight">
                C&apos;est vous qui fixez les règles.
              </h3>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer / Navigation */}
      <footer className="h-20 border-t border-gray-100 flex items-center justify-between px-6 md:px-12 bg-white relative z-20">
        <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
          <motion.div 
            className="h-full bg-brand" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            aria-label={`Progression : ${Math.round(progress)}%`}
          />
        </div>
        
        <button 
          onClick={prevStep}
          className="font-bold underline text-gray-900 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand rounded px-2"
          aria-label="Étape précédente"
        >
          Retour
        </button>
        
        <Button 
          onClick={currentStep === steps.length ? onBack : nextStep}
          className="px-8"
          aria-label={currentStep === steps.length ? "Publier l'annonce" : "Passer à l'étape suivante"}
        >
          {currentStep === steps.length ? 'Publier' : 'Suivant'}
        </Button>
      </footer>
    </div>
  );
};