"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  position: [number, number];
  zoom?: number;
  onPositionChange?: (lat: number, lng: number, city?: string) => void;
  allowDragging?: boolean; // ✅ AJOUT
}

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

const MapComponent: React.FC<MapComponentProps> = ({
  position,
  zoom = 12,
  onPositionChange,
  allowDragging = true, // ✅ par défaut : autorisé
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initializedRef.current) return;

    initializedRef.current = true;

    setTimeout(() => {
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
        draggable: allowDragging, // ✅ contrôlé
        icon: customIcon,
      }).addTo(mapRef.current);

      // Drag du marqueur
      markerRef.current.on("dragend", (e) => {
        if (!allowDragging) return; // ✅ sécurité

        const marker = e.target as L.Marker;
        const newPosition = marker.getLatLng();

        onPositionChange?.(newPosition.lat, newPosition.lng, "Cotonou");
      });

      // Clic sur la carte
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        if (!allowDragging) return; // ✅ bloqué si non autorisé

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
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []); // init une seule fois

  // 🔄 Mettre à jour position + zoom
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView(position, zoom);
      markerRef.current.setLatLng(position);
    }
  }, [position, zoom]);

  // 🔒 Activer / désactiver le drag dynamiquement
  useEffect(() => {
    if (markerRef.current) {
      if (allowDragging) {
        markerRef.current.dragging?.enable();
      } else {
        markerRef.current.dragging?.disable();
      }
    }
  }, [allowDragging]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-xl relative z-0 overflow-hidden"
    />
  );
};

export default MapComponent;
