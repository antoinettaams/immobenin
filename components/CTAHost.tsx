"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from './Button';

export const OwnerCTA: React.FC = () => {
  const router = useRouter();

  const handlePublishClick = (): void => {
    router.push('/publish');
  };

  return (
    <section 
      className="py-12 md:py-24 bg-gray-50"
      aria-labelledby="owner-cta-title"
    >
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white rounded-2xl md:rounded-[3rem] overflow-hidden shadow-lg md:shadow-xl flex flex-col md:flex-row">
            {/* Texte et call-to-action */}
            <div className="md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
               <h2 
                 id="owner-cta-title"
                 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6"
               >
                 Vous avez un espace inutilisé ?
               </h2>
               <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-xl">
                 Rentabilisez-le facilement. Que ce soit une chambre d&apos;amis, une maison de vacances ou une salle de fête, accueillez des voyageurs et générez des revenus.
               </p>
               <div className="w-full flex justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    onClick={handlePublishClick}
                    aria-label="Publier mon espace gratuitement sur ImmoBenin"
                    className="w-full md:w-auto px-6 py-2 text-base md:text-lg"
                  >
                    Publier mon espace
                  </Button>
               </div>
            </div>

            {/* Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative min-h-[250px] md:min-h-[400px] order-first md:order-last">
              <div className="relative w-full h-full">
                <Image
                  src="/images/home/cta.jpg"
                  alt="Propriétaire accueillant des voyageurs dans un espace bien aménagé"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-black/10"
                  aria-hidden="true"
                />
              </div>
              
              {/* Badge flottant pour mobile */}
              <div className="absolute bottom-4 left-4 md:hidden">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                  Revenus supplémentaires garantis
                </span>
              </div>
            </div>
         </div>

         {/* Stats supplémentaires pour desktop */}
         <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12 text-center">
           <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm">
             <div className="text-2xl md:text-3xl font-bold text-brand mb-2">0%</div>
             <div className="text-gray-600 text-sm md:text-base">Commission à l&apos;inscription</div>
           </div>
           <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm">
             <div className="text-2xl md:text-3xl font-bold text-brand mb-2">24h</div>
             <div className="text-gray-600 text-sm md:text-base">Annonce publiée en moins de</div>
           </div>
           <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm">
             <div className="text-2xl md:text-3xl font-bold text-brand mb-2">500+</div>
             <div className="text-gray-600 text-sm md:text-base">Hôtes actifs au Bénin</div>
           </div>
         </div>
       </div>
    </section>
  );
};