// components/publish/steps/PhotosStep.tsx
"use client";
import React, { useState, useCallback } from 'react';
import { Upload, Camera, X, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/Button';

interface Photo {
  id: string;
  url: string;
  file: File | null;
  isPrimary: boolean;
}

interface PhotosStepProps {
  data: Photo[];
  onUpdate: (photos: Photo[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhotosStep: React.FC<PhotosStepProps> = ({
  data,
  onUpdate,
}) => {
  const [photos, setPhotos] = useState<Photo[]>(data);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileSelect = (files: FileList) => {
    const newPhotos: Photo[] = [];
    
    Array.from(files).slice(0, 10 - photos.length).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const id = `photo-${Date.now()}-${index}`;
        const url = URL.createObjectURL(file);
        newPhotos.push({ id, url, file, isPrimary: false });
      }
    });
    
    const updatedPhotos = [...photos, ...newPhotos];
    
    // Si c'est la première photo, la définir comme principale
    if (photos.length === 0 && newPhotos.length > 0) {
      updatedPhotos[0].isPrimary = true;
    }
    
    setPhotos(updatedPhotos);
    onUpdate(updatedPhotos);
    
    // Simulation de progression d'upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setUploadProgress(null);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [photos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePhoto = (id: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    
    // Si on supprime la photo principale et qu'il reste des photos
    if (photos.find(p => p.id === id)?.isPrimary && updatedPhotos.length > 0) {
      updatedPhotos[0].isPrimary = true;
    }
    
    setPhotos(updatedPhotos);
    onUpdate(updatedPhotos);
  };

  const setPrimaryPhoto = (id: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === id
    }));
    setPhotos(updatedPhotos);
    onUpdate(updatedPhotos);
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const updatedPhotos = [...photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(updatedPhotos);
    onUpdate(updatedPhotos);
  };

  const canContinue = photos.length >= 3;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
      {/* En-tête */}
      <div className="mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
          Ajoutez des photos de votre espace
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          Les voyageurs veulent voir à quoi ressemble votre espace avant de réserver
        </p>
      </div>

      {/* Zone de drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          mb-6 sm:mb-8 border-2 sm:border-3 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-brand bg-brand/5' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 ${isDragging ? 'text-brand' : 'text-gray-400'}`} />
        
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
          {isDragging ? 'Déposez vos photos ici' : 'Glissez vos photos ici'}
        </h3>
        
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          ou choisissez-les depuis votre appareil
        </p>
        
        <Button variant="secondary" size="md" className="w-full sm:w-auto">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Sélectionner des photos</span>
        </Button>
        
        <input
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        />
        
        <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          PNG, JPG, JPEG jusqu'à 10MB
        </p>
      </div>

      {/* Barre de progression */}
      {uploadProgress !== null && uploadProgress < 100 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Téléchargement...</span>
            <span className="text-xs sm:text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-brand h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Galerie de photos */}
      {photos.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Vos photos ({photos.length}/20)
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 flex items-center">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-yellow-500 flex-shrink-0" />
              <span>La première photo sera la photo de couverture</span>
            </div>
          </div>
          
          {/* Grille de photos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`
                  relative group rounded-lg sm:rounded-xl overflow-hidden border
                  ${photo.isPrimary ? 'border-2 border-brand' : 'border border-gray-200'}
                `}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryPhoto(photo.id);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full ${photo.isPrimary ? 'bg-yellow-500 text-white' : 'bg-white/90 text-gray-700'}`}
                      title="Définir comme photo de couverture"
                    >
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-white/90 text-gray-700"
                      title="Supprimer"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  
                  {/* Badge photo principale */}
                  {photo.isPrimary && (
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-yellow-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span className="hidden sm:inline">Couverture</span>
                      <span className="sm:hidden">Couv.</span>
                    </div>
                  )}
                  
                  {/* Numéro de la photo */}
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/70 text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                
                {/* Boutons de déplacement */}
                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex justify-between">
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePhoto(index, index - 1);
                      }}
                      className="p-1 sm:p-1.5 bg-white/90 rounded-full text-gray-700 text-xs sm:text-sm"
                      title="Déplacer vers la gauche"
                    >
                      ←
                    </button>
                  )}
                  
                  {index < photos.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePhoto(index, index + 1);
                      }}
                      className="p-1 sm:p-1.5 bg-white/90 rounded-full text-gray-700 text-xs sm:text-sm ml-auto"
                      title="Déplacer vers la droite"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Conseils pour de bonnes photos</h3>
            <ul className="space-y-1 text-blue-800 text-xs sm:text-sm">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prenez des photos avec une bonne lumière naturelle</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Montrez chaque pièce importante</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Incluez les équipements mentionnés précédemment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>La première photo sera la photo de couverture</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Minimum 5 photos recommandées</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compteur minimum */}
      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-gray-900 text-sm sm:text-base">
              {photos.length >= 5 ? '✓ ' : ''}
              {photos.length} photo{photos.length > 1 ? 's' : ''} téléchargée{photos.length > 1 ? 's' : ''}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Minimum 5 photos recommandées ({Math.max(0, 5 - photos.length)} restantes)
            </div>
          </div>
          {photos.length > 0 && (
            <button
              onClick={() => {
                setPhotos([]);
                onUpdate([]);
              }}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium py-1 sm:py-2 px-2 sm:px-3 hover:bg-red-50 rounded-lg transition-colors"
            >
              Supprimer toutes les photos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};