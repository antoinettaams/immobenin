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
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none px-4 pb-4 md:pb-6 md:flex md:justify-center"
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
        className="bg-white/95 backdrop-blur-lg shadow-lg md:shadow-2xl rounded-full md:rounded-full p-1.5 md:p-2 border border-gray-200 pointer-events-auto flex gap-1 md:gap-2 max-w-lg mx-auto"
        role="group"
        aria-label="Actions principales"
      >
        <Link
          href="/search"
          className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 lg:px-15 py-2.5 md:py-3 rounded-full md:rounded-full font-bold transition-colors flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
            pathname === '/search' 
              ? 'bg-gray-100 text-brand focus:ring-brand' 
              : 'bg-brand text-white hover:bg-brand-dark focus:ring-brand'
          }`}
          aria-label="Trouver un bien à louer"
          aria-current={pathname === '/search' ? 'page' : undefined}
        >
          <Search 
            className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" 
            aria-hidden="true" 
          />
          <span className="text-[0.7rem] md:text-xl whitespace-nowrap ">
            Trouver un bien
          </span>
        </Link>

        <Link
          href="/publish"
          className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 lg:px-15 py-2.5 md:py-3 rounded-full md:rounded-full font-bold transition-colors flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
            pathname === '/publish'
              ? 'bg-gray-100 text-gray-900 focus:ring-gray-900'
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900'
          }`}
          aria-label="Publier un bien à louer"
          aria-current={pathname === '/publish' ? 'page' : undefined}
        >
          <PlusCircle 
            className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" 
            aria-hidden="true" 
          />
          <span className="text-[0.7rem] md:text-xl whitespace-nowrap ">
            Publier
          </span>
        </Link>
      </motion.div>

      {/* Indicateur de sécurité */}
      <div 
        className="absolute -top-2 md:-top-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 md:px-3 py-1 rounded-full whitespace-nowrap shadow-sm md:shadow-none">
          <span className="hidden sm:inline">✓ Sécurisé</span>
          <span className="sm:hidden">✓</span>
        </div>
      </div>

      {/* Safe area pour iPhone */}
      <div 
        className="h-safe-bottom md:hidden absolute inset-x-0 top-full bg-gradient-to-t from-white/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </nav>
  );
};