"use client";
import React, { useState } from 'react';
import { SubscriptionStep } from '@/components/publish/SubscriptionStep';


export default function PublishPage() {
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Simulation de paiement
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setHasSubscribed(true);
  };

  // Si pas encore abonné, afficher l'écran d'abonnement
  if (!hasSubscribed) {
    return <SubscriptionStep onSubscribe={handleSubscribe} isLoading={isLoading} />;
  }

}