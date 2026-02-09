"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, HelpCircle, AlertTriangle, ChevronDown, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Types pour les pages
export type FooterPageType = 
  | 'ABOUT' | 'CAREERS' | 'PRESS' | 'BLOG' 
  | 'HELP' | 'SECURITY' | 'CANCELLATION' | 'REPORT';

interface FooterPageProps {
  page: FooterPageType;
}

export const FooterPages: React.FC<FooterPageProps> = ({ page }) => {
  const wrapperClass = "pt-24 pb-20 min-h-screen bg-white";
  const containerClass = "container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl";

  const renderContent = () => {
    switch (page) { 
      // --- ABOUT PAGES ---
      case 'ABOUT':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Notre Histoire
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                ImmoBenin est né d'un constat simple : se loger au Bénin ne devrait pas être un parcours du combattant.
                Entre les démarches informelles et le manque de transparence, nous avons voulu créer un tiers de confiance.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="relative w-full h-64 md:h-80 rounded-2xl shadow-lg overflow-hidden">
                  <Image
                    src="https://picsum.photos/600/400?random=about1"
                    alt="Équipe ImmoBenin en réunion"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Une mission locale</h3>
                  <p className="text-gray-600">
                    Nous sommes une équipe basée à Cotonou, passionnée par la technologie et l&apos;immobilier. 
                    Notre objectif est de digitaliser le secteur tout en respectant nos réalités culturelles.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center">Nos valeurs</h3>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  {[
                    { icon: Shield, label: "Confiance", color: "text-brand" },
                    { icon: CheckCircle, label: "Qualité", color: "text-brand" },
                    { icon: FileText, label: "Transparence", color: "text-brand" }
                  ].map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-12 h-12 bg-brand/10 ${value.color} rounded-full flex items-center justify-center mb-3`}>
                        <value.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h4 className="font-bold">{value.label}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'CAREERS':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  Rejoignez l&apos;aventure
                </h1>
                <p className="text-xl text-gray-600">
                  Aidez-nous à construire le futur de li&apos;mmobilier au Bénin.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "City Manager", loc: "Parakou", type: "CDI" },
                  { title: "Développeur Fullstack (React/Node)", loc: "Cotonou / Remote", type: "CDI" },
                  { title: "Support Client", loc: "Cotonou", type: "CDD" },
                  { title: "Photographe Immobilier", loc: "Porto-Novo", type: "Freelance" }
                ].map((job, index) => (
                  <Link 
                    href={`/careers/${job.title.toLowerCase().replace(/\s+/g, '-')}`} 
                    key={index}
                    className="block border border-gray-200 p-6 rounded-xl hover:border-brand transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl group-hover:text-brand transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-500">
                          {job.loc} • {job.type}
                        </p>
                      </div>
                      <ChevronDown 
                        className="-rotate-90 text-gray-400 group-hover:text-brand transition-colors" 
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'PRESS':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Ils parlent de nous
              </h1>
              <div className="grid gap-8">
                {[
                  { 
                    media: "Le Matinal", 
                    title: "ImmoBenin révolutionne la location courte durée", 
                    date: "Oct 2023",
                    link: "#"
                  },
                  { 
                    media: "ORTB Info", 
                    title: "La digitalisation du secteur immobilier en marche", 
                    date: "Sept 2023",
                    link: "#"
                  },
                  { 
                    media: "Tech Afrique", 
                    title: "La startup béninoise qui défie les géants", 
                    date: "Août 2023",
                    link: "#"
                  }
                ].map((article, index) => (
                  <a 
                    href={article.link} 
                    key={index}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gray-50 p-8 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-bold text-brand uppercase tracking-wide mb-2">
                      {article.media}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-500 text-sm">{article.date}</p>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'BLOG':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Le Blog ImmoBenin
              </h1>
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { 
                    img: "https://picsum.photos/600/400?random=blog1", 
                    title: "Top 5 des quartiers où vivre à Cotonou", 
                    tag: "Guide",
                    slug: "top-5-quartiers-cotonou"
                  },
                  { 
                    img: "https://picsum.photos/600/400?random=blog2", 
                    title: "Comment sécuriser sa location de vacances ?", 
                    tag: "Conseils",
                    slug: "securiser-location-vacances"
                  },
                  { 
                    img: "https://picsum.photos/600/400?random=blog3", 
                    title: "Investir dans l'immobilier locatif au Bénin", 
                    tag: "Investissement",
                    slug: "investir-immobilier-locatif-benin"
                  },
                  { 
                    img: "https://picsum.photos/600/400?random=blog4", 
                    title: "Découvrir Ouidah le temps d'un week-end", 
                    tag: "Tourisme",
                    slug: "decouvrir-ouidah-weekend"
                  }
                ].map((post, index) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={index}
                    className="group block"
                  >
                    <div className="relative w-full h-48 rounded-xl mb-4 overflow-hidden">
                      <Image
                        src={post.img}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <span className="text-brand text-xs font-bold uppercase">
                      {post.tag}
                    </span>
                    <h3 className="text-xl font-bold mt-1 group-hover:text-brand transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        );

      // --- SUPPORT PAGES ---
      case 'HELP':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <HelpCircle className="w-10 h-10 text-brand" aria-hidden="true" /> 
                Centre d&apos;aide
              </h1>
              
              <div className="mb-8">
                <input 
                  type="text" 
                  placeholder="Comment pouvons-nous vous aider ?" 
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none"
                  aria-label="Recherche dans le centre d'aide"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xl mb-4">Questions fréquentes</h3>
                {[
                  "Comment réserver un logement ?",
                  "Puis-je annuler ma réservation ?",
                  "Comment devenir hôte ?",
                  "Les paiements sont-ils sécurisés ?"
                ].map((faq, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors text-left"
                    onClick={() => console.log(`FAQ ${index} clicked`)}
                  >
                    <span>{faq}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'SECURITY':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-green-50 text-green-800 p-8 rounded-3xl mb-8">
                <Lock className="w-12 h-12 mb-4" aria-hidden="true" />
                <h1 className="text-3xl font-extrabold mb-4">Votre sécurité est notre priorité</h1>
                <p className="text-lg">
                  Nous mettons en place des vérifications strictes pour garantir des échanges sûrs entre hôtes et voyageurs.
                </p>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Vérification d'identité",
                    description: "Chaque utilisateur doit fournir une pièce d'identité officielle (CIP, Passeport) pour valider son compte."
                  },
                  {
                    title: "Paiements Sécurisés",
                    description: "L'argent est conservé par ImmoBenin jusqu'à 24h après votre arrivée dans les lieux."
                  },
                  {
                    title: "Avis authentiques",
                    description: "Seuls les voyageurs ayant séjourné peuvent laisser un commentaire."
                  }
                ].map((feature, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      
      case 'CANCELLATION':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Politiques d&apos;annulation
              </h1>
              
              <div className="space-y-6">
                {[
                  { type: "Flexible", color: "text-green-600", description: "Remboursement intégral jusqu'à 24 heures avant l'arrivée." },
                  { type: "Modérée", color: "text-yellow-600", description: "Remboursement intégral jusqu'à 5 jours avant l'arrivée." },
                  { type: "Stricte", color: "text-red-600", description: "Remboursement intégral pendant 48h après la réservation, si celle-ci a lieu au moins 14 jours avant l'arrivée." }
                ].map((policy, index) => (
                  <div key={index} className="border p-6 rounded-xl">
                    <h3 className={`text-lg font-bold ${policy.color} mb-2`}>
                      {policy.type}
                    </h3>
                    <p className="text-sm text-gray-600">{policy.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'REPORT':
        return (
          <div className={containerClass}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center max-w-lg mx-auto">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" aria-hidden="true" />
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                  Signaler un problème
                </h1>
                <p className="text-gray-600 mb-8">
                  Vous avez rencontré un comportement inapproprié ou une annonce suspecte ? Dites-le nous.
                </p>
                <form className="text-left space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-1">
                      Sujet
                    </label>
                    <select 
                      id="subject" 
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="suspicious">Annonce suspecte</option>
                      <option value="payment">Problème de paiement</option>
                      <option value="behavior">Comportement de l&apos;hôte/voyageur</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea 
                      id="description" 
                      rows={4} 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" 
                      placeholder="Détaillez le problème..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Envoyer le signalement
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <div className={containerClass}>
            <h1 className="text-3xl font-bold text-gray-900">Page non trouvée</h1>
            <p className="text-gray-600 mt-2">
              La page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
            <Link 
              href="/" 
              className="inline-block mt-4 text-brand hover:text-brand-dark font-semibold"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        );
    }
  };

  return (
    <div className={wrapperClass}>
      {renderContent()}
    </div>
  );
};