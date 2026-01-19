// components/publish/SubscriptionStep.tsx
"use client";
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";

interface SubscriptionStepProps {
  onSubscribe: () => void;
  isLoading: boolean;
}

export const SubscriptionStep: React.FC<SubscriptionStepProps> = ({
  onSubscribe,
  isLoading,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

        {/* Titre */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Abonnement requis
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Pour publier une annonce sur <span className="font-bold text-brand">ImmoBenin</span>,  
          vous devez être abonné.
        </p>

        {/* Carte prix */}
        <div className="border-2 border-brand rounded-xl p-6 mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ImmoBenin 
          </h2>

          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-4xl font-extrabold text-brand">10 000</span>
            <span className="text-lg text-gray-600">FCFA</span>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            par mois • Sans engagement
          </p>

          {/* Bouton */}
          <Button
            onClick={onSubscribe}
            disabled={isLoading}
            className="w-full py-3 text-lg font-bold"
          >
            {isLoading ? "Traitement..." : "S’abonner maintenant"}
          </Button>
        </div>

        {/* Avantages simples */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-green-600" />
            <span>Publiez des annonces illimitées</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-green-600" />
            <span>Visibilité prioritaire</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Check className="w-5 h-5 text-green-600" />
            <span>Support client dédié</span>
          </div>
        </div>

        {/* Sécurité */}
        <p className="text-center text-sm text-gray-500">
          Paiement sécurisé • Mobile Money & carte bancaire
        </p>
      </div>
    </div>
  );
};
