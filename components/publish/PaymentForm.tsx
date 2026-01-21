"use client";
import React, { useState } from 'react';
import { ArrowLeft, Lock, Smartphone, Shield } from 'lucide-react';
import { Button } from '@/components/Button';
import toast, { Toaster } from 'react-hot-toast';

export interface PaymentData {
  phone: string;
  operator: 'mtn' | 'moov';
  pin?: string;
}

interface PaymentFormProps {
  onBack: () => void;
  onSubmit: (data: PaymentData) => void;
  isLoading: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState<'mtn' | 'moov'>('mtn');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      toast.error('Veuillez entrer un numéro de téléphone valide', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
    
    if (!pin || pin.length !== 5) {
      toast.error('Le code PIN Mobile Money doit contenir 5 chiffres', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    // Démarrer la simulation
    setIsProcessing(true);
    
    // Simuler progression
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Toast de début
    toast.loading('Vérification du paiement en cours...', {
      duration: 3000,
      position: 'top-center',
      id: 'payment-processing',
    });

    // Simuler délai de paiement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Toast de demande de confirmation
    toast.loading('Demande de confirmation envoyée à votre téléphone...', {
      duration: 2000,
      position: 'top-center',
      id: 'payment-confirmation',
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Toast de succès
    toast.success('✅ Paiement confirmé ! Redirection vers la publication...', {
      duration: 3000,
      position: 'top-center',
      icon: '🎉',
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '16px',
        padding: '16px',
      },
    });

    // Finaliser après 3 secondes
    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      onSubmit({ phone, operator, pin });
    }, 3000);
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 8) return cleaned;
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    return cleaned;
  };

  return (
    <>
      <Toaster 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-24 pb-8 md:py-0 md:mt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mt-4 md:mt-0">
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Paiement Mobile Money
          </h1>
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Remplissez les informations pour procéder au paiement
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Montant à payer</p>
            <p className="text-2xl md:text-3xl font-bold text-brand">10 000 FCFA</p>
            <p className="text-xs text-gray-500 mt-1">Abonnement mensuel ImmoBenin</p>
          </div>

          {isProcessing && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Traitement en cours...</p>
                  <p className="text-sm text-blue-700">
                    Vérification de votre paiement {operator === 'mtn' ? 'MTN' : 'Moov'} Money
                  </p>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-2 text-right">
                {progress}% complété
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez votre opérateur
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOperator('mtn')}
                  disabled={isProcessing}
                  className={`
                    p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all
                    ${operator === 'mtn' 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MTN</span>
                  </div>
                  <span className="text-sm font-medium">MTN Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperator('moov')}
                  disabled={isProcessing}
                  className={`
                    p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all
                    ${operator === 'moov' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MOOV</span>
                  </div>
                  <span className="text-sm font-medium">Moov Money</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro {operator === 'mtn' ? 'MTN' : 'Moov'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={operator === 'mtn' ? "97 00 00 00" : "96 00 00 00"}
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                  maxLength={12}
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Vous recevrez une demande de confirmation sur ce numéro
              </p>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Code PIN {operator === 'mtn' ? 'MTN Money' : 'Moov Money'}
                <span className="text-gray-500 text-xs ml-1">(5 chiffres)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="12345"
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 5) setPin(value);
                  }}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                  maxLength={5}
                  disabled={isProcessing}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Entrez les 5 chiffres de votre code PIN Mobile Money
              </p>
            </div>

            <Button
              type="submit"
              disabled={isProcessing || isLoading || !phone || pin.length !== 5}
              className="w-full py-3 text-base md:text-lg font-bold relative"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement en cours...
                </span>
              ) : (
                `Payer avec ${operator === 'mtn' ? 'MTN' : 'Moov'} Money`
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm">Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};