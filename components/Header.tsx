"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Globe, UserCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Vérifier si on est côté client
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      // Déclencher une première vérification
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleNavClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isMobileMenuOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
        {/* Logo avec Link pour navigation Next.js */}
        <Link 
  href="/" 
  className="flex items-center gap-2 cursor-pointer group z-50"
  onClick={handleNavClick}
  aria-label="Accueil - Retour à la page d'accueil"
>
  <div className="text-brand group-hover:scale-110 transition-transform duration-300 relative w-10 h-10 md:w-12 md:h-12">
    {/* Votre image de logo - Taille augmentée */}
    <Image
      src="/images/home/logo.png"
      alt="Logo ImmoBenin"
      fill
      className="object-contain"
      sizes="(max-width: 768px) 40px, 48px"
      priority
    />
  </div>
  <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand transition-colors">
    ImmoBenin
  </span>
</Link>
        {/* Desktop Navigation avec Link */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700" aria-label="Navigation principale">
          <Link 
            href="/" 
            className={`hover:text-brand transition-colors ${isActive('/') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Accueil
          </Link>
          <Link 
            href="/search" 
            className={`hover:text-brand transition-colors ${isActive('/search') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/search') ? 'page' : undefined}
          >
            Rechercher
          </Link>
          <Link 
            href="/publish" 
            className={`hover:text-brand transition-colors ${isActive('/publish') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/publish') ? 'page' : undefined}
          >
            Devenir hôte
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-brand transition-colors ${isActive('/contact') ? 'text-brand font-semibold' : ''}`}
            onClick={handleNavClick}
            aria-current={isActive('/contact') ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        {/* Right Section (User Menu on Desktop / Toggle on Mobile) */}
        <div className="flex items-center gap-2 z-50">
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
              aria-label="Changer la langue"
              type="button"
            >
              <Globe className="w-4 h-4" />
              <span>FR</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 text-gray-700 bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-100"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile" 
          >
            <nav className="flex flex-col p-6 gap-6 text-lg font-medium text-gray-800">
              <Link 
                href="/" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Accueil
              </Link>
              <Link 
                href="/search" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/search') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/search') ? 'page' : undefined}
              >
                Rechercher
              </Link>
              <Link 
                href="/publish" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/publish') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/publish') ? 'page' : undefined}
              >
                Devenir hôte
              </Link>
              <Link 
                href="/contact" 
                className={`py-2 hover:text-brand transition-colors ${isActive('/contact') ? 'text-brand font-semibold' : ''}`}
                onClick={handleNavClick}
                aria-current={isActive('/contact') ? 'page' : undefined}
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};