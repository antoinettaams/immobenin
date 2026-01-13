"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from './Button';
import { Search, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Hero: React.FC = () => {
  const router = useRouter();

  const handleSearchClick = (): void => {
    router.push('/search');
  };

  const handlePublishClick = (): void => {
    router.push('/publish');
  };

  return (
    <section 
      className="relative min-h-screen pt-24 pb-12 flex items-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50/20"
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">
          
          {/* Left Content - Centré sur mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 text-sm font-bold text-brand bg-brand/10 rounded-full"
              role="status"
              aria-label="Numéro 1 de la location au Bénin"
            >
              N°1 de la location au Bénin 🇧🇯
            </motion.div>
            
            <h1 
              id="hero-title"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6"
            >
              Louez ou proposez{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark block mt-2">
                des espaces
              </span>{' '}
              partout au Bénin
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Maisons, appartements meublés, bureaux, salles d&apos;événements ou terrains. 
              Trouvez l&apos;endroit idéal ou rentabilisez le vôtre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <Button 
                size="lg" 
                onClick={handleSearchClick}
                className="group w-full sm:w-auto justify-center"
                aria-label="Trouver un espace de location"
              >
                <Search 
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" 
                  aria-hidden="true" 
                />
                Trouver un espace
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handlePublishClick}
                className="group w-full sm:w-auto justify-center"
                aria-label="Mettre mon espace en location"
              >
                <Plus 
                  className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" 
                  aria-hidden="true" 
                />
                Mettre mon espace
              </Button>
            </div>

            {/* Stats pour mobile */}
            <div className="mt-12 lg:hidden grid grid-cols-3 gap-4 w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm text-center">
                <p className="text-2xl font-bold text-brand">500+</p>
                <p className="text-xs text-gray-600">Espaces</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm text-center">
                <p className="text-2xl font-bold text-brand">95%</p>
                <p className="text-xs text-gray-600">Satisfaction</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm text-center">
                <p className="text-2xl font-bold text-brand">50+</p>
                <p className="text-xs text-gray-600">Villes</p>
              </div>
            </div>
          </motion.div>

          {/* Right 3D Visual - Desktop only */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block perspective-1000"
            aria-hidden="true"
          >
            {/* Abstract shapes for background depth */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand/20 to-transparent rounded-full blur-3xl -z-10"
              aria-hidden="true"
            />

            <motion.figure
              whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src="https://picsum.photos/800/1000?random=1"
                alt="Belle maison au Bénin disponible à la location"
                width={800}
                height={1000}
                className="w-full h-full object-cover rounded-2xl"
                sizes="(max-width: 1024px) 0vw, 50vw"
                priority
              />
              
              {/* Floating UI Card 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4, 
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
                className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-3 max-w-[200px]"
                aria-label="Revenu estimé: 250.000 FCFA par mois"
              >
                <div 
                  className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs"
                  aria-hidden="true"
                >
                  XOF
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Revenu estimé</p>
                  <p className="text-sm font-bold text-gray-900">250.000 / mois</p>
                </div>
              </motion.div>

              {/* Floating UI Card 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: "easeInOut", 
                  delay: 1,
                  repeatType: "reverse"
                }}
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-3"
                aria-label="Plus de 1000 visiteurs ce mois-ci"
              >
                <div className="flex -space-x-2" aria-hidden="true">
                  <Image
                    src="https://picsum.photos/32/32?random=50"
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <Image
                    src="https://picsum.photos/32/32?random=51"
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <Image
                    src="https://picsum.photos/32/32?random=52"
                    alt=""
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">1k+ Visiteurs</p>
                  <p className="text-xs text-brand font-medium">Ce mois-ci</p>
                </div>
              </motion.div>
            </motion.figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
};