// components/publish/PublishFlow.tsx
"use client"
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'

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
      maxGuests: 0,
      bedrooms: 0,
      beds: 0,
      bathrooms: 0,
      size: 0,
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

  // Validation de chaque étape - TOUTES LES ÉTAPES OBLIGATOIRES
  const validateCurrentStep = useCallback((): boolean => {
    console.log(`🔍 VALIDATION étape ${currentStep}`)
    
    let isValid = false

    switch (currentStep) {
      case 0: // OnboardingStep - TOUS LES CHAMPS REQUIS
        const { telephone, email, nom } = listingData.owner
        isValid = Boolean(
          telephone && 
          email && 
          nom &&
          telephone.trim().length >= 8 && // Au moins 8 caractères pour un téléphone
          email.trim().length > 0 && // Email non vide
          email.includes('@') && // Email valide
          email.includes('.') &&
          nom.trim().length >= 2 // Nom d'au moins 2 caractères
        )
        console.log('📋 Validation étape 0 (Onboarding):', { 
          telephoneLength: telephone?.trim().length, 
          emailValid: email?.includes('@'), 
          nomLength: nom?.trim().length, 
          isValid 
        })
        break

      case 1: // HousingTypeStep - TYPE ET SOUS-TYPE REQUIS
        isValid = Boolean(
          listingData.propertyType.category && 
          listingData.propertyType.subType.trim() && 
          listingData.propertyType.subType.trim().length > 0 &&
          listingData.propertyType.privacy
        )
        console.log('📋 Validation étape 1 (HousingType):', { 
          category: listingData.propertyType.category, 
          subType: listingData.propertyType.subType, 
          privacy: listingData.propertyType.privacy,
          isValid 
        })
        break

      case 2: // LocationStep - VILLE ET ADRESSE REQUISES
        isValid = Boolean(
          listingData.location.city.trim() && 
          listingData.location.city.trim().length > 0 &&
          listingData.location.address.trim() && 
          listingData.location.address.trim().length > 0
        )
        console.log('📋 Validation étape 2 (Location):', { 
          city: listingData.location.city, 
          address: listingData.location.address, 
          isValid 
        })
        break

      case 3: // BasicsStep - CHAMPS SPÉCIFIQUES SELON CATÉGORIE
        if (listingData.propertyType.category === 'house') {
          isValid = Boolean(
            listingData.basics.maxGuests !== undefined && 
            listingData.basics.maxGuests > 0 && // Au moins 1 voyageur
            listingData.basics.beds !== undefined && 
            listingData.basics.beds > 0 && // Au moins 1 lit
            listingData.basics.size !== undefined && 
            listingData.basics.size > 0 // Surface positive
          )
          console.log('📋 Validation étape 3 (Basics - house):', { 
            maxGuests: listingData.basics.maxGuests, 
            beds: listingData.basics.beds,
            size: listingData.basics.size,
            isValid 
          })
        } else if (listingData.propertyType.category === 'office') {
          isValid = Boolean(
            listingData.basics.employees !== undefined && 
            listingData.basics.employees > 0 && // Au moins 1 employé
            listingData.basics.size !== undefined && 
            listingData.basics.size > 0 // Surface positive
          )
          console.log('📋 Validation étape 3 (Basics - office):', { 
            employees: listingData.basics.employees, 
            size: listingData.basics.size,
            isValid 
          })
        } else if (listingData.propertyType.category === 'event') {
          isValid = Boolean(
            listingData.basics.eventCapacity !== undefined && 
            listingData.basics.eventCapacity > 0 && // Capacité positive
            listingData.basics.size !== undefined && 
            listingData.basics.size > 0 // Surface positive
          )
          console.log('📋 Validation étape 3 (Basics - event):', { 
            eventCapacity: listingData.basics.eventCapacity, 
            size: listingData.basics.size,
            isValid 
          })
        }
        break

      case 4: // AmenitiesStep - Au moins une commodité sélectionnée
        isValid = listingData.amenities.length > 0
        console.log('📋 Validation étape 4 (Amenities):', { 
          amenitiesCount: listingData.amenities.length, 
          isValid 
        })
        break

      case 5: // PhotosStep - Au moins une photo requise
        isValid = listingData.photos.length >= 1
        console.log('📋 Validation étape 5 (Photos):', { 
          photosCount: listingData.photos.length, 
          isValid 
        })
        break

      case 6: // TitleStep - Titre d'au moins 10 caractères
        isValid = Boolean(
          listingData.title.trim() && 
          listingData.title.trim().length >= 10
        )
        console.log('📋 Validation étape 6 (Title):', { 
          title: listingData.title, 
          length: listingData.title?.trim().length, 
          isValid 
        })
        break

      case 7: // DescriptionStep - Résumé d'au moins 50 caractères
        isValid = Boolean(
          listingData.description.summary.trim() && 
          listingData.description.summary.trim().length >= 50
        )
        console.log('📋 Validation étape 7 (Description):', { 
          summaryLength: listingData.description.summary?.trim().length, 
          isValid 
        })
        break

      case 8: // PriceStep - Prix de base positif
        isValid = Boolean(
          listingData.pricing.basePrice && 
          listingData.pricing.basePrice > 0
        )
        console.log('📋 Validation étape 8 (Price):', { 
          basePrice: listingData.pricing.basePrice, 
          isValid 
        })
        break

      case 9: // ReviewStep - Validation finale avant publication
        // Pour l'étape de revue, on vérifie que TOUT est rempli
        const allStepsValid = 
          Boolean(listingData.owner.telephone.trim()) &&
          Boolean(listingData.owner.email.trim()) &&
          Boolean(listingData.owner.nom.trim()) &&
          Boolean(listingData.propertyType.subType.trim()) &&
          Boolean(listingData.location.city.trim()) &&
          Boolean(listingData.location.address.trim()) &&
          listingData.photos.length >= 1 &&
          Boolean(listingData.title.trim()) &&
          Boolean(listingData.description.summary.trim()) &&
          listingData.pricing.basePrice > 0;
        
        // Validation spécifique selon catégorie
        let basicsValid = false;
        if (listingData.propertyType.category === 'house') {
          basicsValid = Boolean(
            listingData.basics.maxGuests > 0 &&
            listingData.basics.beds > 0 &&
            listingData.basics.size > 0
          );
        } else if (listingData.propertyType.category === 'office') {
          basicsValid = Boolean(
            listingData.basics.employees > 0 &&
            listingData.basics.size > 0
          );
        } else if (listingData.propertyType.category === 'event') {
          basicsValid = Boolean(
            listingData.basics.eventCapacity > 0 &&
            listingData.basics.size > 0
          );
        }
        
        isValid = allStepsValid && basicsValid;
        console.log('📋 Validation étape 9 (Review):', { 
          allStepsValid, 
          basicsValid, 
          isValid 
        })
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
      
      // Afficher un toast d'erreur si validation échoue
      if (!stepValidation.isValid && isClient) {
        toast.error(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Champs requis manquants</span>
            </div>
            <p className="text-sm">
              {currentStep === 0 && "Veuillez remplir tous vos coordonnées"}
              {currentStep === 1 && "Veuillez sélectionner un type de propriété"}
              {currentStep === 2 && "Veuillez renseigner la ville et l'adresse"}
              {currentStep === 3 && "Veuillez remplir les informations de base"}
              {currentStep === 4 && "Veuillez sélectionner au moins une commodité"}
              {currentStep === 5 && "Veuillez ajouter au moins une photo"}
              {currentStep === 6 && "Le titre doit faire au moins 10 caractères"}
              {currentStep === 7 && "Le résumé doit faire au moins 50 caractères"}
              {currentStep === 8 && "Veuillez définir un prix de base"}
              {currentStep === 9 && "Veuillez vérifier toutes les informations"}
            </p>
          </div>,
          {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            },
          }
        )
      }
      
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
    
    // Afficher un toast de confirmation
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Annonce sauvegardée</p>
              <p className="mt-1 text-sm text-gray-500">Votre brouillon a été enregistré. Vous pouvez le reprendre plus tard.</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (isClient && typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('draft_listing', JSON.stringify(listingData));
                setTimeout(() => {
                  window.location.href = '/';
                }, 500);
              }
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            OK
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  }

  // Fonction pour publier avec toast personnalisé
  const handlePublish = async () => {
    console.log('🚀 HANDLEPUBLISH - Début')
    
    if (stepValidation.isLoading) {
      console.log('❌ Publication bloquée: déjà en cours de chargement')
      return
    }

    setStepValidation(prev => ({ ...prev, isLoading: true }))
    setPublishError(null)

    // Toast de chargement
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span>Publication en cours...</span>
      </div>,
      {
        duration: Infinity,
        style: {
          background: '#F0F9FF',
          color: '#0369A1',
          border: '1px solid #BAE6FD',
        },
      }
    )

    try {
      const formData = new FormData()

      const prismaData = {
        onboarding: listingData.owner,

        housingType: {
          category: listingData.propertyType.category.toUpperCase(),
          subType: listingData.propertyType.subType,
          privacy: listingData.propertyType.privacy.toUpperCase()
        },

        location: listingData.location,
        basics: listingData.basics,
        amenities: listingData.amenities,
        title: listingData.title,
        description: listingData.description,

        price: {
          basePrice: Number(listingData.pricing.basePrice),
          currency: listingData.pricing.currency,
          weeklyDiscount: Number(listingData.pricing.weeklyDiscount),
          monthlyDiscount: Number(listingData.pricing.monthlyDiscount),
          cleaningFee: Number(listingData.pricing.cleaningFee),
          extraGuestFee: Number(listingData.pricing.extraGuestFee),
          securityDeposit: Number(listingData.pricing.securityDeposit)
        },

        rules: {
          checkInTime: listingData.rules.checkInTime,
          checkOutTime: listingData.rules.checkOutTime,
          childrenAllowed: listingData.rules.childrenAllowed
        }
      }

      console.log('📋 Données préparées:', prismaData)
      console.log('📸 Nombre de photos:', listingData.photos.length)
      
      // ✅ JSON part
      formData.append("data", JSON.stringify(prismaData))

      // ✅ files part
      listingData.photos.forEach((photo, index) => {
        if (photo.file) {
          console.log(`📤 Ajout photo ${index + 1}:`, photo.file.name, photo.file.type, photo.file.size)
          formData.append("photos", photo.file)
        }
      })

      console.log('📤 Envoi à /api/publish...')
      
      const response = await fetch("/api/publish", {
        method: "POST",
        body: formData
      })

      console.log('📊 Statut de la réponse:', response.status)
      console.log('📊 Headers:', response.headers)
      
      const result = await response.json()
      console.log('📦 Réponse JSON:', result)

      if (!response.ok) {
        console.error('❌ Erreur API:', result.error)
        throw new Error(result.error || 'Erreur lors de la publication')
      }

      // Toast de succès
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold">Publication réussie !</span>
          </div>
          <p className="text-sm text-green-600">Votre annonce est maintenant visible sur ImmoBenin.</p>
        </div>,
        {
          id: loadingToast,
          duration: 5000,
          style: {
            background: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
          },
          iconTheme: {
            primary: '#16A34A',
            secondary: '#FFFFFF',
          }
        }
      )

      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = "/?published=true"
      }, 2000)

    } catch (e: any) {
      console.error('❌ Erreur complète:', e)
      setPublishError(e.message)
      
      // Toast d'erreur
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="font-semibold">Erreur de publication</span>
          </div>
          <p className="text-sm text-red-600">{e.message || "Une erreur est survenue. Veuillez réessayer."}</p>
        </div>,
        {
          id: loadingToast,
          duration: 7000,
          style: {
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
        }
      )
    } finally {
      setStepValidation(prev => ({ ...prev, isLoading: false }))
      console.log('🏁 handlePublish terminé')
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
    <>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 5000,
          success: {
            duration: 5000,
          },
          error: {
            duration: 7000,
          },
        }}
        containerStyle={{
          top: 80,
        }}
      />
      
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-8">
            <div className="h-16 flex items-center justify-between">
              {/* Logo avec Link */}
              <Link 
                href="/" 
                className="flex items-center gap-2 cursor-pointer group"
                aria-label="Accueil - Retour à la page d'accueil"
              >
                <div className="text-brand group-hover:scale-110 transition-transform duration-300">
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 32 32" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M16 2C16 2 3 10 3 18C3 24 8 29 16 31C24 29 29 24 29 18C29 10 16 2 16 2ZM16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19Z" />
                    <path d="M16 6L24 13V24H8V13L16 6Z" fill="white" fillOpacity="0.3"/>
                  </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand transition-colors">
                  ImmoBenin
                </span>
              </Link>
              
              {/* Bouton sauvegarder */}
              <button 
                onClick={handleSaveAndExit}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sauvegarder et quitter
              </button>
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
    </>
  )
}