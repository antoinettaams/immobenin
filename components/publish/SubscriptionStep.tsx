"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { PaymentForm, PaymentData } from "./PaymentForm";
import toast from "react-hot-toast";

interface SubscriptionStepProps {
  onSubscribe: (paymentData: PaymentData) => void;
  isLoading: boolean;
  onBack?: () => void;
}

export const SubscriptionStep: React.FC<SubscriptionStepProps> = ({
  onSubscribe,
  isLoading,
  onBack,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentSuccess = (data: PaymentData) => {
    // 1. notifier le parent (qui va changer currentStage)
    onSubscribe(data);

    // 2. toast succès seulement
    toast.success("✅ Abonnement activé avec succès !", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10B981",
        color: "#fff",
        fontSize: "14px",
        padding: "12px",
      },
    });
    
    // 3. NE PAS faire router.push ici - le parent s'occupe de changer d'étape
  };

  if (showPaymentForm) {
    return (
      <PaymentForm
        onBack={() => {
          setShowPaymentForm(false);
          onBack?.();
        }}
        onSubmit={handlePaymentSuccess}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-24 pb-8 md:py-0 md:mt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mt-4 md:mt-0">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-2">
          Abonnement requis
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Pour publier une annonce sur{" "}
          <span className="font-bold text-brand">ImmoBenin</span>,  
          vous devez être abonné.
        </p>

        <div className="border-2 border-brand rounded-xl p-5 mb-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            ImmoBenin Premium
          </h2>

          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-4xl font-extrabold text-brand">10 000</span>
            <span className="text-lg text-gray-600">FCFA</span>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            par mois • Sans engagement
          </p>

          <Button
            onClick={() => setShowPaymentForm(true)}
            disabled={isLoading}
            className="w-full py-3 text-lg font-bold"
          >
            S'abonner maintenant
          </Button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "Publiez des annonces illimitées",
            "Visibilité prioritaire",
            "Support client dédié",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 text-gray-700">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500">
          Paiement sécurisé • Mobile Money uniquement
        </p>
      </div>
    </div>
  );
};