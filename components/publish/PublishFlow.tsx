// components/publish/PublishFlow.tsx
"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'

// Import des étapes
import { OnboardingStep } from './steps/OnboardingStep'
import { HousingTypeStep } from './steps/HousingTypeStep'
import { LocationStep } from './steps/LocationStep'
import { BasicsStep, type BasicsData } from './steps/BasicsStep'
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
    maxGuests: number
    bedrooms: number
    beds: number
    bathrooms: number
    privateEntrance: boolean
    
    // Pour bureau
    employees: number
    offices: number
    meetingRooms: number
    workstations: number
    hasReception: boolean
    
    // Pour événement
    eventCapacity: number
    kitchenAvailable: boolean
    parkingSpots: number
    wheelchairAccessible: boolean
    hasStage: boolean
    hasSoundSystem: boolean
    hasProjector: boolean
    hasCatering: boolean
    minBookingHours: number
    
    // Commun
    size: number
    floors: number
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
  const [hasDraftRestored, setHasDraftRestored] = useState(false)
  
  // Références persistantes avec useRef
  const draftToastShownRef = useRef(false)
  const saveToastShownRef = useRef(false)
  const errorToastShownRef = useRef<string>('')
  const currentToastIdRef = useRef<string>('')

  // LOG INITIAL
  console.log('🚀 PUBLISHFLOW INITIALISÉ')

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
      employees: 0,
      offices: 0,
      meetingRooms: 0,
      workstations: 0,
      hasReception: false,
      eventCapacity: 0,
      kitchenAvailable: false,
      parkingSpots: 0,
      wheelchairAccessible: false,
      hasStage: false,
      hasSoundSystem: false,
      hasProjector: false,
      hasCatering: false,
      minBookingHours: 0,
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

  // Charger le brouillon au démarrage
  useEffect(() => {
    console.log('🔄 useEffect initial - chargement du brouillon')
    setIsClient(true)
    
    const loadDraft = () => {
      try {
        const draft = localStorage.getItem('draft_listing')
        if (draft) {
          const parsedDraft = JSON.parse(draft)
          
          // Fonction pour fusionner les données de basics
          const mergeBasics = (savedBasics: any, defaultBasics: ListingData['basics']) => {
            if (!savedBasics) return defaultBasics
            
            return {
              ...defaultBasics,
              ...savedBasics,
              // S'assurer que tous les champs numériques sont des nombres valides
              maxGuests: Number(savedBasics.maxGuests) || 0,
              bedrooms: Number(savedBasics.bedrooms) || 0,
              beds: Number(savedBasics.beds) || 0,
              bathrooms: Number(savedBasics.bathrooms) || 0,
              size: Number(savedBasics.size) || 0,
              floors: Number(savedBasics.floors) || 0,
              employees: Number(savedBasics.employees) || 0,
              offices: Number(savedBasics.offices) || 0,
              meetingRooms: Number(savedBasics.meetingRooms) || 0,
              workstations: Number(savedBasics.workstations) || 0,
              eventCapacity: Number(savedBasics.eventCapacity) || 0,
              parkingSpots: Number(savedBasics.parkingSpots) || 0,
              minBookingHours: Number(savedBasics.minBookingHours) || 0,
              // Champs booléens
              privateEntrance: Boolean(savedBasics.privateEntrance),
              hasReception: Boolean(savedBasics.hasReception),
              kitchenAvailable: Boolean(savedBasics.kitchenAvailable),
              wheelchairAccessible: Boolean(savedBasics.wheelchairAccessible),
              hasStage: Boolean(savedBasics.hasStage),
              hasSoundSystem: Boolean(savedBasics.hasSoundSystem),
              hasProjector: Boolean(savedBasics.hasProjector),
              hasCatering: Boolean(savedBasics.hasCatering),
            }
          }
          
          // Charger les données du brouillon
          setListingData(prev => ({
            ...prev,
            ...parsedDraft,
            basics: mergeBasics(parsedDraft.basics, prev.basics)
          }))
          
          // Charger l'étape sauvegardée
          const savedStep = localStorage.getItem('draft_current_step')
          if (savedStep) {
            const step = parseInt(savedStep, 10)
            if (!isNaN(step) && step >= 0 && step <= 9) {
              setCurrentStep(step)
            }
          }
          
          setHasDraftRestored(true)
          console.log('📂 Brouillon restauré, étape:', savedStep)
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement du brouillon:', error)
      }
    }
    
    loadDraft()
    
    const timer = setTimeout(() => {
      console.log('⏱️ Validation initiale après timeout')
      validateCurrentStep()
    }, 100)
    
    return () => {
      console.log('🧹 Cleanup timeout initial')
      clearTimeout(timer)
    }
  }, [])

  // Afficher le toast de brouillon restauré - UNE SEULE FOIS
  useEffect(() => {
    if (isClient && hasDraftRestored && !draftToastShownRef.current) {
      console.log('🎯 Afficher toast de brouillon restauré')
      
      // Fonction pour afficher le toast
      const showDraftToast = () => {
        // Vérifier si un toast est déjà affiché
        const existingToast = document.querySelector('[data-draft-restored="true"]')
        if (existingToast) {
          console.log('⚠️ Toast draft déjà affiché, on ignore')
          return
        }
        
        draftToastShownRef.current = true
        
        const toastId = toast.custom((t) => {
          // Stocker l'ID du toast
          currentToastIdRef.current = toastId
          
          return (
            <div 
              data-draft-restored="true"
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                max-w-md w-full bg-blue-50 shadow-lg rounded-lg pointer-events-auto 
                flex flex-col ring-1 ring-blue-200 border-l-4 border-blue-500`}
            >
              <div className="flex-1 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-blue-900">Brouillon restauré</p>
                    <p className="mt-1 text-sm text-blue-700">
                      Vous avez un brouillon enregistré. Continuez là où vous vous êtes arrêté.
                    </p>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100">
                        Étape {currentStep + 1}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-blue-200 divide-x divide-blue-200">
                <button
                  onClick={() => {
                    toast.dismiss(toastId)
                  }}
                  className="flex-1 border border-transparent rounded-bl-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Rester
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(toastId)
                    // Effacer le brouillon si l'utilisateur préfère recommencer
                    localStorage.removeItem('draft_listing')
                    localStorage.removeItem('draft_current_step')
                    localStorage.removeItem('draft_saved_at')
                    // Réinitialiser les données pour recommencer
                    setListingData({
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
                        employees: 0,
                        offices: 0,
                        meetingRooms: 0,
                        workstations: 0,
                        hasReception: false,
                        eventCapacity: 0,
                        kitchenAvailable: false,
                        parkingSpots: 0,
                        wheelchairAccessible: false,
                        hasStage: false,
                        hasSoundSystem: false,
                        hasProjector: false,
                        hasCatering: false,
                        minBookingHours: 0,
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
                    setCurrentStep(0)
                    setHasDraftRestored(false)
                    draftToastShownRef.current = false // Réinitialiser pour éviter les problèmes futurs
                    
                    toast.success(
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Brouillon effacé. Commencez une nouvelle annonce.</span>
                      </div>,
                      { duration: 3000 }
                    )
                  }}
                  className="flex-1 border border-transparent rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Effacer
                </button>
              </div>
            </div>
          )
        }, {
          duration: 8000,
          position: 'top-center',
          onDismiss: () => {
            // Nettoyer quand le toast est fermé
            draftToastShownRef.current = false
            currentToastIdRef.current = ''
          }
        })
      }
      
      // Petit délai pour s'assurer que tout est chargé
      setTimeout(showDraftToast, 500)
    }
  }, [isClient, hasDraftRestored])

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
          telephone.trim().length >= 8 &&
          email.trim().length > 0 &&
          email.includes('@') &&
          email.includes('.') &&
          nom.trim().length >= 2
        )
        break

      case 1: // HousingTypeStep
        isValid = Boolean(
          listingData.propertyType.category && 
          listingData.propertyType.subType.trim() && 
          listingData.propertyType.subType.trim().length > 0 &&
          listingData.propertyType.privacy
        )
        break

      case 2: // LocationStep
        isValid = Boolean(
          listingData.location.city.trim() && 
          listingData.location.city.trim().length > 0 &&
          listingData.location.address.trim() && 
          listingData.location.address.trim().length > 0
        )
        break

      case 3: // BasicsStep
        if (listingData.propertyType.category === 'house') {
          isValid = Boolean(
            listingData.basics.maxGuests > 0 &&
            listingData.basics.beds > 0 &&
            listingData.basics.size > 0
          )
        } else if (listingData.propertyType.category === 'office') {
          isValid = Boolean(
            listingData.basics.employees > 0 &&
            listingData.basics.size > 0
          )
        } else if (listingData.propertyType.category === 'event') {
          isValid = Boolean(
            listingData.basics.eventCapacity > 0 &&
            listingData.basics.size > 0
          )
        }
        break

      case 4: // AmenitiesStep
        isValid = listingData.amenities.length > 0
        break

      case 5: // PhotosStep
        isValid = listingData.photos.length >= 1
        break

      case 6: // TitleStep
        isValid = Boolean(
          listingData.title.trim() && 
          listingData.title.trim().length >= 10
        )
        break

      case 7: // DescriptionStep
        isValid = Boolean(
          listingData.description.summary.trim() && 
          listingData.description.summary.trim().length >= 50
        )
        break

      case 8: // PriceStep
        isValid = Boolean(
          listingData.pricing.basePrice && 
          listingData.pricing.basePrice > 0
        )
        break

      case 9: // ReviewStep
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
        break

      default:
        isValid = false
    }

    console.log(`✅ Résultat validation étape ${currentStep}:`, isValid)
    setStepValidation(prev => ({ ...prev, isValid }))
    return isValid
  }, [currentStep, listingData])

  // Mise à jour des données
  const updateData = useCallback(<K extends keyof ListingData>(section: K, data: ListingData[K]) => {
    console.log(`📝 UPDATE data - section: ${section}`)
    setListingData(prev => {
      const newData = {
        ...prev,
        [section]: data
      }
      
      // Sauvegarder automatiquement dans le brouillon
      if (isClient) {
        localStorage.setItem('draft_listing', JSON.stringify(newData))
        localStorage.setItem('draft_current_step', currentStep.toString())
        localStorage.setItem('draft_saved_at', new Date().toISOString())
      }
      
      return newData
    })
  }, [isClient, currentStep])

  // Mise à jour spécifique pour les basics (qui nécessite un traitement spécial)
  const updateBasicsData = useCallback((data: BasicsData) => {
    console.log('📝 UPDATE basics data')
    setListingData(prev => {
      // S'assurer que tous les champs sont présents
      const newBasicsData: ListingData['basics'] = {
        ...prev.basics,
        // Champs communs
        size: data.size || 0,
        floors: data.floors || 0,
        // Champs pour maison
        maxGuests: data.maxGuests || 0,
        bedrooms: data.bedrooms || 0,
        beds: data.beds || 0,
        bathrooms: data.bathrooms || 0,
        privateEntrance: data.privateEntrance || false,
        // Champs pour bureau
        employees: data.employees || 0,
        offices: data.offices || 0,
        meetingRooms: data.meetingRooms || 0,
        workstations: data.workstations || 0,
        hasReception: data.hasReception || false,
        // Champs pour événement
        eventCapacity: data.eventCapacity || 0,
        kitchenAvailable: data.kitchenAvailable || false,
        parkingSpots: data.parkingSpots || 0,
        wheelchairAccessible: data.wheelchairAccessible || false,
        hasStage: data.hasStage || false,
        hasSoundSystem: data.hasSoundSystem || false,
        hasProjector: data.hasProjector || false,
        hasCatering: data.hasCatering || false,
        minBookingHours: data.minBookingHours || 0,
      }
      
      const newData = {
        ...prev,
        basics: newBasicsData
      }
      
      // Sauvegarder automatiquement dans le brouillon
      if (isClient) {
        localStorage.setItem('draft_listing', JSON.stringify(newData))
        localStorage.setItem('draft_current_step', currentStep.toString())
        localStorage.setItem('draft_saved_at', new Date().toISOString())
      }
      
      return newData
    })
  }, [isClient, currentStep])

  // Sauvegarder automatiquement quand l'étape change
  useEffect(() => {
    if (isClient && hasDraftRestored) {
      localStorage.setItem('draft_current_step', currentStep.toString())
      localStorage.setItem('draft_saved_at', new Date().toISOString())
    }
  }, [currentStep, isClient, hasDraftRestored])

  // Valider après chaque mise à jour de données
  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        validateCurrentStep()
      }, 50)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [listingData, isClient, validateCurrentStep])

  // Navigation
  const nextStep = async () => {
    console.log('➡️ NEXTSTEP appelé - étape actuelle:', currentStep)
    
    if (!stepValidation.isValid || stepValidation.isLoading) {
      // Afficher un toast d'erreur avec prévention des doublons
      if (!stepValidation.isValid && isClient) {
        const errorKey = `error-step-${currentStep}`
        
        // Vérifier si ce toast d'erreur est déjà affiché
        if (errorToastShownRef.current === errorKey) {
          console.log('⚠️ Toast d\'erreur déjà affiché pour cette étape, on ignore')
          return
        }
        
        // Vérifier aussi dans le DOM
        const existingErrorToast = document.querySelector(`[data-error-step="${currentStep}"]`)
        if (existingErrorToast) {
          console.log('⚠️ Toast d\'erreur déjà dans le DOM, on ignore')
          errorToastShownRef.current = errorKey
          return
        }
        
        // Marquer ce toast comme affiché
        errorToastShownRef.current = errorKey
        
        const errorMessages = {
          0: "Veuillez remplir tous vos coordonnées",
          1: "Veuillez sélectionner un type de propriété",
          2: "Veuillez renseigner la ville et l'adresse",
          3: "Veuillez remplir les informations de base",
          4: "Veuillez sélectionner au moins une commodité",
          5: "Veuillez ajouter au moins une photo",
          6: "Le titre doit faire au moins 10 caractères",
          7: "Le résumé doit faire au moins 50 caractères",
          8: "Veuillez définir un prix de base",
          9: "Veuillez vérifier toutes les informations"
        }
        
        const toastId = toast.error(
          (t) => (
            <div 
              data-error-step={currentStep}
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex flex-col gap-1`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Champs requis manquants</span>
              </div>
              <p className="text-sm">
                {errorMessages[currentStep as keyof typeof errorMessages]}
              </p>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            },
            id: errorKey, // Utiliser l'errorKey comme ID unique
            onDismiss: () => {
              // Quand le toast est fermé, réinitialiser le ref
              errorToastShownRef.current = ''
            }
          }
        )
      }
      return
    }
    
    // Réinitialiser le ref d'erreur quand on passe à l'étape suivante
    errorToastShownRef.current = ''
    
    setStepValidation(prev => ({ ...prev, isLoading: true }))
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (currentStep < 9) {
      if (isClient) {
        window.scrollTo(0, 0)
      }
      setCurrentStep(prev => prev + 1)
      setStepValidation(prev => ({ ...prev, isLoading: false }))
    }
  }

  const prevStep = () => {
    if (currentStep > 0 && !stepValidation.isLoading) {
      if (isClient) {
        window.scrollTo(0, 0)
      }
      setCurrentStep(prev => prev - 1)
    }
  }

  // Fonction pour sauvegarder et quitter
  const handleSaveAndExit = () => {
    console.log('💾 SAVE AND EXIT appelé')
    
    // Vérifier si un toast save est déjà affiché
    const existingSaveToast = document.querySelector('[data-save-exit="true"]')
    if (existingSaveToast) {
      console.log('⚠️ Toast save déjà affiché, on ignore')
      return
    }
    
    if (saveToastShownRef.current) {
      console.log('⚠️ Toast déjà en mémoire, on ignore')
      return
    }
    
    saveToastShownRef.current = true
    
    const toastId = toast.custom((t) => {
      currentToastIdRef.current = toastId
      
      return (
        <div 
          data-save-exit="true"
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-green-50 shadow-lg rounded-lg pointer-events-auto 
            flex flex-col ring-1 ring-green-200 border-l-4 border-green-500`}
        >
          <div className="flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-green-900">Brouillon sauvegardé</p>
                <p className="mt-1 text-sm text-green-700">
                  Votre annonce a été sauvegardée. Vous pourrez la reprendre plus tard.
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100">
                    Étape {currentStep + 1}/10 sauvegardée
                  </span>
                  <span className="text-xs opacity-75">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t border-green-200 divide-x divide-green-200">
            <button
              onClick={() => {
                toast.dismiss(toastId)
                saveToastShownRef.current = false
                currentToastIdRef.current = ''
              }}
              className="flex-1 border border-transparent rounded-bl-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Rester
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId)
                saveToastShownRef.current = false
                currentToastIdRef.current = ''
                
                // Sauvegarder dans localStorage
                localStorage.setItem('draft_listing', JSON.stringify(listingData))
                localStorage.setItem('draft_current_step', currentStep.toString())
                localStorage.setItem('draft_saved_at', new Date().toISOString())
                
                // Afficher un message de confirmation supplémentaire
                toast.success(
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Redirection vers l'accueil...</span>
                  </div>,
                  { duration: 2000 }
                )
                
                // Redirection différée
                setTimeout(() => {
                  window.location.href = '/'
                }, 1500)
              }}
              className="flex-1 border border-transparent rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-green-700 hover:text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              OK
            </button>
          </div>
        </div>
      )
    }, {
      duration: 10000,
      position: 'top-center',
      onDismiss: () => {
        saveToastShownRef.current = false
        currentToastIdRef.current = ''
      }
    })
  }

  // Fonction pour publier
  const handlePublish = async () => {
    console.log('🚀 HANDLEPUBLISH - Début')
    
    if (stepValidation.isLoading) {
      return
    }

    setStepValidation(prev => ({ ...prev, isLoading: true }))
    setPublishError(null)

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

      formData.append("data", JSON.stringify(prismaData))

      listingData.photos.forEach((photo) => {
        if (photo.file) {
          formData.append("photos", photo.file)
        }
      })

      const response = await fetch("/api/publish", {
        method: "POST",
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la publication')
      }

      // Effacer le brouillon après publication réussie
      localStorage.removeItem('draft_listing')
      localStorage.removeItem('draft_current_step')
      localStorage.removeItem('draft_saved_at')
      
      // Réinitialiser les refs
      draftToastShownRef.current = false
      saveToastShownRef.current = false
      errorToastShownRef.current = ''

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
        }
      )

      setTimeout(() => {
        window.location.href = "/?published=true"
      }, 2000)

    } catch (e: any) {
      console.error('❌ Erreur:', e)
      setPublishError(e.message)
      
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
        }
      )
    } finally {
      setStepValidation(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Rendu de l'étape actuelle
  const renderStep = () => {
    const { propertyType } = listingData
    
    switch (currentStep) {
      case 0:
        return (
          <OnboardingStep
            key="onboarding"
            data={listingData.owner}
            onUpdate={(data) => updateData('owner', data)}
            onNext={nextStep}
          />
        )
      case 1:
        return (
          <HousingTypeStep
            key="housing-type"
            data={listingData.propertyType}
            onUpdate={(data) => updateData('propertyType', data)}
            onNext={nextStep}
          />
        )
      case 2:
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
        return (
          <BasicsStep
            key="basics"
            data={listingData.basics}
            propertyCategory={propertyType.category}
            onUpdate={updateBasicsData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
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
        return (
          <ReviewStep
            key="review"
            data={listingData}
            onEdit={(stepNumber) => {
              setCurrentStep(stepNumber)
            }}
            onSubmit={handlePublish}
            onBack={prevStep}
            isLoading={stepValidation.isLoading}
            error={publishError}
          />
        )
      default:
        return null
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = (currentStep / 9) * 100

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
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M50 5L15 40V70C15 75 20 80 50 95C80 80 85 75 85 70V40L50 5Z" 
                      fill="#FF385C" 
                    />
                    <circle cx="50" cy="55" r="12" fill="white" />
                    <rect x="44" y="24" width="12" height="10" fill="white" />
                    <line x1="50" y1="24" x2="50" y2="34" stroke="#FF385C" strokeWidth="1.5" />
                    <line x1="44" y1="29" x2="56" y2="29" stroke="#FF385C" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand transition-colors">
                  ImmoBenin
                </span>
              </Link>
              
              {/* Bouton sauvegarder uniquement */}
              <button 
                onClick={handleSaveAndExit}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
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
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-brand -translate-y-1/2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
              
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