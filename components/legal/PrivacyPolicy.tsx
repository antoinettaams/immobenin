"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8  pt-24">
       <Link 
        href="/" 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          window.location.href = '/';
        }}
        className="inline-flex items-center text-brand hover:text-brand-dark hover:underline text-sm font-medium mb-8 transition-colors cursor-pointer relative z-30"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Retour à l&apos;accueil
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Politique de confidentialité
      </h1>
      <div className="text-gray-600 mb-8">
  <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
    Dernière mise à jour : Février 2026
  </span>
</div>

      <div className="space-y-8 text-gray-700">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">📋 Introduction</h2>
          <p>
            Chez <strong>ImmoBénin</strong>, votre vie privée est notre priorité. Cette politique explique comment nous collectons et protégeons vos informations.
          </p>
        </section>

        {/* Données collectées */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-2">1</span>
            Données collectées
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informations personnelles</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Nom et prénom</li>
                <li>Numéro de téléphone</li>
                <li>Adresse email</li>
                <li>Ville</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Données d&apos;utilisation</h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Historique de recherche</li>
                <li>Annonces consultées</li>
                <li>Données techniques (appareil, navigateur)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Utilisation */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm mr-2">2</span>
            Utilisation des données
          </h2>

          <div className="space-y-3">
            <p>Vos données servent à :</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Faciliter les contacts entre utilisateurs</li>
              <li>Assurer la sécurité de la plateforme</li>
              <li>Envoyer des communications importantes</li>
            </ul>
          </div>
        </section>

        {/* Partage */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm mr-2">3</span>
            Partage des données
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-medium">
              Nous <strong>NE VENDONS PAS</strong> vos données personnelles.
            </p>
          </div>

          <p className="mb-3">Les partages possibles :</p>
          <ul className="list-disc ml-5 space-y-2">
            <li><strong>Avec d&apos;autres utilisateurs</strong> : pour les réservations</li>
            <li><strong>Obligations légales</strong> : si requis par la loi</li>
          </ul>
        </section>

        {/* Sécurité */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm mr-2">4</span>
            Sécurité
          </h2>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              Nous utilisons le chiffrement SSL et des mesures de sécurité avancées pour protéger vos données.
            </p>
          </div>
        </section>

        {/* Vos droits */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm mr-2">5</span>
            Vos droits
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Accès et rectification</h3>
              <p className="text-gray-600 text-sm">
                Vous pouvez demandez une modification de votre bien.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Suppression</h3>
              <p className="text-gray-600 text-sm">
                Demandez la suppression de vos données via email.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Opposition</h3>
              <p className="text-gray-600 text-sm">
                Vous pouvez vous opposer à certaines utilisations de vos données.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🍪 Cookies</h2>
          <p className="mb-2">
            Nous utilisons des cookies pour :
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Mémoriser vos préférences</li>
            <li>Analyser l&apos;usage du site</li>
            <li>Améliorer votre expérience</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600">
            Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-brand/5 p-5 rounded-lg border border-brand/20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Contact</h2>
          
          <div className="space-y-3">
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <a 
                href="mailto:immobenin08@gmail.com" 
                className="text-gray-600 hover:text-brand"
              >
                immobenin08@gmail.com
              </a>
            </div>

            <div>
              <div className="font-medium text-gray-900">Téléphone</div>
              <a 
                href="tel:+229 43 75 79 82" 
                className="text-gray-600 hover:text-brand"
              >
                +229 01 43 75 79 82
              </a>
            </div>

            <div>
              <div className="font-medium text-gray-900">Adresse</div>
              <div className="text-gray-600">
                ImmoBénin<br />
                Cotonou, Fidjrossè
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}