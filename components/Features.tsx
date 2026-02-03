"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Home, Building2, PartyPopper, Trees, Umbrella, ShieldCheck, MessageCircle, MapPin, HeartHandshake } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  image: string;
  description: string;
}

const categories: Category[] = [
  { id: '1', name: 'Maisons & Apparts', icon: Home, image: '/images/home/appart.jpg', description: 'Logements entiers pour votre confort' },
  { id: '2', name: 'Bureaux & Travail', icon: Building2, image: '/images/home/bureau.jpg', description: 'Espaces professionnels équipés' },
  { id: '3', name: 'Événements', icon: PartyPopper, image: '/images/home/salle-events.jpg', description: 'Salles pour mariages et fêtes' },
  { id: '4', name: 'Espaces Privés', icon: Trees, image: '/images/home/salle-privees.jpg', description: 'Salles de réunion, Jardins, cours et villas' },
  { id: '5', name: 'Tourisme', icon: Umbrella, image: '/images/home/tourisme.jpg', description: 'Hébergements pour vacanciers' },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section 
      className="py-20 bg-white"
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            id="categories-title"
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Trouvez l&apos;espace qui vous correspond
          </h2>
          <p className="text-lg text-gray-600">
            Une diversité d&apos;offres pour tous vos besoins au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group"
                aria-label={`Catégorie ${cat.name}: ${cat.description}`}
              >
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" 
                    aria-hidden="true"
                  />
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute bottom-4 left-4 z-20 text-white flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cat.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ValuePropSection: React.FC = () => {
  const features = [
    { 
      icon: MapPin, 
      title: "Pensé pour le Bénin", 
      desc: "Une plateforme qui comprend les réalités locales de Cotonou à Parakou." 
    },
    {
      icon: MessageCircle,
      title: "Réservation WhatsApp",
      desc: "Contact direct avec le propriétaire. Réservez rapidement, négociez en toute transparence."
    },
    { 
      icon: ShieldCheck, 
      title: "100% Vérifié", 
      desc: "Tous nos hôtes et locataires passent par une vérification d'identité." 
    },
    { 
      icon: HeartHandshake, 
      title: "Support Local", 
      desc: "Une équipe basée à Cotonou disponible 7j/7 pour vous aider." 
    }
  ] as const;

  return (
    <section 
  className="py-20 bg-gray-50"
  aria-labelledby="value-prop-title"
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
      
      {/* Texte et features */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
        <h2 
          id="value-prop-title"
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 lg:mb-6 leading-tight"
        >
          Pourquoi choisir <span className="text-brand">ImmoBenin</span> ?
        </h2>
        <p className="text-lg text-gray-600 mb-8 lg:mb-10">
          Oubliez les groupes Facebook et les démarches incertaines. Nous apportons la confiance, 
          la sécurité et la simplicité dans la location immobilière au Bénin.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 w-full">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center lg:items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-brand/10 rounded-xl text-brand">
                  <IconComponent className="w-7 h-7 lg:w-8 lg:h-8" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg lg:text-xl text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image animée */}
      <div className="lg:w-1/2 relative flex items-center">
        <motion.figure
          initial={{ rotate: -3 }}
          whileInView={{ rotate: 3 }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          viewport={{ once: true }}
          className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          aria-label="Famille heureuse utilisant ImmoBenin au Bénin"
        >
          <Image
            src="/images/home/tresor.jpg"
            alt="Famille heureuse utilisant les services ImmoBenin"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.figure>
        
        {/* Élément décoratif */}
        <div 
          className="absolute -bottom-6 -left-6 w-32 h-32 lg:w-40 lg:h-40 bg-brand rounded-full blur-3xl opacity-20" 
          aria-hidden="true"
        />
      </div>

    </div>
  </div>
</section>
  );
};