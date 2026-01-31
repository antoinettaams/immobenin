// components/publish/PublishFlow.tsx
"use client"
import React, { useState, useEffect, useCallback } from 'react'

// Import des étapes
import { OnboardingStep } from './steps/OnboardingStep'
import { HousingTypeStep } from './steps/HousingTypeStep'
import { LocationStep } from './steps/LocationStep'
import { BasicsStep } from './steps/BasicsStep'
import { AmenitiesStep } from './steps/AmenitiesStep'
import { PhotosStep } from './steps/PhotosStep'
import { TitleStep } from './steps/TitleStep'
import { DescriptionStep } from './steps/DescriptionStep'
import { PriceStep } from './steps/PriceStep'
import { ReviewStep } from './steps/ReviewStep'

// Types de données
export interface ListingData {
  // Étape 0: Identification du propriétaire
  owner: {
    telephone: string
    email: string
    nom: string
  }

  propertyType: { 
    category: 'house' | 'office' | 'event'
    subType: string
    privacy: 'entire' | 'private' | 'shared'
  }

  location: {
    country: string
    city: string
    neighborhood: string
    address: string
    postalCode?: string
    latitude?: number
    longitude?: number
  }

  basics: {
    // Pour maison
    maxGuests?: number
    bedrooms?: number
    beds?: number
    bathrooms?: number
    privateEntrance?: boolean
    
    // Pour bureau
    employees?: number
    offices?: number
    meetingRooms?: number
    workstations?: number
    hasReception?: boolean
    
    // Pour événement
    eventCapacity?: number
    kitchenAvailable?: boolean
    parkingSpots?: number
    wheelchairAccessible?: boolean
    hasStage?: boolean
    hasSoundSystem?: boolean
    hasProjector?: boolean
    hasCatering?: boolean
    minBookingHours?: number
    
    // Commun
    size?: number
    floors?: number
  }

  amenities: string[]

  photos: Array<{
    id: string
    url: string
    file: File | null
    isPrimary: boolean
  }>

  title: string

  description: {
    summary: string
    spaceDescription: string
    guestAccess: string
    neighborhood: string
  }

  pricing: {
    basePrice: number
    currency: string
    weeklyDiscount: number
    monthlyDiscount: number
    cleaningFee: number
    extraGuestFee: number
    securityDeposit: number
  }

  rules: {
    checkInTime: string
    checkOutTime: string
    smokingAllowed: boolean
    petsAllowed: boolean
    partiesAllowed: boolean
    childrenAllowed: boolean
  }
}

interface StepValidation {
  isValid: boolean
  isLoading?: boolean
  message?: string
}

interface PublishFlowProps {
  onComplete?: () => void
}

