// components/publish/steps/PriceStep.tsx
"use client";
import React, { useState } from 'react';
import { DollarSign, Home, Building, Calendar } from 'lucide-react';
import { ListingData } from '../PublishFlow';

type PricingData = ListingData['pricing'];

interface PriceStepProps {
  data: PricingData;
  propertyCategory: ListingData['propertyType']['category'];
  propertySubType: string;
  onUpdate: (data: PricingData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PriceStep: React.FC<PriceStepProps> = ({
  data,
  propertyCategory,
  propertySubType,
  onUpdate,
}) => {
  const [price, setPrice] = useState(data.basePrice || 0);
  const [timeUnit, setTimeUnit] = useState('nuit');  

  // Unités de temps disponibles selon le type de bien
  const getAvailableTimeUnits = () => {
    switch(propertyCategory) {
      case 'house':
        return ['nuit', 'semaine', 'mois'];
      case 'office':
        if (propertySubType === 'salle_reunion') return ['heure', 'jour', 'semaine'];
        if (propertySubType === 'coworking') return ['jour', 'semaine', 'mois'];
        return ['mois', 'trimestre', 'année'];
      case 'event':
        if (propertySubType === 'soiree') return ['soirée', 'jour', 'week-end'];
        return ['heure', 'jour', 'week-end', 'semaine'];
      default:
        return ['nuit', 'semaine', 'mois'];
    }
  };

  const availableTimeUnits = getAvailableTimeUnits();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPrice(value);
    updateData(value);
  };

  const handleTimeUnitChange = (unit: string) => {
    setTimeUnit(unit);
    updateData(price);
  };

  const updateData = (newPrice: number) => {
    onUpdate({
      basePrice: newPrice,
      currency: 'FCFA',
      weeklyDiscount: 0,
      monthlyDiscount: 0,
      cleaningFee: 0, 
      extraGuestFee: 0,
      securityDeposit: 0
    });
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const getCategoryIcon = () => {
    switch(propertyCategory) {
      case 'house': return Home;
      case 'office': return Building;
      case 'event': return Calendar;
      default: return DollarSign;
    }
  };

  const getCategoryLabel = () => {
    if (propertyCategory === 'house') return 'Logement';
    if (propertyCategory === 'office') return 'Bureau';
    if (propertyCategory === 'event') return 'Événement';
    return 'Bien';
  };

  const Icon = getCategoryIcon();
  const categoryLabel = getCategoryLabel();

  // Calcul des frais de service  
  const calculateServiceFee = (basePrice: number) => {
    return 0;  
  };

  // Prix total pour l'utilisateur 
  const calculateTotalPrice = (basePrice: number) => {
    return basePrice;  
  };

  return (
    <div className="max-w-md mx-auto">
      {/* En-tête simple */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Fixez votre prix
            </h1>
            <p className="text-gray-600">
              Définissez le tarif de votre {categoryLabel.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire simple */}
      <div className="space-y-6 mb-8">
        {/* Choix de l'unité de temps */}
        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Tarif par :
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableTimeUnits.map((unit) => (
              <button
                key={unit}
                onClick={() => handleTimeUnitChange(unit)}
                className={`px-4 py-2 rounded-lg border ${
                  timeUnit === unit
                    ? 'bg-brand text-white border-brand'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>

          {/* Prix principal */}
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Prix par {timeUnit}
          </label>
          <div className="relative">
            <input
              type="number"
              value={price || ''}
              onChange={handlePriceChange}
              className="w-full px-4 py-4 text-2xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              placeholder="0"
              min="0"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium">
              FCFA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};