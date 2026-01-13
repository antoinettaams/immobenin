"use client";
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      
      {/* Footer CTA */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-brand rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Prêt à commencer l'aventure ?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez la première communauté de location immobilière de confiance au Bénin.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Solution simplifiée sans conflit de typage */}
              <Button 
                variant="secondary"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/search';
                  }
                }}
              >
                Trouver un espace
              </Button>
              
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/publish';
                  }
                }}
                className="bg-white text-brand px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
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

      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 text-center md:text-left">
        {/* Logo et description */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ImmoBenin
          </h3>
          <p className="text-gray-400 mb-6">
            La plateforme de référence pour la location d&apos;espaces au Bénin. Simple, sécurisé, local.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* À propos */}
        <div>
          <h4 className="font-bold text-lg mb-6">À propos</h4>
          <ul className="space-y-4 text-gray-400">
            <li>
              <Link 
                href="/about" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Notre histoire"
              >
                Notre histoire
              </Link>
            </li>
            <li>
              <Link 
                href="/careers" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Carrières"
              >
                Carrières
              </Link>
            </li>
            <li>
              <Link 
                href="/press" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Presse"
              >
                Presse
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Blog"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-lg mb-6">Support</h4>
          <ul className="space-y-4 text-gray-400">
            <li>
              <Link 
                href="/help" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Centre d&apos;aide"
              >
                Centre d&apos;aide
              </Link>
            </li>
            <li>
              <Link 
                href="/security" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Sécurité"
              >
                Sécurité
              </Link>
            </li>
            <li>
              <Link 
                href="/cancellation" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Règles d&apos;annulation"
              >
                Règles d&apos;annulation
              </Link>
            </li>
            <li>
              <Link 
                href="/report" 
                className="hover:text-white transition-colors inline-block"
                aria-label="Signaler un problème"
              >
                Signaler un problème
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-400 flex flex-col items-center md:items-start">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <a 
                href="mailto:hello@immobenin.com" 
                className="hover:text-white transition-colors"
                aria-label="Envoyer un email à hello@immobenin.com"
              >
                hello@immobenin.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <a 
                href="tel:+22901000000" 
                className="hover:text-white transition-colors"
                aria-label="Appeler le +229 01 00 00 00"
              >
                +229 01 00 00 00
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>Cotonou, Haie Vive</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} ImmoBenin. Tous droits réservés.</p>
      </div>
    </footer>
  );
};