export const PublishFlow: React.FC<PublishFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isValid: false,
    isLoading: false
  })
  const [publishError, setPublishError] = useState<string | null>(null)

  // LOG INITIAL
  console.log('🚀 PUBLISHFLOW INITIALISÉ')
  console.log('📊 currentStep initial:', currentStep)

  const [listingData, setListingData] = useState<ListingData>({
    owner: {
      telephone: '',
      email: '',
      nom: '',
    },
    
    propertyType: { category: 'house', subType: '', privacy: 'entire' },
    location: { country: 'Bénin', city: '', neighborhood: '', address: '' },
    basics: {
      maxGuests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      size: 50,
      floors: 0,
      privateEntrance: false,
    },
    amenities: [],
    photos: [],
    title: '',
    description: { summary: '', spaceDescription: '', guestAccess: '', neighborhood: '' },
    pricing: {
      basePrice: 0,
      currency: 'FCFA',
      weeklyDiscount: 10,
      monthlyDiscount: 20,
      cleaningFee: 0,
      extraGuestFee: 0,
      securityDeposit: 0,
    },
    rules: {
      checkInTime: '15:00',
      checkOutTime: '11:00',
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      childrenAllowed: true,
    }
  })

  // Validation de chaque étape
  const validateCurrentStep = useCallback((): boolean => {
    console.log(`🔍 VALIDATION étape ${currentStep}`)
    
    let isValid = false

    switch (currentStep) {
      case 0: // OnboardingStep
        const { telephone, email, nom } = listingData.owner
        isValid = Boolean(
          telephone && 
          email && 
          nom &&
          telephone.trim().length > 0 &&
          email.trim().length > 0 &&
          nom.trim().length >= 2
        )
        console.log('📋 Validation étape 0:', { telephone, email, nom, isValid })
        break

      case 1: // HousingTypeStep
        isValid = Boolean(listingData.propertyType.subType.trim())
        console.log('📋 Validation étape 1:', { 
          subType: listingData.propertyType.subType, 
          isValid 
        })
        break

      case 2: // LocationStep
        isValid = Boolean(
          listingData.location.city.trim() && 
          listingData.location.address.trim()
        )
        console.log('📋 Validation étape 2:', { 
          city: listingData.location.city, 
          address: listingData.location.address, 
          isValid 
        })
        break

      case 3: // BasicsStep
        if (listingData.propertyType.category === 'house') {
          isValid = Boolean(
            listingData.basics.maxGuests && 
            listingData.basics.maxGuests > 0
          )
          console.log('📋 Validation étape 3 (house):', { 
            maxGuests: listingData.basics.maxGuests, 
            isValid 
          })
        } else if (listingData.propertyType.category === 'office') {
          isValid = Boolean(
            listingData.basics.employees && 
            listingData.basics.employees > 0
          )
          console.log('📋 Validation étape 3 (office):', { 
            employees: listingData.basics.employees, 
            isValid 
          })
        } else if (listingData.propertyType.category === 'event') {
          isValid = Boolean(
            listingData.basics.eventCapacity && 
            listingData.basics.eventCapacity > 0
          )
          console.log('📋 Validation étape 3 (event):', { 
            eventCapacity: listingData.basics.eventCapacity, 
            isValid 
          })
        }
        break

      case 4: // AmenitiesStep
        isValid = true // Toujours valide - optionnel
        console.log('📋 Validation étape 4: toujours valide')
        break

      case 5: // PhotosStep
        isValid = listingData.photos.length >= 1
        console.log('📋 Validation étape 5:', { 
          photosCount: listingData.photos.length, 
          isValid 
        })
        break

      case 6: // TitleStep
        isValid = Boolean(
          listingData.title.trim() && 
          listingData.title.length >= 10
        )
        console.log('📋 Validation étape 6:', { 
          title: listingData.title, 
          length: listingData.title?.length, 
          isValid 
        })
        break

      case 7: // DescriptionStep
        isValid = Boolean(
          listingData.description.summary.trim() && 
          listingData.description.summary.length >= 50
        )
        console.log('📋 Validation étape 7:', { 
          summaryLength: listingData.description.summary?.length, 
          isValid 
        })
        break

      case 8: // PriceStep
        isValid = Boolean(
          listingData.pricing.basePrice && 
          listingData.pricing.basePrice > 0
        )
        console.log('📋 Validation étape 8:', { 
          basePrice: listingData.pricing.basePrice, 
          isValid 
        })
        break

      case 9: // ReviewStep
        isValid = true // Toujours valide
        console.log('📋 Validation étape 9: toujours valide')
        break

      default:
        isValid = false
        console.log('📋 Validation étape inconnue:', currentStep)
    }

    console.log(`✅ Résultat validation étape ${currentStep}:`, isValid)
    setStepValidation(prev => ({ ...prev, isValid }))
    return isValid
  }, [currentStep, listingData])

  useEffect(() => {
    console.log('🔄 useEffect initial - setIsClient(true)')
    setIsClient(true)
    const timer = setTimeout(() => {
      console.log('⏱️ Validation initiale après timeout')
      validateCurrentStep()
    }, 100)
    return () => {
      console.log('🧹 Cleanup timeout initial')
      clearTimeout(timer)
    }
  }, [])

  // Mise à jour des données
  const updateData = useCallback(<K extends keyof ListingData>(section: K, data: ListingData[K]) => {
    console.log(`📝 UPDATE data - section: ${section}`, data)
    setListingData(prev => ({
      ...prev,
      [section]: data
    }))
  }, [])

  // Valider après chaque mise à jour de données
  useEffect(() => {
    if (isClient) {
      console.log('🔄 useEffect validation - isClient:', isClient)
      const timer = setTimeout(() => {
        console.log('⏱️ Validation après update')
        validateCurrentStep()
      }, 50)
      return () => {
        console.log('🧹 Cleanup validation')
        clearTimeout(timer)
      }
    }
  }, [listingData, isClient, validateCurrentStep])

  // Navigation
  const nextStep = async () => {
    console.log('➡️ NEXTSTEP appelé - étape actuelle:', currentStep)
    console.log('📊 Validation actuelle:', stepValidation)
    
    if (!stepValidation.isValid || stepValidation.isLoading) {
      console.log('❌ NEXTSTEP bloqué - raison:', {
        isValid: stepValidation.isValid,
        isLoading: stepValidation.isLoading
      })
      return
    }
    
    console.log('🔄 NEXTSTEP - début loading')
    setStepValidation(prev => ({ ...prev, isLoading: true }))
    
    // Simulation de chargement courte
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (currentStep < 9) {
      console.log(`🔼 Passage étape ${currentStep} → ${currentStep + 1}`)
      if (isClient) {
        window.scrollTo(0, 0)
      }
      setCurrentStep(prev => prev + 1)
      setStepValidation(prev => ({ ...prev, isLoading: false }))
      console.log('✅ NEXTSTEP terminé')
    } else {
      console.log('⚠️ NEXTSTEP - Déjà à la dernière étape')
    }
  }

  const prevStep = () => {
    console.log('⬅️ PREVSTEP appelé - étape actuelle:', currentStep)
    if (currentStep > 0 && !stepValidation.isLoading) {
      console.log(`🔽 Retour étape ${currentStep} → ${currentStep - 1}`)
      if (isClient) {
        window.scrollTo(0, 0)
      }
      setCurrentStep(prev => prev - 1)
      console.log('✅ PREVSTEP terminé')
    } else {
      console.log('❌ PREVSTEP bloqué - raison:', {
        currentStep,
        isLoading: stepValidation.isLoading
      })
    }
  }

  // Fonction pour sauvegarder et quitter
  const handleSaveAndExit = () => {
    console.log('💾 SAVE AND EXIT appelé')
    if (isClient && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('draft_listing', JSON.stringify(listingData))
      alert('Votre annonce a été sauvegardée en brouillon. Vous pouvez la reprendre plus tard.')
      window.location.href = '/'
    }
  }

  // Fonction pour publier - CONNECTÉE À L'API
  const handlePublish = async () => {
    console.log('🚀🚀🚀 HANDLEPUBLISH APPELÉ !!! 🚀🚀🚀')
    console.log('📊 Étape actuelle (doit être 9):', currentStep)
    console.log('📊 Données complètes:', JSON.stringify(listingData, null, 2))
    
    if (stepValidation.isLoading) {
      console.log('❌ HANDLEPUBLISH bloqué - déjà loading')
      return
    }
    
    setStepValidation(prev => ({ ...prev, isLoading: true, message: 'Publication en cours...' }))
    setPublishError(null)
    
    try {
      console.log('📤 Préparation des données pour API...')
      
      // 1. Transformer les données pour correspondre au schéma Prisma
      const prismaData = {
        // Étape 1: Informations propriétaire
        onboarding: {
          telephone: listingData.owner.telephone,
          email: listingData.owner.email,
          nom: listingData.owner.nom
        },
        
        // Étape 2: Type de propriété
        housingType: {
          category: listingData.propertyType.category.toUpperCase(), // "HOUSE", "OFFICE", "EVENT"
          subType: listingData.propertyType.subType,
          privacy: listingData.propertyType.privacy?.toUpperCase() // "ENTIRE", "PRIVATE", "SHARED"
        },
        
        // Étape 3: Localisation
        location: {
          country: listingData.location.country,
          city: listingData.location.city,
          neighborhood: listingData.location.neighborhood,
          address: listingData.location.address,
          postalCode: listingData.location.postalCode,
          latitude: listingData.location.latitude,
          longitude: listingData.location.longitude
        },
        
        // Étape 4: Caractéristiques de base
        basics: {
          ...listingData.basics,
          // Conversion en nombres
          size: listingData.basics.size ? Number(listingData.basics.size) : undefined,
          floors: listingData.basics.floors ? Number(listingData.basics.floors) : undefined,
          maxGuests: listingData.basics.maxGuests ? Number(listingData.basics.maxGuests) : undefined,
          bedrooms: listingData.basics.bedrooms ? Number(listingData.basics.bedrooms) : undefined,
          beds: listingData.basics.beds ? Number(listingData.basics.beds) : undefined,
          bathrooms: listingData.basics.bathrooms ? Number(listingData.basics.bathrooms) : undefined,
          employees: listingData.basics.employees ? Number(listingData.basics.employees) : undefined,
          offices: listingData.basics.offices ? Number(listingData.basics.offices) : undefined,
          meetingRooms: listingData.basics.meetingRooms ? Number(listingData.basics.meetingRooms) : undefined,
          workstations: listingData.basics.workstations ? Number(listingData.basics.workstations) : undefined,
          eventCapacity: listingData.basics.eventCapacity ? Number(listingData.basics.eventCapacity) : undefined,
          parkingSpots: listingData.basics.parkingSpots ? Number(listingData.basics.parkingSpots) : undefined,
          minBookingHours: listingData.basics.minBookingHours ? Number(listingData.basics.minBookingHours) : undefined
        },
        
        // Étape 5: Équipements
        amenities: listingData.amenities,
        
        // Étape 6: Photos - FORMAT CORRECT POUR L'API
        photos: listingData.photos.map(photo => ({
          url: photo.url,
          isPrimary: photo.isPrimary || false
        })),
        
        // Étape 7: Titre
        title: listingData.title,
        
        // Étape 8: Description
        description: listingData.description,
        
        // Étape 9: Prix
        price: {
          basePrice: Number(listingData.pricing.basePrice),
          currency: listingData.pricing.currency,
          weeklyDiscount: Number(listingData.pricing.weeklyDiscount),
          monthlyDiscount: Number(listingData.pricing.monthlyDiscount),
          cleaningFee: Number(listingData.pricing.cleaningFee),
          extraGuestFee: Number(listingData.pricing.extraGuestFee),
          securityDeposit: Number(listingData.pricing.securityDeposit)
        },
        
        // Étape 10: Règles
        rules: {
          checkInTime: listingData.rules.checkInTime,
          checkOutTime: listingData.rules.checkOutTime,
          childrenAllowed: listingData.rules.childrenAllowed
        }
      }
      
      console.log('📦 Données transformées pour API:', JSON.stringify(prismaData, null, 2))
      console.log('🌐 Envoi POST à /api/publish...')
      
      // 2. Envoie à l'API
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prismaData),
      })
      
      console.log('📥 Réponse reçue - Status:', response.status)
      console.log('📥 Réponse OK?:', response.ok)
      
      const result = await response.json()
      console.log('📥 Réponse JSON:', result)
      
      if (!response.ok) {
        console.error('❌ Erreur API:', result)
        throw new Error(result.error || result.message || 'Erreur lors de la publication')
      }
      
      console.log('✅ Publication réussie:', result)
      
      // 3. Nettoyer le brouillon
      if (isClient && typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('draft_listing')
        console.log('🧹 Brouillon nettoyé')
      }
      
      // 4. Notifier le succès
      setStepValidation(prev => ({ 
        ...prev, 
        isValid: true, 
        isLoading: false, 
        message: 'Publication réussie !' 
      }))
      
      // 5. Appeler le callback de complétion
      if (onComplete) {
        console.log('📞 Appel onComplete')
        onComplete()
      } else {
        // Redirection par défaut
        console.log('🔀 Redirection vers /')
        window.location.href = '/?published=true'
      }
      
    } catch (error: any) {
      console.error('❌ Erreur de publication:', error)
      console.error('Stack:', error.stack)
      
      setPublishError(error.message || 'Erreur lors de la publication')
      setStepValidation(prev => ({ 
        ...prev, 
        isLoading: false, 
        message: error.message || 'Erreur lors de la publication' 
      }))
      
      // Afficher l'erreur
      alert(`Erreur de publication: ${error.message || 'Impossible de publier l\'annonce'}`)
    }
  }

  // Rendu de l'étape actuelle
  const renderStep = () => {
    console.log(`🎬 RENDERSTEP - étape ${currentStep}`)
    const { propertyType } = listingData
    
    switch (currentStep) {
      case 0:
        console.log('🎯 Rendu: OnboardingStep')
        return (
          <OnboardingStep
            key="onboarding"
            data={listingData.owner}
            onUpdate={(data) => updateData('owner', data)}
            onNext={nextStep}
          />
        )
      case 1:
        console.log('🎯 Rendu: HousingTypeStep')
        return (
          <HousingTypeStep
            key="housing-type"
            data={listingData.propertyType}
            onUpdate={(data) => updateData('propertyType', data)}
            onNext={nextStep}
          />
        )
      case 2:
        console.log('🎯 Rendu: LocationStep')
        return (
          <LocationStep
            key="location"
            data={listingData.location}
            onUpdate={(data) => updateData('location', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        console.log('🎯 Rendu: BasicsStep')
        return (
          <BasicsStep
            key="basics"
            data={listingData.basics}
            propertyCategory={propertyType.category}
            onUpdate={(data) => updateData('basics', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        console.log('🎯 Rendu: AmenitiesStep')
        return (
          <AmenitiesStep
            key="amenities"
            data={listingData.amenities}
            propertyCategory={listingData.propertyType.category}
            onUpdate={(data) => updateData('amenities', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 5:
        console.log('🎯 Rendu: PhotosStep')
        return (
          <PhotosStep
            key="photos"
            data={listingData.photos}
            onUpdate={(data) => updateData('photos', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 6:
        console.log('🎯 Rendu: TitleStep')
        return (
          <TitleStep
            key="title"
            data={listingData.title}
            propertyCategory={listingData.propertyType.category}
            propertyLocation={listingData.location}
            onUpdate={(data) => updateData('title', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 7:
        console.log('🎯 Rendu: DescriptionStep')
        return (
          <DescriptionStep
            key="description"
            data={listingData.description}
            propertyCategory={listingData.propertyType.category}
            propertyLocation={listingData.location}
            propertyType={listingData.propertyType}
            onUpdate={(data) => updateData('description', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 8:
        console.log('🎯 Rendu: PriceStep')
        return (
          <PriceStep
            key="price"
            data={listingData.pricing}
            propertyCategory={listingData.propertyType.category}
            propertySubType={listingData.propertyType.subType}
            onUpdate={(data) => updateData('pricing', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 9:
        console.log('🎯 Rendu: ReviewStep (DERNIÈRE ÉTAPE)')
        return (
          <ReviewStep
            key="review"
            data={listingData}
            onEdit={(stepNumber) => {
              console.log('✏️ Edit vers étape:', stepNumber)
              setCurrentStep(stepNumber)
            }}
            onSubmit={handlePublish}
            onBack={prevStep}
            isLoading={stepValidation.isLoading}
            error={publishError}
          />
        )
      default:
        console.log('❌ Rendu: étape inconnue')
        return null
    }
  }

  if (!isClient) {
    console.log('⏳ Pas encore client - affichage loading')
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Calcul de la progression pour la barre
  const progressPercentage = (currentStep / 9) * 100
  console.log(`📊 Progression: ${progressPercentage}% (étape ${currentStep}/9)`)
  console.log(`🎯 Bouton doit dire: ${currentStep === 9 ? 'PUBLIER' : 'SUIVANT'}`)
  console.log(`🔘 Bouton activé?: ${stepValidation.isValid && !stepValidation.isLoading}`)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-brand">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2C16 2 3 10 3 18C3 24 8 29 16 31C24 29 29 24 29 18C29 10 16 2 16 2ZM16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19Z" />
                  <path d="M16 6L24 13V24H8V13L16 6Z" fill="white" fillOpacity="0.3"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ImmoBenin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 max-w-5xl mx-auto px-8 py-8">
        {renderStep()}
      </main>

      {/* Footer avec barre de progression */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4">
          {/* Barre de progression */}
          <div className="relative mb-6">
            {/* Ligne de fond */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            
            {/* Ligne de progression */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Points d'étape */}
            <div className="relative flex justify-between">
              {Array.from({ length: 10 }).map((_, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div key={index} className="relative flex flex-col items-center">
                    <div className={`
                      w-3 h-3 rounded-full border-2 z-10
                      transition-all duration-300
                      ${isCompleted 
                        ? 'bg-brand border-brand' 
                        : isActive 
                          ? 'bg-white border-brand' 
                          : 'bg-white border-gray-300'
                      }
                    `}>
                      {isCompleted && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white m-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Boutons de navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || stepValidation.isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0 || stepValidation.isLoading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Retour
            </button>
            
            <button
              onClick={currentStep === 9 ? handlePublish : nextStep}
              disabled={!stepValidation.isValid || stepValidation.isLoading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 min-w-[120px] justify-center ${
                !stepValidation.isValid || stepValidation.isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-brand text-white hover:bg-brand/90'
              }`}
            >
              {stepValidation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {currentStep === 9 ? 'Publication...' : 'Chargement...'}
                </>
              ) : (
                <>
                  {currentStep === 9 ? 'Publier' : 'Suivant'}
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}