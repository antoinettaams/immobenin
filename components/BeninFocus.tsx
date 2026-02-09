"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const cities = [
  { name: "Cotonou", top: "85%", left: "60%" },
  { name: "Porto-Novo", top: "60%", left: "60%" },
  { name: "Abomey-Calavi", top: "25%", left: "25%" },
  { name: "Parakou", top: "45%", left: "55%" }, 
] as const;

export const BeninFocus: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full bg-brand opacity-5 skew-x-12" 
        aria-hidden="true" 
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Texte de présentation */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 border border-brand/50 rounded-full text-brand text-sm font-semibold mb-6"
            role="status"
            aria-label="Ancrage Local"
          >
            <span 
              className="w-2 h-2 bg-brand rounded-full animate-pulse" 
              aria-hidden="true" 
            />
            Ancrage Local
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            De Cotonou au <br className="hidden md:block" />Nord Bénin
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Une plateforme 100% conçue pour le Bénin. Nous couvrons les grandes villes et les zones touristiques pour vous offrir le meilleur choix.
          </p>
          
          <ul className="space-y-4 w-full flex flex-col items-center lg:items-start">
            {['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi'].map((city, index) => (
               <li 
                 key={city} 
                 className="flex items-center gap-3 text-xl font-medium"
                 aria-label={`Présent à ${city}`}
               >
                 <MapPin 
                   className="text-brand w-6 h-6 flex-shrink-0" 
                   aria-hidden="true" 
                 />
                 {city}
               </li>
            ))}
          </ul>
        </div>

        {/* Carte abstraite du Bénin */}
        <div 
          className="relative h-[500px] bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8 flex items-center justify-center overflow-hidden w-full"
          aria-label="Carte des villes couvertes au Bénin"
          role="img"
        >
          {/* Pattern de fond */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
              backgroundSize: '30px 30px' 
            }}
            aria-hidden="true"
          />
           
           {/* Forme stylisée du Bénin */}
           <div 
             className="relative w-48 h-[80%] bg-gray-700/50 rounded-[40px] border-2 border-dashed border-gray-600"
             aria-hidden="true"
           >
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  className="absolute flex items-center gap-2"
                  style={{ 
                    top: city.top, 
                    left: city.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  aria-label={`Localisation de ${city.name}`}
                >
                  {/* Point animé */}
                  <div className="relative">
                    <div 
                      className="w-4 h-4 bg-brand rounded-full relative z-10" 
                      aria-hidden="true"
                    />
                    <div 
                      className="w-4 h-4 bg-brand rounded-full absolute inset-0 animate-ping" 
                      aria-hidden="true"
                    />
                  </div>
                  {/* Étiquette de ville */}
                  <span 
                    className="text-xs font-bold bg-gray-900 px-2 py-1 rounded border border-gray-700 whitespace-nowrap"
                  >
                    {city.name}
                  </span>
                </motion.div>
              ))}
           </div>
           
           {/* Info flottante */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ 
               duration: 4, 
               repeat: Infinity,
               ease: "easeInOut"
             }}
             className="absolute top-10 right-10 bg-white text-gray-900 p-4 rounded-xl shadow-lg max-w-[150px]"
             aria-label="Plus de 500 biens disponibles"
           >
              <p className="font-bold text-2xl text-brand">500+</p>
              <p className="text-xs font-semibold">
                Biens disponibles aujourd&apos;hui
              </p>
           </motion.div>
        </div>

      </div>
    </section>
  );
};