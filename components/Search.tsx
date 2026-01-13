"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, Map, SlidersHorizontal, Filter } from 'lucide-react';

interface SearchProps {
  onBack: () => void;  
}

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  img: string;
}

const properties: Property[] = [
  { id: 1, title: "Villa des Cocotiers", type: "Villa", location: "Cotonou, Haie Vive", price: 45000, rating: 4.8, reviews: 124, img: "https://picsum.photos/600/400?random=101" },
  { id: 2, title: "Studio Moderne", type: "Appartement", location: "Abomey-Calavi", price: 15000, rating: 4.5, reviews: 45, img: "https://picsum.photos/600/400?random=102" },
  { id: 3, title: "Loft Artistique", type: "Loft", location: "Porto-Novo", price: 25000, rating: 4.9, reviews: 89, img: "https://picsum.photos/600/400?random=103" },
  { id: 4, title: "Chambre Cosy", type: "Chambre", location: "Cotonou, Fidjrossè", price: 10000, rating: 4.3, reviews: 22, img: "https://picsum.photos/600/400?random=104" },
  { id: 5, title: "Résidence le Palmier", type: "Maison entière", location: "Ouidah", price: 60000, rating: 4.95, reviews: 210, img: "https://picsum.photos/600/400?random=105" },
  { id: 6, title: "Appartement vue mer", type: "Appartement", location: "Cotonou, Zone des Ambassades", price: 80000, rating: 5.0, reviews: 56, img: "https://picsum.photos/600/400?random=106" },
  { id: 7, title: "Bungalow Nature", type: "Bungalow", location: "Grand-Popo", price: 30000, rating: 4.7, reviews: 78, img: "https://picsum.photos/600/400?random=107" },
  { id: 8, title: "Espace Coworking", type: "Bureau", location: "Cotonou, Gbégamey", price: 5000, rating: 4.6, reviews: 34, img: "https://picsum.photos/600/400?random=108" },
];

const filters: string[] = ["Tout", "Villas", "Appartements", "Bord de mer", "Campagne", "Luxe", "Petits prix"];

export const Search: React.FC<SearchProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<string>("Tout");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBackClick = (): void => {
    onBack();
  };

  const handleFilterClick = (filter: string): void => {
    setActiveFilter(filter);
  };

  const handlePropertyClick = (propertyId: number): void => {
    // Ajouter ici la logique de navigation vers la page de détails
    console.log('Property clicked:', propertyId);
  };

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>, propertyId: number): void => {
    e.stopPropagation();
    // Ajouter ici la logique pour gérer les favoris
    console.log('Favorite clicked:', propertyId);
  };

  const handleMapClick = (): void => {
    // Ajouter ici la logique pour afficher la carte
    console.log('Map button clicked');
  };

  const handleFiltersClick = (): void => {
    // Ajouter ici la logique pour ouvrir les filtres
    console.log('Filters button clicked');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-24 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-20 bg-white/95 backdrop-blur-sm z-30 py-4 -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={handleBackClick} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 self-start md:self-auto"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold md:hidden">Retour</span>
          </button>
          
          <div className="flex-1 w-full md:max-w-2xl">
            <div className="flex items-center border shadow-sm hover:shadow-md transition-shadow rounded-full p-2 pl-6 gap-4">
              <div className="flex-1 border-r border-gray-200 pr-4">
                <div className="text-xs font-bold text-gray-800">Destination</div>
                <input 
                  type="text" 
                  placeholder="Rechercher une ville..." 
                  className="w-full text-sm text-gray-600 outline-none placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Rechercher une ville"
                />
              </div>
              <div className="hidden sm:block flex-1 border-r border-gray-200 px-4">
                <div className="text-xs font-bold text-gray-800">Dates</div>
                <div className="text-sm text-gray-400">Ajouter des dates</div>
              </div>
              <div className="hidden sm:block flex-1 px-4">
                <div className="text-xs font-bold text-gray-800">Voyageurs</div>
                <div className="text-sm text-gray-400">Ajouter des voyageurs</div>
              </div>
              <button 
                className="bg-brand text-white p-3 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Filtres avancés"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            onClick={handleFiltersClick}
            className="hidden md:flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:border-gray-900 transition-colors text-sm font-semibold"
            aria-label="Ouvrir les filtres"
          >
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>

        {/* Categories / Filters */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`Filtrer par ${filter}`}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="group cursor-pointer"
              onClick={() => handlePropertyClick(property.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePropertyClick(property.id);
                }
              }}
              aria-label={`Voir les détails de ${property.title}`}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 mb-3">
                <img 
                  src={property.img} 
                  alt={`${property.title} à ${property.location}`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button 
                  onClick={(e) => handleFavoriteClick(e, property.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-transparent hover:scale-110 transition-transform"
                  aria-label={`Ajouter ${property.title} aux favoris`}
                >
                  <Heart className="w-6 h-6 text-white/70 hover:text-white fill-black/50 hover:fill-black/70" />
                </button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                  Invité favori
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 truncate pr-2">{property.location}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3 h-3 fill-current text-gray-900" />
                  <span>{property.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({property.reviews})</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-1">{property.type} • {property.title}</p>
              
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-semibold text-gray-900">
                  {property.price.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-gray-600 text-sm">par nuit</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Map Button (Mobile/Tablet) */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:hidden z-40">
          <button 
            onClick={handleMapClick}
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
            aria-label="Afficher la carte"
          >
            <Map className="w-4 h-4" />
            Carte
          </button>
        </div>

      </div>
    </motion.div>
  );
};