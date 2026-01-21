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
  const [mapHeight, setMapHeight] = useState(420);
  const [searchMode, setSearchMode] = useState<'address' | 'pin'>('address');
  const [showPinInstruction, setShowPinInstruction] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMapHeight = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Sur mobile, on essaie d'occuper une part importante de l'écran sans le noyer
      if (width < 640) setMapHeight(Math.min(height * 0.5, 350)); 
      else if (width < 768) setMapHeight(380);
      else if (width < 1024) setMapHeight(400);
      else setMapHeight(450);
    };
    updateMapHeight();
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, []);

  const handleAddressSubmit = () => {
    if (!address.trim()) return;
    setIsLoadingLocation(true);
    
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
    setShowPinInstruction(true);
    setTimeout(() => setShowPinInstruction(false), 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" ref={containerRef}>
      {/* TITRE */}
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Où est situé votre logement ?
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Votre adresse est uniquement communiquée aux voyageurs après réservation.
        </p>
      </div>

      {/* BANDEAU INSTRUCTION (Caché sur très petit mobile pour gagner de la place si besoin, ou réduit) */}
      <div className="mb-5">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 text-sm sm:text-base">
                {searchMode === 'address' ? "1. Saisissez l'adresse" : "2. Ajustez le curseur"}
              </p>
              <p className="text-xs sm:text-sm text-blue-700">
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
        className="relative rounded-2xl overflow-hidden w-full mb-6 border border-gray-200 shadow-sm"
        style={{ height: `${mapHeight}px` }}
      >
        <MapComponent
          position={position}
          zoom={searchMode === 'pin' ? 16 : 13}
          onPositionChange={handlePositionChange}
          allowDragging={searchMode === 'pin'}
        />

        {/* BARRE DE RECHERCHE SUR LA CARTE */}
        <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[85%] max-w-xl z-10">
          <div className="bg-white rounded-full shadow-xl flex items-center px-3 sm:px-5 py-2 sm:py-3 gap-2 border border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <input
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
              className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoadingLocation ? "..." : "OK"}
            </button>
          </div>

          {/* SUGGESTION POSITION ACTUELLE */}
          {showLocationButton && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-1">
              <button
                onClick={useCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {isLoadingLocation ? "Localisation..." : "Utiliser ma position actuelle"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* OVERLAY INSTRUCTION PIN (MOBILE OPTIMIZED) */}
        {showPinInstruction && searchMode === 'pin' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-10">
            <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-3 sm:p-4 flex items-center gap-3">
              <Crosshair className="w-5 h-5 shrink-0" />
              <p className="text-xs sm:text-sm font-medium flex-1">
                Faites glisser la carte pour centrer le marqueur sur votre porte.
              </p>
              <button onClick={() => setShowPinInstruction(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BOUTON PIN MANUEL (Quick Action) */}
        {searchMode === 'address' && !showLocationButton && (
          <button
            onClick={switchToPinMode}
            className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg p-3 border border-gray-200 active:scale-95 transition-transform z-10"
          >
            <Crosshair className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* RÉSUMÉ FINAL */}
      {(address || data.latitude) && (
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
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