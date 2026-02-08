"use client";
import Link from "next/link";

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8  pt-24">
        {/* Bouton retour */}
        <Link 
          href="/" 
          className="inline-flex items-center text-brand hover:text-brand-dark hover:underline text-sm font-medium mb-8 transition-colors cursor-pointer"
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

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conditions générales d&apos;utilisation
          </h1>
          <div className="text-gray-600 mb-6">
            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              Dernière mise à jour : Février 2026
            </span>
          </div>
          <p className="text-gray-700">
            L&apos;utilisation de la plateforme ImmoBénin implique l&apos;acceptation complète 
            des présentes conditions générales d&apos;utilisation.
          </p>
        </div>

        {/* Note importante */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            ⚠️ Important : ImmoBénin est une plateforme de mise en relation. Les transactions 
            se font directement entre utilisateurs. Nous ne sommes pas partie aux accords.
          </p>
        </div>

        {/* Contenu des conditions */}
        <div className="space-y-8 text-gray-700">
          {/* Article 1 : Acceptation */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              <h2 className="text-xl font-bold text-gray-900">Acceptation des conditions</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <p>
                En accédant à ImmoBénin et en utilisant nos services, vous acceptez d&apos;être 
                lié par les présentes conditions. Si vous n&apos;acceptez pas ces conditions, 
                vous ne devez pas utiliser notre plateforme.
              </p>
            </div>
          </section>

          {/* Article 2 : Description du service */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              <h2 className="text-xl font-bold text-gray-900">Description du service</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <p className="mb-3">
                ImmoBénin est une plateforme de mise en relation entre propriétaires et 
                locataires au Bénin. Nous facilitons la publication d&apos;annonces et la 
                recherche d&apos;espaces à louer.
              </p>
              <div className="p-3 bg-red-50 border border-red-100 rounded mt-3">
                <p className="text-sm text-red-700 font-medium">
                  ❗ Nous ne sommes PAS partie aux transactions. Tous les accords sont conclus 
                  directement entre propriétaires et locataires.
                </p>
              </div>
            </div>
          </section>

          {/* Article 3 : Utilisation sans compte */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              <h2 className="text-xl font-bold text-gray-900">Utilisation sans compte</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <div className="space-y-3">
                <p className="font-medium">Sur ImmoBénin :</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    <strong>Pas de création de compte</strong> - Vous utilisez la plateforme 
                    et vous avez droit jusqu'à cinq (05) publications
                  </li>
                  <li>
                    <strong>Contact direct</strong> - Toutes les communications passent par 
                    WhatsApp avec les numéros affichés
                  </li>
                  <li>
                    <strong>Modification des informations</strong> - Pour corriger ou mettre à 
                    jour vos informations, vous devez nous contacter
                  </li>
                </ul>
                
                <div className="p-3 bg-blue-50 border border-blue-100 rounded mt-3">
                  <p className="text-sm text-blue-700">
                    📞 <strong>Pour toute correction :</strong> Contactez-nous par WhatsApp ou 
                    email. Nous modifierons vos informations après vérification.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Article 4 : Responsabilités */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              <h2 className="text-xl font-bold text-gray-900">Responsabilités</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Propriétaires</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Fournir des informations exactes sur le bien</li>
                    <li>Répondre aux demandes WhatsApp</li>
                    <li>Honorer les réservations confirmées</li>
                    <li>Vérifier les paiements Mobile Money</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Locataires</h3>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Contacter directement le propriétaire</li>
                    <li>Effectuer les paiements convenus</li>
                    <li>Respecter les règles du bien</li>
                    <li>Signaler tout problème</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Article 5 : Modération */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                5
              </span>
              <h2 className="text-xl font-bold text-gray-900">Modération et sanctions</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <p className="mb-3">Nous nous réservons le droit de :</p>
              <ul className="list-disc ml-5 space-y-2">
                <li>Supprimer toute annonce non conforme</li>
                <li>Modifier ces conditions à tout moment</li>
              </ul>
            </div>
          </section>

          {/* Article 6 : Protection des données */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                6
              </span>
              <h2 className="text-xl font-bold text-gray-900">Protection des données</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <p className="mb-3">
                Vos données sont traitées selon notre 
                <Link href="/confidentialite" className="text-brand hover:underline mx-1">
                  Politique de confidentialité
                </Link>.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded">
                <p className="text-sm text-blue-700">
                  <strong>⚠️ Important :</strong> Sans compte, vous ne pouvez pas modifier vos 
                  données vous-même. Contactez-nous pour toute mise à jour.
                </p>
              </div>
            </div>
          </section>

          {/* Article 7 : Contact pour corrections */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                7
              </span>
              <h2 className="text-xl font-bold text-gray-900">Contact et corrections</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">❗ Pas de compte utilisateur</h3>
                  <p className="text-red-700">
                    Comme il n&apos;y a pas de système de compte sur ImmoBénin pour le moment, vous ne pouvez 
                    PAS modifier vos informations vous-même.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pour corriger vos informations :</h3>
                  <ul className="list-disc ml-5 space-y-2">
                    <li>
                      <strong>Propriétaires</strong> : Contactez-nous pour modifier une annonce, 
                      corriger un prix, ou mettre à jour des photos
                    </li>
                    <li>
                      <strong>Locataires</strong> : Signalez tout problème avec une annonce
                    </li>
                    <li>
                      <strong>Tous</strong> : Demandez la suppression de vos données personnelles
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-green-50 border border-green-100 rounded">
                  <p className="text-green-800">
                    ✅ <strong>Nous nous engageons à :</strong> Traiter vos demandes sous 24h 
                    (jours ouvrés) et mettre à jour les informations après vérification.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Article 8 : Droit applicable */}
          <section>
            <div className="flex items-center mb-4">
              <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                8
              </span>
              <h2 className="text-xl font-bold text-gray-900">Droit applicable</h2>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 ml-9">
              <ul className="list-disc ml-5 space-y-2">
                <li>Droit béninois applicable</li>
                <li>Recherche de solution amiable en cas de litige</li>
                <li>Compétence des tribunaux de Cotonou</li>
                <li>Version française faisant foi</li>
              </ul>
            </div>
          </section>

          {/* Contact section */}
          <section className="bg-brand/5 p-5 rounded-lg border border-brand/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Contact et support</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-gray-900 mb-1">WhatsApp</div>
                  <a 
                    href="https://wa.me/22943757982" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-brand"
                  >
                    +229 01 43 75 79 82
                  </a>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">Email support</div>
                  <a 
                    href="mailto:immobenin08@gmail.com" 
                    className="text-gray-600 hover:text-brand"
                  >
                    immobenin08@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="font-medium text-gray-900 mb-2">📝 Pour les corrections :</div>
                <p className="text-sm text-gray-600">
                  Envoyez-nous un message avec :
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1">
                  <li>Votre nom et numéro de téléphone</li>
                  <li>Les informations à corriger</li>
                  <li>Votre demande précise</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
