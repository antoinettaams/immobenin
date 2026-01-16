"use client";
import React from 'react';
import { Facebook, Instagram, Music, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  // Fonction pour naviguer au début de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour naviguer vers une page et scroller en haut
  const navigateWithScroll = (path: string) => {
    router.push(path);
    // Attendre un peu pour que la navigation se fasse, puis scroller en haut
    setTimeout(scrollToTop, 100);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 md:pt-20 pb-8 md:pb-10">
      
      {/* Footer CTA */}
      <div className="container mx-auto px-4 sm:px-6 mb-10 md:mb-16">
        <div className="bg-brand rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
              Rejoignez la première communauté de location immobilière de confiance au Bénin.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Button 
                variant="secondary"
                size="md"
                onClick={() => navigateWithScroll('/search')}
                className="w-full sm:w-auto justify-center"
              >
                Trouver un espace
              </Button>
              
              <button 
                onClick={() => navigateWithScroll('/publish')}
                className="bg-white text-brand px-4 md:px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 w-full sm:w-auto"
                type="button"
              >
                Devenir hôte
              </button>
            </div>
          </div>
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
              backgroundSize: 'auto'
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border-b border-gray-800 pb-8 md:pb-12">
          
          {/* Logo et description */}
          <div className="sm:text-left">
            <h3 className="text-2xl font-bold mb-4 md:mb-6">
              ImmoBenin
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
              La plateforme de référence pour la location d&apos;espaces au Bénin. Simple, sécurisé, local.
            </p>
            <div className="flex  sm:justify-start gap-3 md:gap-4">
              <a 
                href="https://facebook.com/immobenin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/immobenin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com/@immobenin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="TikTok"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="sm:text-left">
            <h4 className="font-bold text-lg mb-4 md:mb-6">Liens rapides</h4>
            <ul className="space-y-2 md:space-y-4 text-gray-400">
              <li>
                <Link 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Accueil"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/search');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Rechercher un bien"
                >
                  Rechercher
                </Link>
              </li>
              <li>
                <Link 
                  href="/publish" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/publish');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Devenir hôte"
                >
                  Devenir hôte
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/contact');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="sm:text-left">
            <h4 className="font-bold text-lg mb-4 md:mb-6">Support</h4>
            <ul className="space-y-2 md:space-y-4 text-gray-400">
              <li>
                <Link 
                  href="/contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/contact');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Centre d'aide"
                >
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/faq');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Questions fréquentes"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithScroll('/contact');
                  }}
                  className="hover:text-white transition-colors inline-block text-sm md:text-base"
                  aria-label="Signaler un problème"
                >
                  Signaler un problème
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:text-left">
            <h4 className="font-bold text-lg mb-4 md:mb-6">Contact</h4>
            <ul className="space-y-2 md:space-y-4 text-gray-400">
              <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:immobenin@gmail.com" 
                  className="hover:text-white transition-colors text-sm md:text-base break-all"
                  aria-label="Envoyer un email à immobenin@gmail.com"
                  onClick={scrollToTop}
                >
                  immobenin@gmail.com
                </a>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+22901000000" 
                  className="hover:text-white transition-colors text-sm md:text-base"
                  aria-label="Appeler le +229 01 00 00 00"
                  onClick={scrollToTop}
                >
                  +229 01 00 00 00
                </a>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span 
                  onClick={scrollToTop} 
                  className="cursor-pointer hover:text-white transition-colors text-sm md:text-base"
                >
                  Cotonou, Fidjrossè
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 md:pt-8 text-gray-500 text-xs md:text-sm text-center">
          <p>&copy; {currentYear} ImmoBenin. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};