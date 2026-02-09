"use client";
import React, { useState } from "react";
import { Home, Building2, PartyPopper } from "lucide-react";

interface PropertyTypeData {
  category: "house" | "office" | "event";
  subType: string;
  privacy: "entire" | "private" | "shared";
}

interface HousingTypeStepProps {
  data: PropertyTypeData;
  onUpdate: (data: PropertyTypeData) => void;
  onNext: () => void;
}

const categories = [
  {
    id: "house" as const,
    title: "Maison & Appartement",
    icon: Home,
    description: "Logements résidentiels pour séjours courts ou longs",
    subTypes: [
      { id: "apartment", label: "Appartement entier", description: "Appartement complet pour vous seul" },
      { id: "house", label: "Maison entière", description: "Maison indépendante avec jardin" },
      { id: "room", label: "Chambre privée", description: "Chambre dans une maison ou appartement" },
      { id: "studio", label: "Studio", description: "Petit espace tout équipé" },
      { id: "villa", label: "Villa", description: "Grande maison avec espace extérieur" },
    ],
  },
  {
    id: "office" as const,
    title: "Bureaux & Espaces de travail",
    icon: Building2,
    description: "Espaces professionnels pour entreprises et indépendants",
    subTypes: [
      { id: "private-office", label: "Bureau privé", description: "Espace de travail dédié" },
      { id: "coworking", label: "Espace coworking", description: "Poste dans un espace partagé" },
      { id: "meeting-room", label: "Salle de réunion", description: "Pour réunions et présentations" },
      { id: "commercial", label: "Local commercial", description: "Boutique ou espace commercial" },
      { id: "workshop", label: "Atelier", description: "Espace pour travaux et production" },
    ],
  },
  {
    id: "event" as const,
    title: "Salles d'événements",
    icon: PartyPopper,
    description: "Espaces pour célébrations, réunions et événements",
    subTypes: [
      { id: "wedding-hall", label: "Salle de mariage", description: "Pour cérémonies et réceptions" },
      { id: "party-space", label: "Espace fête", description: "Pour anniversaires et soirées" },
      { id: "conference", label: "Salle de conférence", description: "Pour séminaires et formations" },
      { id: "event-space", label: "Espace événementiel", description: "Grand espace polyvalent" },
      { id: "garden", label: "Jardin événementiel", description: "Espace extérieur pour événements" },
    ],
  },
];

const privacyOptions = [
  { id: "entire" as const, label: "Espace entier", description: "Les clients ont tout l'espace pour eux" },
  { id: "private" as const, label: "Espace privé", description: "Les clients ont leur propre espace" },
  { id: "shared" as const, label: "Espace partagé", description: "Les clients partagent l'espace" },
];

export const HousingTypeStep: React.FC<HousingTypeStepProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyTypeData["category"]>(data.category);
  const [selectedSubType, setSelectedSubType] = useState<string>(data.subType);
  const [selectedPrivacy, setSelectedPrivacy] = useState<PropertyTypeData["privacy"]>(data.privacy);

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  // 1) Sélection catégorie
  const handleCategorySelect = (categoryId: "house" | "office" | "event") => {
    const defaultPrivacy: PropertyTypeData["privacy"] = "entire";

    setSelectedCategory(categoryId);
    setSelectedSubType("");
    setSelectedPrivacy(defaultPrivacy);

    onUpdate({
      category: categoryId,
      subType: "",
      privacy: defaultPrivacy,
    });
  };

  // 2) Sélection sous-type
  const handleSubTypeSelect = (subTypeId: string) => {
    let privacyValue = selectedPrivacy;

    if (selectedCategory !== "house") {
      privacyValue = "entire";
      setSelectedPrivacy("entire");
    }

    setSelectedSubType(subTypeId);

    onUpdate({
      category: selectedCategory,
      subType: subTypeId,
      privacy: privacyValue,
    });
  };

  // 3) Sélection intimité (logement uniquement)
  const handlePrivacySelect = (privacyId: "entire" | "private" | "shared") => {
    setSelectedPrivacy(privacyId);

    onUpdate({
      category: selectedCategory,
      subType: selectedSubType,
      privacy: privacyId,
    });
  };

  const canContinue = Boolean(selectedCategory && selectedSubType);

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Quel type d&apos;espace proposez-vous ?
        </h1>
        <p className="text-lg text-gray-600">
          Choisissez la catégorie qui correspond le mieux à votre espace
        </p>
      </div>

      {/* Catégories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Catégorie principale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`
                  p-6 border-2 rounded-xl text-left transition-all duration-200
                  hover:shadow-md hover:border-gray-800
                  ${isSelected ? "border-brand bg-brand/5 shadow-sm" : "border-gray-200"}
                `}
              >
                <Icon
                  className={`w-8 h-8 mb-4 ${
                    isSelected ? "text-brand" : "text-gray-600"
                  }`}
                />
                <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sous-types */}
      {selectedCategoryData && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {selectedCategory === "house" && "Quel type de logement proposez-vous ?"}
            {selectedCategory === "office" && "Quel type d’espace de travail proposez-vous ?"}
            {selectedCategory === "event" && "Quel type de salle proposez-vous ?"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategoryData.subTypes.map((subType) => (
              <button
                key={subType.id}
                onClick={() => handleSubTypeSelect(subType.id)}
                className={`
                  p-6 border-2 rounded-xl text-left transition-all duration-200
                  hover:border-gray-800
                  ${
                    selectedSubType === subType.id
                      ? "border-brand bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{subType.label}</h3>
                    <p className="text-sm text-gray-600">
                      {subType.description}
                    </p>
                  </div>

                  {selectedSubType === subType.id && (
                    <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center ml-4">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Intimité – logement uniquement */}
      {selectedSubType && selectedCategory === "house" && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Niveau d&apos;intimité
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {privacyOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePrivacySelect(option.id)}
                className={`
                  p-6 border-2 rounded-xl text-left transition-all duration-200
                  hover:border-gray-800
                  ${
                    selectedPrivacy === option.id
                      ? "border-brand bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>

                  {selectedPrivacy === option.id && (
                    <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center ml-4">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
