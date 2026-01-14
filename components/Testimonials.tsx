"use client";
import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';
import Image from 'next/image';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aïcha D.", 
    role: "Locataire à Cotonou",
    content: "J'ai trouvé un appartement meublé à Haie Vive en moins de 2 heures. Le processus est super simple et sécurisé.",
    avatar: "https://picsum.photos/100/100?random=20",
    rating: 5
  },
  {
    id: 2,
    name: "Marc K.",
    role: "Propriétaire à Calavi",
    content: "ImmoBenin m'a permis de rentabiliser ma villa quand je ne suis pas là.",
    avatar: "https://picsum.photos/100/100?random=21",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah T.",
    role: "Organisatrice d'événements",
    content: "La meilleure plateforme pour trouver des salles. Les photos sont conformes à la réalité, pas de mauvaises surprises.",
    avatar: "https://picsum.photos/100/100?random=22",
    rating: 4
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ce qu&apos;ils disent de nous
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="flex gap-1 mb-4 text-brand">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} 
                    aria-hidden="true"
                  />
                ))}
                <span className="sr-only">
                  {t.rating} étoile{t.rating > 1 ? 's' : ''} sur 5
                </span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                &quot;{t.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={t.avatar}
                    alt={`Photo de profil de ${t.name}`}
                    className="rounded-full object-cover"
                    fill
                    sizes="48px"
                    priority={false}
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};