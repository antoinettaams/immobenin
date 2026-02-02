'use client';
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Bed, 
  Bath, 
  Maximize2, 
  Building2, 
  Briefcase, 
  SquareStack, 
  Car, 
  Clock, 
  Sofa, 
  DoorClosed,
  Utensils
} from "lucide-react";

interface BasicsData {
  // Pour maison
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  privateEntrance?: boolean;
  
  // Pour bureau
  employees?: number;
  offices?: number;
  meetingRooms?: number;
  workstations?: number;
  
  // Pour événement
  eventCapacity?: number;
  parkingSpots?: number;
  wheelchairAccessible?: boolean;
  hasStage?: boolean;
  hasSoundSystem?: boolean;
  hasProjector?: boolean;
  hasCatering?: boolean;
  minBookingHours?: number;
  
  // Commun
  size?: number;
  floors?: number;
}

interface BasicsStepProps {
  data: BasicsData;
  propertyCategory: "house" | "office" | "event";
  onUpdate: (data: BasicsData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BasicsStep: React.FC<BasicsStepProps> = ({
  data,
  propertyCategory,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [localData, setLocalData] = useState<BasicsData>(data);

  useEffect(() => {
    const defaultData: BasicsData = { ...localData };

    // Réinitialiser selon catégorie
    if (propertyCategory === "house") {
      defaultData.maxGuests = defaultData.maxGuests ?? 1;
      defaultData.bedrooms = defaultData.bedrooms ?? 1;
      defaultData.beds = defaultData.beds ?? 1;
      defaultData.bathrooms = defaultData.bathrooms ?? 1;
      defaultData.privateEntrance = defaultData.privateEntrance ?? false;

      // Réinitialiser champs non pertinents
      defaultData.employees = undefined;
      defaultData.offices = undefined;
      defaultData.workstations = undefined;
      defaultData.meetingRooms = undefined;
      defaultData.eventCapacity = undefined;
      defaultData.parkingSpots = undefined;
      defaultData.hasStage = undefined;
      defaultData.hasSoundSystem = undefined;
      defaultData.hasProjector = undefined;
      defaultData.minBookingHours = undefined;
      defaultData.wheelchairAccessible = undefined;
    }

    if (propertyCategory === "office") {
      defaultData.employees = defaultData.employees ?? 1;
      defaultData.offices = defaultData.offices ?? 0;
      defaultData.workstations = defaultData.workstations ?? 0;
      defaultData.meetingRooms = defaultData.meetingRooms ?? 0;

      // Réinitialiser champs non pertinents
      defaultData.maxGuests = undefined;
      defaultData.bedrooms = undefined;
      defaultData.beds = undefined;
      defaultData.bathrooms = undefined;
      defaultData.privateEntrance = undefined;
      defaultData.eventCapacity = undefined;
      defaultData.parkingSpots = undefined;
      defaultData.hasStage = undefined;
      defaultData.hasSoundSystem = undefined;
      defaultData.hasProjector = undefined;
      defaultData.minBookingHours = undefined;
      defaultData.wheelchairAccessible = undefined;
    }

    if (propertyCategory === "event") {
      defaultData.eventCapacity = defaultData.eventCapacity ?? 10;
      defaultData.parkingSpots = defaultData.parkingSpots ?? 0;
      defaultData.minBookingHours = defaultData.minBookingHours ?? 4;
      defaultData.hasStage = defaultData.hasStage ?? false;
      defaultData.hasSoundSystem = defaultData.hasSoundSystem ?? false;
      defaultData.hasProjector = defaultData.hasProjector ?? false;
      defaultData.wheelchairAccessible = defaultData.wheelchairAccessible ?? false;

      // Réinitialiser champs non pertinents
      defaultData.maxGuests = undefined;
      defaultData.bedrooms = undefined;
      defaultData.beds = undefined;
      defaultData.bathrooms = undefined;
      defaultData.privateEntrance = undefined;
      defaultData.employees = undefined;
      defaultData.offices = undefined;
      defaultData.workstations = undefined;
      defaultData.meetingRooms = undefined;
    }

    defaultData.size = defaultData.size ?? 50;
    defaultData.floors = defaultData.floors ?? 0;

    setLocalData(defaultData);
    onUpdate(defaultData);
  }, [propertyCategory]);

  const updateField = (field: keyof BasicsData, value: number | boolean) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const increment = (field: keyof BasicsData) =>
    updateField(field, (localData[field] as number ?? 0) + 1);
    
  const decrement = (field: keyof BasicsData) =>
    updateField(field, Math.max(0, (localData[field] as number ?? 0) - 1));

  const toggleBoolean = (field: keyof BasicsData) =>
    updateField(field, !(localData[field] as boolean));

  const canContinue = () => {
    switch (propertyCategory) {
      case "house":
        return (localData.maxGuests ?? 0) > 0 && (localData.beds ?? 0) > 0 && (localData.size ?? 0) > 0;
      case "office":
        return (localData.employees ?? 0) > 0 && (localData.size ?? 0) > 0;
      case "event":
        return (localData.eventCapacity ?? 0) > 0 && (localData.size ?? 0) > 0;
      default:
        return false;
    }
  };

  const Counter = ({
    icon: Icon,
    label,
    description,
    field,
    unit,
    min = 0,
  }: {
    icon: any;
    label: string;
    description: string;
    field: keyof BasicsData;
    unit: string;
    min?: number;
  }) => (
    <div className="mb-4 p-4 sm:p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{label}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button 
            type="button" 
            onClick={() => decrement(field)} 
            disabled={(localData[field] as number ?? 0) <= min} 
            className="w-8 h-8 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 hover:border-gray-400 flex-shrink-0"
          >
            −
          </button>
          <span className="text-lg sm:text-xl font-bold min-w-[2rem] text-center">
            {localData[field] ?? 0}
          </span>
          <button 
            type="button" 
            onClick={() => increment(field)} 
            className="w-8 h-8 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-xs sm:text-sm text-gray-500 text-right">{unit}</div>
    </div>
  );

  const CheckboxOption = ({
    icon: Icon,
    label,
    description,
    field,
    checked,
  }: {
    icon: any;
    label: string;
    description: string;
    field: keyof BasicsData;
    checked: boolean;
  }) => (
    <div 
      className={`p-3 sm:p-4 border rounded-xl cursor-pointer transition-all hover:border-gray-400 ${checked ? 'border-brand bg-brand/5' : 'border-gray-200'}`}
      onClick={() => toggleBoolean(field)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${checked ? 'bg-brand/10' : 'bg-gray-100'}`}>
            <Icon className={`w-5 h-5 ${checked ? 'text-brand' : 'text-gray-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{label}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</p>
          </div>
        </div>
        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'bg-brand border-brand' : 'border-gray-300'}`}>
          {checked && (
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0 w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {propertyCategory === "house" && "Décrivez votre logement"}
          {propertyCategory === "office" && "Détails de votre espace de travail"}
          {propertyCategory === "event" && "Informations sur votre salle"}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Les voyageurs veulent connaître les détails de votre espace
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {propertyCategory === "house" && (
          <>
            <Counter icon={Users} label="Voyageurs maximum" description="Nombre total d'invités que peut accueillir votre logement" field="maxGuests" unit="personnes" min={1} />
            <Counter icon={Bed} label="Chambres" description="Chambres à coucher séparées" field="bedrooms" unit="chambres" />
            <Counter icon={Bed} label="Lits" description="Nombre total de lits (inclut canapé-lit si applicable)" field="beds" unit="lits" min={1} />
            <Counter icon={Bath} label="Salles de bain" description="Salles de bain complètes avec douche/bain" field="bathrooms" unit="salles" />
            <CheckboxOption icon={DoorClosed} label="Entrée privée" description="Les voyageurs ont leur propre entrée" field="privateEntrance" checked={localData.privateEntrance ?? false} />
          <CheckboxOption 
  icon={Utensils} // ou une icône appropriée
  label="Service de restauration" 
  description="Catering disponible ou cuisine professionnelle" 
  field="hasCatering" 
  checked={localData.hasCatering ?? false} 
/>
          </>
        )}

        {propertyCategory === "office" && (
          <>
            <Counter icon={Users} label="Capacité d'accueil" description="Nombre maximum de personnes pouvant travailler simultanément" field="employees" unit="personnes" min={1} />
            <Counter icon={Building2} label="Bureaux privés" description="Bureaux fermés individuels ou en équipe" field="offices" unit="bureaux" />
            <Counter icon={SquareStack} label="Salles de réunion" description="Salles dédiées aux réunions" field="meetingRooms" unit="salles" />
            <Counter icon={Briefcase} label="Postes en open space" description="Espaces de travail partagés" field="workstations" unit="postes" />
          </>
        )}

        {propertyCategory === "event" && (
          <>
            <Counter icon={Users} label="Capacité maximale" description="Nombre maximum d'invités (assis ou debout)" field="eventCapacity" unit="personnes" min={10} />
            <Counter icon={Car} label="Places de parking" description="Nombre de places de stationnement disponibles" field="parkingSpots" unit="places" />
            <Counter icon={Clock} label="Durée minimale" description="Nombre d'heures minimum de réservation" field="minBookingHours" unit="heures" min={2} />
            <CheckboxOption icon={Sofa} label="Scène/estrade" description="Plateforme ou scène pour présentations" field="hasStage" checked={localData.hasStage ?? false} />
            <CheckboxOption icon={Sofa} label="Système audio" description="Sono professionnelle avec micros" field="hasSoundSystem" checked={localData.hasSoundSystem ?? false} />
            <CheckboxOption icon={Sofa} label="Équipement vidéo" description="Projecteur et écrans" field="hasProjector" checked={localData.hasProjector ?? false} />
            <CheckboxOption icon={Sofa} label="Accessible PMR" description="Accès pour personnes à mobilité réduite" field="wheelchairAccessible" checked={localData.wheelchairAccessible ?? false} />
          </>
        )}
      </div>

      {/* Surface et étage - commun */}
      <div className="mt-6 sm:mt-8 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                {propertyCategory === "house" && "Surface habitable"}
                {propertyCategory === "office" && "Surface totale"}
                {propertyCategory === "event" && "Superficie de la salle"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {propertyCategory === "house" && "Superficie totale en mètres carrés"}
                {propertyCategory === "office" && "Superficie totale des bureaux"}
                {propertyCategory === "event" && "Superficie totale de l'espace événementiel"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              min={1} 
              value={localData.size ?? ""} 
              onChange={(e) => updateField("size", Number(e.target.value || 0))} 
              className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
              placeholder="Ex : 120" 
            />
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">m²</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 border border-gray-200 rounded-xl">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
              <Building2 className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Étage</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {propertyCategory === "house" && "À quel étage se trouve le logement ?"}
                {propertyCategory === "office" && "Étage de l'immeuble"}
                {propertyCategory === "event" && "Étage de la salle"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              min={0} 
              value={localData.floors ?? ""} 
              onChange={(e) => updateField("floors", Number(e.target.value || 0))} 
              className="w-full sm:w-32 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
              placeholder="0 = rez-de-chaussée" 
            />
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap flex-1 truncate">
              {localData.floors === 0 ? "Rez-de-chaussée" : `${localData.floors}ème étage`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};