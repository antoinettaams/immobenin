"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Navigation, Crosshair, X } from "lucide-react";
import MapComponent from "./MapComponent";

interface LocationData {
  country: string;
  city: string;
  neighborhood: string;
  address: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationStepProps { 
  data: LocationData;
  onUpdate: (data: LocationData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  data,
  onUpdate,
}) => {
  const [position, setPosition] = useState<[number, number]>([
    data.latitude || 6.3725,
    data.longitude || 2.3542,
  ]);
  const [address, setAddress] = useState(data.address || "");
  const [showLocationButton, setShowLocationButton] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapHeight, setMapHeight] = useState(300);
  const [searchMode, setSearchMode] = useState<'address' | 'pin'>('address');
  const [showPinInstruction, setShowPinInstruction] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      
      if (isMobile) {
        if (keyboardVisible) {
          setMapHeight(height * 0.3);
        } else {
          setMapHeight(height * 0.4);
        }
      } else if (width < 1024) {
        setMapHeight(380);
      } else {
        setMapHeight(450);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Détection de l'ouverture/fermeture du clavier sur mobile
    const handleFocus = () => {
      if (window.innerWidth < 768) {
        setKeyboardVisible(true);
        setTimeout(handleResize, 100);  
      }
    };

    const handleBlur = () => {
      if (window.innerWidth < 768) {
        setKeyboardVisible(false);
        setTimeout(handleResize, 100);
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [keyboardVisible]);

  // Fermer le panneau de suggestion quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showLocationButton && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowLocationButton(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationButton]);

  const handleAddressSubmit = () => {
    if (!address.trim()) return;
    setIsLoadingLocation(true);
    setShowLocationButton(false);  
    
    // Simuler un délai pour la recherche
    setTimeout(() => {
      let lat = 6.3725;
      let lng = 2.3542;
      
      if (address.toLowerCase().includes("porto")) {
        lat = 6.4969; lng = 2.6289;
      } else if (address.toLowerCase().includes("parakou")) {
        lat = 9.3376; lng = 2.6303;
      } else if (address.toLowerCase().includes("ouidah")) {
        lat = 6.3639; lng = 2.0850;
      }
      
      setPosition([lat, lng]);
      onUpdate({
        ...data,
        latitude: lat,
        longitude: lng,
        address: address,
        city: "Cotonou",
      });
      
      setIsLoadingLocation(false);
      setSearchMode('pin');
      setShowPinInstruction(true);
      setTimeout(() => setShowPinInstruction(false), 5000);
    }, 1000);
  };

  const handlePositionChange = (lat: number, lng: number, city?: string) => {
    if (searchMode === 'pin') {
      setPosition([lat, lng]);
      onUpdate({
        ...data,
        latitude: lat,
        longitude: lng,
        city: city || data.city,
      });
    }
  };

  const useCurrentLocation = () => {
    setIsLoadingLocation(true);
    setShowLocationButton(false);  
    
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée");
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        onUpdate({ 
          ...data, 
          latitude: lat, 
          longitude: lng, 
          address: "Position actuelle",
          city: "Cotonou" 
        });
        setIsLoadingLocation(false);
        setSearchMode('pin');
        setShowPinInstruction(true);
        setTimeout(() => setShowPinInstruction(false), 5000);
      },
      () => {
        alert("Impossible de récupérer votre position");
        setIsLoadingLocation(false);
      }
    );
  };

  const switchToPinMode = () => {
    setSearchMode('pin');
    setShowLocationButton(false); 
    setShowPinInstruction(true);
    setTimeout(() => setShowPinInstruction(false), 5000);
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8"
      ref={containerRef}
      style={{ minHeight: keyboardVisible ? '100vh' : 'auto' }}
    >
      {/* TITRE */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Où est situé votre logement ?
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Votre adresse est uniquement communiquée aux voyageurs après réservation.
        </p>
      </div>

      {/* BANDEAU INSTRUCTION */}
      <div className="mb-4 sm:mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="hidden sm:flex p-2 bg-blue-100 rounded-lg shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-blue-900 text-xs sm:text-sm">
                {searchMode === 'address' ? "1. Saisissez l'adresse" : "2. Ajustez le curseur"}
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                {searchMode === 'address' 
                  ? "Entrez le nom de la rue ou du quartier." 
                  : "Déplacez le pin pour l'emplacement exact."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE CARTE */}
      <div 
        className="relative rounded-xl sm:rounded-2xl overflow-hidden w-full mb-4 sm:mb-6 border border-gray-200 shadow-sm"
        style={{ height: `${mapHeight}px` }}
      >
        <MapComponent
          position={position}
          zoom={searchMode === 'pin' ? 16 : 13}
          onPositionChange={handlePositionChange}
          allowDragging={searchMode === 'pin'}
        />

        {/* BARRE DE RECHERCHE SUR LA CARTE */}
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] max-w-xl z-10">
          <div className="bg-white rounded-full shadow-lg sm:shadow-xl flex items-center px-3 sm:px-4 py-2 gap-2 border border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Adresse, quartier..."
              value={address}
              onFocus={() => setShowLocationButton(true)}
              onChange={(e) => {
                setAddress(e.target.value);
                onUpdate({ ...data, address: e.target.value });
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddressSubmit()}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base bg-transparent min-w-0"
            />
            <button
              onClick={handleAddressSubmit}
              disabled={!address.trim() || isLoadingLocation}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
            >
              {isLoadingLocation ? "..." : "OK"}
            </button>
          </div>

          {/* SUGGESTION POSITION ACTUELLE */}
          {showLocationButton && (
            <div className="mt-2 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-1 max-h-[200px] overflow-y-auto">
              <button
                onClick={useCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
              >
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {isLoadingLocation ? "Localisation..." : "Utiliser ma position actuelle"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* OVERLAY INSTRUCTION */}
        {showPinInstruction && searchMode === 'pin' && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-10">
            <div className="bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-lg p-2.5 sm:p-3 flex items-start gap-2 sm:gap-3">
              <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-medium flex-1">
                Faites glisser la carte pour centrer le marqueur sur votre porte.
              </p>
              <button 
                onClick={() => setShowPinInstruction(false)} 
                className="p-0.5 shrink-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BOUTON PIN MANUEL */}
        {searchMode === 'address' && !showLocationButton && (
          <button
            onClick={switchToPinMode}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white rounded-full shadow-md sm:shadow-lg p-2 sm:p-3 border border-gray-200 active:scale-95 transition-transform z-10"
          >
            <Crosshair className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* RÉSUMÉ FINAL */}
      {(address || data.latitude) && !keyboardVisible && (
        <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm flex items-start gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
              {address || "Point sélectionné sur la carte"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Lat: {data.latitude?.toFixed(4)} • Long: {data.longitude?.toFixed(4)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};