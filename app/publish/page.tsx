// app/publish/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionStep } from '@/components/publish/SubscriptionStep';
import { PublishFlow } from '@/components/publish/PublishFlow';
import { PaymentData } from '@/components/publish/PaymentForm';
import toast, { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function PublishPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const [currentStage, setCurrentStage] = useState<'subscription' | 'publishing'>('subscription');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubscribeClick = () => {
    setShowPaymentForm(true);
  };

  const handleBackFromPayment = () => {
    setShowPaymentForm(false);
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    setIsProcessingPayment(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success('✅ Paiement confirmé avec succès', {
        duration: 3000, // <-- 3 secondes
        position: 'top-center',
        icon: '💰',
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('immobenin_payment', JSON.stringify({
          ...paymentData,
          timestamp: new Date().toISOString(),
          amount: 10000,
        }));
      }

      setShowPaymentForm(false);
      setCurrentStage('publishing');
      setIsProcessingPayment(false);

    } catch (error) {
      toast.error('❌ Échec du paiement. Veuillez réessayer.', {
        duration: 3000, // <-- 3 secondes
        position: 'top-center',
      });
      setIsProcessingPayment(false);
    }
  };

  const handlePublishComplete = () => {
    toast.success('🎉 Votre annonce est publiée avec succès !', {
      duration: 3000, // <-- 3 secondes
      position: 'top-center',
    });

    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  // Si ce n'est pas encore le client, affichez un chargement
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          // Configuration globale pour toutes les notifications
          duration: 3000, // <-- 3 secondes par défaut
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000, // <-- 3 secondes pour les succès
          },
          error: {
            duration: 3000, // <-- 3 secondes pour les erreurs
          },
        }}
      />

      {/* ÉTAPE 1 — Abonnement + Paiement */}
      {currentStage === 'subscription' && (
        <SubscriptionStep
          onSubscribe={showPaymentForm ? handlePaymentSubmit : handleSubscribeClick}
          isLoading={isProcessingPayment}
          onBack={showPaymentForm ? handleBackFromPayment : undefined}
        />
      )}

      {/* ÉTAPE 2 — PUBLICATION */}
      {currentStage === 'publishing' && (
        <PublishFlow onComplete={handlePublishComplete} />
      )}
    </>
  );
}