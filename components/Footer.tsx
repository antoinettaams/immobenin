"use client";
import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
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
    // Scroller en haut après un court délai
    setTimeout(scrollToTop, 50);
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
              
              <Button 
                variant="primary"
                size="md"
                onClick={() => navigateWithScroll('/publish')}
                className="w-full sm:w-auto justify-center"
              >
                Devenir hôte
              </Button>
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
            <div 
              onClick={() => navigateWithScroll('/')}
              className="cursor-pointer inline-block"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateWithScroll('/')}
            >
              <h3 className="text-2xl font-bold mb-4 md:mb-6 hover:text-brand transition-colors">
                ImmoBenin
              </h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
              La plateforme de référence pour la location d&apos;espaces au Bénin. Simple, sécurisé, local.
            </p>
            <div className="flex sm:justify-start gap-3 md:gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61587104714306" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/immobenin08/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@immobnin?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="sm:text-left">
            <h4 className="font-bold text-lg mb-4 md:mb-6">Liens rapides</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li>
                <Link 
                  href="/" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                  aria-label="Accueil"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                  aria-label="Rechercher un bien"
                >
                  Rechercher
                </Link>
              </li>
              <li>
                <Link 
                  href="/publish" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                  aria-label="Devenir hôte"
                >
                  Devenir hôte
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
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
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li>
                <Link 
                  href="/contact" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                  aria-label="Centre d'aide"
                >
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
                  aria-label="Questions fréquentes"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors inline-flex items-center gap-2 text-sm md:text-base"
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
            <ul className="space-y-3 md:space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a 
                  href="mailto:immobenin@gmail.com" 
                  className="hover:text-white transition-colors text-sm md:text-base break-all"
                  aria-label="Envoyer un email à immobenin08@gmail.com"
                >
                  immobenin08@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a 
                  href="tel:+2290143757982" 
                  className="hover:text-white transition-colors text-sm md:text-base"
                  aria-label="Appeler le +229 01 43 75 79 82"
                >
                  +229 01 43 75 79 82
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span 
                  className="text-sm md:text-base"
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