// app/publish/page.tsx (correction)
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionStep } from '@/components/publish/SubscriptionStep';
import { PublishFlow } from '@/components/publish/PublishFlow';
import { PaymentData } from '@/components/publish/PaymentForm';
import toast, { Toaster } from 'react-hot-toast';

export default function PublishPage() {
  const router = useRouter();

  const [currentStage, setCurrentStage] = useState<'subscription' | 'publishing'>('subscription');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // 1️⃣ Cliquer sur "S'abonner"
  const handleSubscribeClick = () => {
    setShowPaymentForm(true);
  };

  // 2️⃣ Retour depuis paiement
  const handleBackFromPayment = () => {
    setShowPaymentForm(false);
  };

  // 3️⃣ Paiement validé ➜ PASSAGE DIRECT À PublishFlow
  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    setIsProcessingPayment(true);

    try {
      // ⏳ Petit délai réaliste (optionnel)
      await new Promise(resolve => setTimeout(resolve, 800));

      // ✅ UN SEUL MESSAGE IMPORTANT
      toast.success('✅ Paiement confirmé avec succès', {
        duration: 2500,
        position: 'top-center',
        icon: '💰',
      });

      // Sauvegarde locale
      localStorage.setItem('immobenin_payment', JSON.stringify({
        ...paymentData,
        timestamp: new Date().toISOString(),
        amount: 10000,
      }));

      // 🔥 Transition directe vers la publication
      setShowPaymentForm(false);
      setCurrentStage('publishing');
      setIsProcessingPayment(false);

    } catch (error) {
      toast.error('❌ Échec du paiement. Veuillez réessayer.', {
        duration: 4000,
        position: 'top-center',
      });
      setIsProcessingPayment(false);
    }
  };

  // 4️⃣ Fin de publication ➜ retour accueil
  const handlePublishComplete = () => {
    // ✅ Message FINAL uniquement
    toast.success('🎉 Votre annonce est publiée avec succès !', {
      duration: 4000,
      position: 'top-center',
    });

    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* ÉTAPE 1 — Abonnement + Paiement */}
      {currentStage === 'subscription' && (
        <SubscriptionStep
          onSubscribe={showPaymentForm ? handlePaymentSubmit : handleSubscribeClick}
          isLoading={isProcessingPayment}
          onBack={showPaymentForm ? handleBackFromPayment : undefined}
          // Supprimez cette ligne : afficherFormulaireDePaiement={afficherFormulaireDePaiement}
        />
      )}

      {/* ÉTAPE 2 — PUBLICATION */}
      {currentStage === 'publishing' && (
        <PublishFlow onComplete={handlePublishComplete} />
      )}
    </>
  );
}