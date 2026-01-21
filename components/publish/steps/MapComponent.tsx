"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  position: [number, number];
  zoom?: number;
  onPositionChange?: (lat: number, lng: number, city?: string) => void;
  allowDragging?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  position,
  zoom = 12,
  onPositionChange,
  allowDragging = true,
}) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Vérifier qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // NE PAS initialiser Leaflet côté serveur
    if (!isClient || !containerRef.current || initializedRef.current) return;

    // Importer Leaflet dynamiquement côté client
    import("leaflet").then((L) => {
      // Fix pour les icônes Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      initializedRef.current = true;

      // Initialiser la carte
      mapRef.current = L.map(containerRef.current!, {
        attributionControl: false,
        zoomControl: false,
      }).setView(position, zoom);

      // Fond de carte
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Icône personnalisée
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #DC2626;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      // Marqueur
      markerRef.current = L.marker(position, {
        draggable: allowDragging,
        icon: customIcon,
      }).addTo(mapRef.current);

      // Drag du marqueur
      markerRef.current.on("dragend", (e) => {
        if (!allowDragging) return;
        const marker = e.target as L.Marker;
        const newPosition = marker.getLatLng();
        onPositionChange?.(newPosition.lat, newPosition.lng, "Cotonou");
      });

      // Clic sur la carte
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        if (!allowDragging) return;
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          onPositionChange?.(lat, lng, "Cotonou");
        }
      });

      // Redessin
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [isClient]); // Dépendre de isClient

  // 🔄 Mettre à jour position + zoom
  useEffect(() => {
    if (isClient && mapRef.current && markerRef.current) {
      mapRef.current.setView(position, zoom);
      markerRef.current.setLatLng(position);
    }
  }, [position, zoom, isClient]);

  // 🔒 Activer / désactiver le drag dynamiquement
  useEffect(() => {
    if (isClient && markerRef.current) {
      if (allowDragging) {
        markerRef.current.dragging?.enable();
      } else {
        markerRef.current.dragging?.disable();
      }
    }
  }, [allowDragging, isClient]);

  // Si pas encore côté client, afficher un placeholder
  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className="h-full w-full rounded-xl relative z-0 overflow-hidden bg-gray-200 flex items-center justify-center"
      >
        <div className="text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-xl relative z-0 overflow-hidden"
    />
  );
};

export default MapComponent;