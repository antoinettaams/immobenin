"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const StickyNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
      aria-label="Navigation rapide"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 1, 
          type: "spring", 
          stiffness: 200,
          damping: 20
        }}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-full p-2 border border-gray-200 pointer-events-auto flex gap-2"
        role="group"
        aria-label="Actions principales"
      >
        <Link
          href="/search"
          className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            pathname === '/search' 
              ? 'bg-gray-100 text-brand focus:ring-brand' 
              : 'bg-brand text-white hover:bg-brand-dark focus:ring-brand'
          }`}
          aria-label="Trouver un bien à louer"
          aria-current={pathname === '/search' ? 'page' : undefined}
        >
          <Search 
            className="w-5 h-5 flex-shrink-0" 
            aria-hidden="true" 
          />
          <span className="whitespace-nowrap">
            Trouver un bien
          </span>
        </Link>

        <Link
          href="/publish"
          className={`flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            pathname === '/publish'
              ? 'bg-gray-100 text-gray-900 focus:ring-gray-900'
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
          }`}
          aria-label="Publier un bien à louer"
          aria-current={pathname === '/publish' ? 'page' : undefined}
        >
          <PlusCircle 
            className="w-5 h-5 flex-shrink-0" 
            aria-hidden="true" 
          />
          <span className="whitespace-nowrap">
            Publier
          </span>
        </Link>
      </motion.div>

      {/* Indicateur de sécurité pour mobile */}
      <div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 md:hidden"
        aria-hidden="true"
      >
        <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          ✓ Sécurisé
        </div>
      </div>
    </nav>
  );
};