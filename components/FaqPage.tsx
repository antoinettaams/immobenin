// components/FaqPage.tsx
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, Home, CreditCard, Shield, Users, Calendar, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: 'general' | 'locataire' | 'proprietaire';
}

export const FaqPage: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'locataire' | 'proprietaire'>('all');
  const [openItem, setOpenItem] = useState<number | null>(1);

  const faqItems: FaqItem[] = [
    {
      id: 1,
      question: "Comment réserver un logement ?",
      answer: "Cliquez sur 'Réserver' sur la fiche du bien. Vous serez redirigé vers WhatsApp du propriétaire pour finaliser votre réservation et discuter des détails. Les paiements se font directement avec le propriétaire via Mobile Money ou cash.",
      icon: <Home className="w-5 h-5" />,
      category: 'locataire'
    },
    {
      id: 2,
      question: "Comment publier mon espace ?",
      answer: "1. Payez l'abonnement mensuel via Mobile Money ou cash sur notre plateforme. 2. Remplissez les informations de votre bien et ajoutez des photos. 3. Publiez votre annonce. L'abonnement est mensuel et renouvelable pour maintenir la visibilité de votre annonce.",
      icon: <Users className="w-5 h-5" />,
      category: 'proprietaire'
    },
    {
      id: 3,
      question: "Quels types de paiements sont acceptés ?",
      answer: "Pour les locataires : Mobile Money (MTN, Moov) ou cash en main, à discuter directement avec le propriétaire via WhatsApp. Pour les propriétaires : L'abonnement mensuel se paye uniquement via Mobile Money ou cash directement sur notre plateforme.",
      icon: <CreditCard className="w-5 h-5" />,
      category: 'general'
    },
    {
      id: 4,
      question: "Comment fonctionne l'abonnement pour propriétaires ?",
      answer: "L'abonnement est mensuel et renouvelable. Le paiement se fait via Mobile Money ou cash sur notre site. Si l'abonnement n'est pas renouvelé à temps, votre annonce disparaîtra automatiquement jusqu'au prochain paiement. Vous recevrez des rappels avant l'expiration.",
      icon: <Calendar className="w-5 h-5" />,
      category: 'proprietaire'
    },
    {
      id: 5,
      question: "Le site est-il sécurisé ?",
      answer: "Oui, toutes les communications sont sécurisées. Pour les propriétaires, les paiements d'abonnement sont traités de manière sécurisée. Nous vous recommandons toujours de vérifier les informations et de faire preuve de prudence dans vos transactions WhatsApp avec les propriétaires.",
      icon: <Shield className="w-5 h-5" />,
      category: 'general'
    },
    {
      id: 6,
      question: "Combien coûte l'abonnement pour propriétaires ?",
      answer: "L'abonnement coûte 10.000 FCFA par mois. Il n'y a pas de frais supplémentaires ni de commission sur vos réservations. Le paiement se fait exclusivement via Mobile Money ou cash sur notre plateforme.",
      icon: <Wallet className="w-5 h-5" />,
      category: 'proprietaire'
    },
    {
      id: 7,
      question: "Puis-je visiter le logement avant de réserver ?",
      answer: "Oui, nous encourageons les visites. Discutez directement avec le propriétaire via WhatsApp pour organiser une visite. Toutes les réservations et transactions financières se font ensuite directement entre vous et le propriétaire.",
      icon: <Home className="w-5 h-5" />,
      category: 'locataire'
    },
    {
      id: 8,
      question: "Que se passe-t-il si mon abonnement expire ?",
      answer: "Votre annonce sera automatiquement masquée jusqu'à ce que vous renouveliez votre abonnement. Vous recevrez des notifications par email et WhatsApp avant l'expiration. Après renouvellement, votre annonce réapparaîtra immédiatement.",
      icon: <Calendar className="w-5 h-5" />,
      category: 'proprietaire'
    },
    {
      id: 9,
      question: "Comment contacter un propriétaire ?",
      answer: "Directement via WhatsApp en cliquant sur le bouton 'Réserver' de l'annonce. Toutes les communications, négociations et paiements se font directement entre locataire et propriétaire via WhatsApp.",
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'locataire'
    },
    {
      id: 10,
      question: "Que faire en cas de problème avec un propriétaire ?",
      answer: "Contactez notre support via WhatsApp ou email. Bien que les transactions soient directes entre particuliers, nous pouvons vous conseiller et, dans certains cas, intervenir pour résoudre les conflits.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: 'general'
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes', count: faqItems.length },
    { id: 'general', label: 'Général', count: faqItems.filter(item => item.category === 'general').length },
    { id: 'locataire', label: 'Locataires', count: faqItems.filter(item => item.category === 'locataire').length },
    { id: 'proprietaire', label: 'Propriétaires', count: faqItems.filter(item => item.category === 'proprietaire').length }
  ];

  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir pour louer ou proposer un espace
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-5 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-brand text-white'
                  : 'bg-brand/10 text-brand hover:bg-brand/20'
              }`}
            >
              {category.label}
              <span className="text-sm opacity-80">({category.count})</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all flex items-start gap-4 ${
                    openItem === item.id
                      ? 'bg-brand/5 border-2 border-brand/20'
                      : 'bg-white border-2 border-gray-100 hover:border-brand/20'
                  }`}
                >
                  <div className="p-3 rounded-xl bg-brand/10 text-brand flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">{item.question}</h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          openItem === item.id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                    
                    <AnimatePresence>
                      {openItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-600 mt-4 leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

       

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto shadow-lg">
            <HelpCircle className="w-16 h-16 text-brand mx-auto mb-6" />
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vous avez d&apos;autres questions ?
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est disponible pour vous aider. Contactez-nous et nous vous répondrons rapidement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className="bg-brand text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors"
              >
                Nous contacter
              </button>
              
              <a
                href="https://wa.me/22961000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold border-2 border-gray-200 hover:border-brand/30 hover:bg-brand/5 transition-colors"
              >
                WhatsApp Direct
              </a>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
            <div className="text-3xl font-bold text-brand mb-2">24h</div>
            <div className="text-gray-600">Temps de réponse</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
            <div className="text-3xl font-bold text-brand mb-2">95%</div>
            <div className="text-gray-600">Satisfaction clients</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
            <div className="text-3xl font-bold text-brand mb-2">0%</div>
            <div className="text-gray-600">Commission sur réservation</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
            <div className="text-3xl font-bold text-brand mb-2">500+</div>
            <div className="text-gray-600">Propriétaires actifs</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};