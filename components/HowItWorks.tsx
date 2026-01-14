"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointerClick, Smile, Camera, MessageCircle, Wallet } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [role, setRole] = useState<'tenant' | 'host'>('tenant');

  const steps = {
    tenant: [
      { 
        icon: Search, 
        title: "Recherchez", 
        desc: "Filtrez par ville, prix et type de bien.",
        color: "text-blue-600"
      },
      { 
        icon: MousePointerClick, 
        title: "Réservez", 
        desc: "Discutez par WhatsApp et payez en sécurité.",
        color: "text-green-600"
      },
      { 
        icon: Smile, 
        title: "Profitez", 
        desc: "Installez-vous et vivez votre meilleure expérience.",
        color: "text-purple-600"
      }
    ],
    host: [
      { 
        icon: Camera, 
        title: "Publiez", 
        desc: "Créez votre annonce gratuite avec de belles photos.",
        color: "text-orange-600"
      },
      { 
        icon: MessageCircle, 
        title: "Échangez", 
        desc: "Recevez des messages de réservations.",
        color: "text-cyan-600"
      },
      { 
        icon: Wallet, 
        title: "Encaissez", 
        desc: "Recevez vos paiements de manière sécurisée.",
        color: "text-emerald-600"
      }
    ]
  } as const;

  const handleRoleToggle = (newRole: 'tenant' | 'host'): void => {
    setRole(newRole);
  };

  return (
    <section 
      className="py-20 lg:py-24 bg-white overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h2 
          id="how-it-works-title"
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 lg:mb-12"
        >
          Comment ça marche ?
        </h2>
        
        {/* Toggle Switch */}
        <div className="flex justify-center mb-12 lg:mb-16" role="tablist" aria-label="Choisissez votre profil">
          <div className="bg-gray-100 p-1 rounded-full inline-flex relative">
            {/* Fond blanc pour l'option active */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(140px-0.5rem)] bg-white rounded-full shadow-sm transition-all duration-300 ${
                role === 'host' ? 'left-[calc(144px-0.25rem)]' : 'left-[0.25rem]'
              }`}
              aria-hidden="true"
            />
            
            {/* Bouton "Je loue" */}
            <button 
              onClick={() => handleRoleToggle('tenant')}
              className={`relative z-10 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm transition-colors w-[130px] md:w-[140px] ${
                role === 'tenant' ? 'text-brand' : 'text-gray-500'
              }`}
              role="tab"
              aria-selected={role === 'tenant'}
              aria-controls="tenant-steps"
              id="tenant-tab"
            >
              Je loue
            </button>
            
            {/* Bouton "Je suis hôte" */}
            <button 
              onClick={() => handleRoleToggle('host')}
              className={`relative z-10 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm transition-colors w-[130px] md:w-[140px] ${
                role === 'host' ? 'text-brand' : 'text-gray-500'
              }`}
              role="tab"
              aria-selected={role === 'host'}
              aria-controls="host-steps"
              id="host-tab"
            >
              Je suis hôte
            </button>
          </div>
        </div>

        {/* Steps - Structure accessible */}
        <div className="relative">
          {/* Connecting Line - Desktop only */}
          <div 
            className="absolute top-12 left-0 w-full h-1 bg-gray-100 hidden md:block -z-10" 
            aria-hidden="true"
          />
          
          {/* Contenu des étapes */}
          <div 
            id={role === 'tenant' ? 'tenant-steps' : 'host-steps'}
            role="tabpanel"
            aria-labelledby={role === 'tenant' ? 'tenant-tab' : 'host-tab'}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps[role].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.article
                  key={`${role}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="flex flex-col items-center"
                  aria-label={`Étape ${index + 1}: ${step.title}`}
                >
                  {/* Icône */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 lg:w-24 lg:h-24 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center shadow-lg mb-4 lg:mb-6"
                  >
                    <div className={`${step.color} p-2 rounded-full bg-gray-50`}>
                      <IconComponent 
                        className="w-8 h-8 lg:w-10 lg:h-10" 
                        aria-hidden="true" 
                      />
                    </div>
                  </motion.div>
                  
                  {/* Numéro d'étape (accessibilité) */}
                  <div 
                    className="sr-only"
                    aria-hidden="false"
                  >
                    Étape {index + 1} sur 3
                  </div>
                  
                  {/* Titre et description */}
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base px-4 lg:px-8">
                    {step.desc}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};