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
    maxGuests: number
    bedrooms: number
    beds: number
    bathrooms: number
    privateEntrance: boolean
    employees: number
    offices: number
    meetingRooms: number
    workstations: number
    hasReception: boolean
    eventCapacity: number
    kitchenAvailable: boolean
    parkingSpots: number
    wheelchairAccessible: boolean
    hasStage: boolean
    hasSoundSystem: boolean
    hasProjector: boolean
    hasCatering: boolean
    minBookingHours: number
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
  const [userListingCount, setUserListingCount] = useState<number>(0)
  
  // AJOUT: ÉTATS POUR LES CONDITIONS
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [infoCertified, setInfoCertified] = useState(false)
  
  // Références pour éviter les doublons 
  const draftToastShownRef = useRef(false)
  const errorToastShownRef = useRef<string>('')
  const isSubmittingRef = useRef(false)

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

  // Vérifier le nombre d'annonces de l'utilisateur au démarrage
  useEffect(() => {
    const checkUserListings = async () => {
      try {
        const response = await fetch('/api/user/listings/count')
        const data = await response.json()
        
        if (data.count >= 5) {
          toast.error(
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-semibold">Limite atteinte</span>
              </div>
              <p className="text-sm">
                Vous avez atteint la limite de 5 annonces. Veuillez contacter le support pour plus d'informations.
              </p>
            </div>,
            {
              duration: 5000,
              style: {
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
              }
            }
          )
          
          setTimeout(() => {
            window.location.href = '/'
          }, 3000)
          return
        }
        
        setUserListingCount(data.count)
      } catch (error) {
        console.error('Erreur lors de la vérification des annonces:', error)
      }
    }
    
    if (isClient) {
      checkUserListings()
    }
  }, [isClient])

  // Charger le brouillon au démarrage
  useEffect(() => {
    setIsClient(true)
    
    const loadDraft = () => {
      try {
        const draft = localStorage.getItem('draft_listing')
        if (draft) {
          const parsedDraft = JSON.parse(draft)
          
          const mergeBasics = (savedBasics: any, defaultBasics: ListingData['basics']) => {
            if (!savedBasics) return defaultBasics
            
            return {
              ...defaultBasics,
              ...savedBasics,
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
          
          setListingData(prev => ({
            ...prev,
            ...parsedDraft,
            basics: mergeBasics(parsedDraft.basics, prev.basics)
          }))
          
          const savedStep = localStorage.getItem('draft_current_step')
          if (savedStep) {
            const step = parseInt(savedStep, 10)
            if (!isNaN(step) && step >= 0 && step <= 9) {
              setCurrentStep(step)
            }
          }
          
          setHasDraftRestored(true)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du brouillon:', error)
      }
    }
    
    loadDraft()
    
    const timer = setTimeout(() => {
      validateCurrentStep()
    }, 100)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Validation de chaque étape
  const validateCurrentStep = useCallback((): boolean => {
    let isValid = false

    switch (currentStep) {
      case 0:
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

      case 1:
        isValid = Boolean(
          listingData.propertyType.category && 
          listingData.propertyType.subType.trim() && 
          listingData.propertyType.subType.trim().length > 0 &&
          listingData.propertyType.privacy
        )
        break

      case 2:
        isValid = Boolean(
          listingData.location.city.trim() && 
          listingData.location.city.trim().length > 0 &&
          listingData.location.address.trim() && 
          listingData.location.address.trim().length > 0
        )
        break

      case 3:
        if (listingData.propertyType.category === 'house') {
          isValid = Boolean(
            listingData.basics.maxGuests > 0 &&
            listingData.basics.beds > 0
          )
        } else if (listingData.propertyType.category === 'office') {
          isValid = Boolean(
            listingData.basics.employees > 0
          )
        } else if (listingData.propertyType.category === 'event') {
          isValid = Boolean(
            listingData.basics.eventCapacity > 0
          )
        }
        break;

      case 4:
        isValid = listingData.amenities.length > 0
        break

      case 5:
        isValid = listingData.photos.length >= 3 
        break

      case 6:
        isValid = Boolean(
          listingData.title.trim() && 
          listingData.title.trim().length >= 10
        )
        break

      case 7:
        isValid = Boolean(
          listingData.description.summary.trim() && 
          listingData.description.summary.trim().length >= 50
        )
        break

      case 8:
        isValid = Boolean(
          listingData.pricing.basePrice && 
          listingData.pricing.basePrice > 0
        )
        break

      case 9:
        const allStepsValid = 
          Boolean(listingData.owner.telephone.trim()) &&
          Boolean(listingData.owner.email.trim()) &&
          Boolean(listingData.owner.nom.trim()) &&
          Boolean(listingData.propertyType.subType.trim()) &&
          Boolean(listingData.location.city.trim()) &&
          Boolean(listingData.location.address.trim()) &&
          listingData.photos.length >= 3 &&
          Boolean(listingData.title.trim()) &&
          Boolean(listingData.description.summary.trim()) &&
          listingData.pricing.basePrice > 0;
        
        let basicsValid = false;
        if (listingData.propertyType.category === 'house') {
          basicsValid = Boolean(
            listingData.basics.maxGuests > 0 &&
            listingData.basics.beds > 0
          );
        } else if (listingData.propertyType.category === 'office') {
          basicsValid = Boolean(
            listingData.basics.employees > 0
          );
        } else if (listingData.propertyType.category === 'event') {
          basicsValid = Boolean(
            listingData.basics.eventCapacity > 0
          );
        }

        // AJOUT: VALIDATION DES CONDITIONS
        const conditionsValid = termsAccepted && infoCertified; 
        isValid = allStepsValid && basicsValid && conditionsValid;
        break

      default:
        isValid = false
    }

    setStepValidation(prev => ({ ...prev, isValid }))
    return isValid
  }, [currentStep, listingData, termsAccepted, infoCertified])  

  // Mise à jour des données
  const updateData = useCallback(<K extends keyof ListingData>(section: K, data: ListingData[K]) => {
    setListingData(prev => {
      const newData = {
        ...prev,
        [section]: data
      }
      
      if (isClient) {
        localStorage.setItem('draft_listing', JSON.stringify(newData))
        localStorage.setItem('draft_current_step', currentStep.toString())
        localStorage.setItem('draft_saved_at', new Date().toISOString())
      }
      
      return newData
    })
  }, [isClient, currentStep])

  // Mise à jour spécifique pour les basics
  const updateBasicsData = useCallback((data: BasicsData) => {
    setListingData(prev => {
      const newBasicsData: ListingData['basics'] = {
        ...prev.basics,
        size: data.size || 0,
        floors: data.floors || 0,
        maxGuests: data.maxGuests || 0,
        bedrooms: data.bedrooms || 0,
        beds: data.beds || 0,
        bathrooms: data.bathrooms || 0,
        privateEntrance: data.privateEntrance || false,
        employees: data.employees || 0,
        offices: data.offices || 0,
        meetingRooms: data.meetingRooms || 0,
        workstations: data.workstations || 0,
        hasReception: data.hasReception || false,
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
    if (!stepValidation.isValid || stepValidation.isLoading) {
      if (!stepValidation.isValid && isClient) {
        const errorKey = `error-step-${currentStep}`
        
        if (errorToastShownRef.current === errorKey) {
          return
        }
        
        errorToastShownRef.current = errorKey
        
        const errorMessages = {
          0: "Veuillez remplir tous vos coordonnées",
          1: "Veuillez sélectionner un type de propriété",
          2: "Veuillez renseigner la ville et l'adresse",
          3: "Veuillez remplir les informations de base",
          4: "Veuillez sélectionner au moins une commodité",
          5: "Veuillez ajouter au moins 3 photos",
          6: "Le titre doit faire au moins 10 caractères",
          7: "Le résumé doit faire au moins 50 caractères",
          8: "Veuillez définir un prix de base",
          9: "Veuillez vérifier toutes les informations et accepter les conditions"
        }
        
        toast.error(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Champs requis manquants</span>
            </div>
            <p className="text-sm">
              {errorMessages[currentStep as keyof typeof errorMessages]}
            </p>
          </div>,
          {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            }
          }
        )

        setTimeout(() => {
          errorToastShownRef.current = ''
        }, 4500)
      }
      return
    }
    
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
    localStorage.setItem('draft_listing', JSON.stringify(listingData))
    localStorage.setItem('draft_current_step', currentStep.toString())
    localStorage.setItem('draft_saved_at', new Date().toISOString())
    window.location.href = '/'
  }

  // Fonction pour publier
  const handlePublish = async () => {
  console.log('🚀 HANDLEPUBLISH - Début')
  
  // DEBUG: Vérifier ce qui est dans listingData.photos
  console.log('📸 DEBUG - Photos dans listingData avant publication:');
  listingData.photos.forEach((photo, index) => {
    console.log(`  Photo ${index}:`, {
      id: photo.id,
      hasFile: !!photo.file,
      fileType: photo.file?.type,
      fileSize: photo.file?.size,
      isFileInstance: photo.file instanceof File,
      url: photo.url?.substring(0, 50) + '...',
      urlType: photo.url?.substring(0, 20)
    });
  });

  // Empêcher double soumission
  if (isSubmittingRef.current) {
    console.log('⚠️ Publication déjà en cours, ignorer')
    return
  }
  
  if (stepValidation.isLoading) {
    return
  }

  isSubmittingRef.current = true
  setStepValidation(prev => ({ ...prev, isLoading: true }))
  setPublishError(null)

  // Vérifier la limite avant publication
  try {
    const ownerEmail = listingData.owner.email
    if (ownerEmail && ownerEmail.trim() !== '') {
      const response = await fetch(`/api/user/listings/count?email=${encodeURIComponent(ownerEmail)}`)
      const data = await response.json()
      
      if (data.success && !data.canPublish) {
        toast.error(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-semibold">Limite atteinte</span>
            </div>
            <p className="text-sm">
              Vous avez déjà {data.count} annonces sur {data.limit} autorisées.
              Veuillez contacter le support pour augmenter votre limite.
            </p>
          </div>,
          {
            duration: 7000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            }
          }
        )
        isSubmittingRef.current = false
        setStepValidation(prev => ({ ...prev, isLoading: false }))
        return
      }
    }
  } catch (error) {
    console.log('Erreur vérification limite, continue:', error)
  }

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

    // === NOUVELLE SOLUTION : Gérer les photos différemment ===
    console.log('📸 Préparation des photos pour envoi:');
    
    const photosToSend = listingData.photos;
    let filesSent = 0;
    let blobsSent = 0;
    let base64Sent = 0;
    let urlsSent = 0;
    let errors = 0;

    // Créer un tableau pour suivre les promesses d'upload
    const uploadPromises: Promise<void>[] = [];

    for (let i = 0; i < photosToSend.length; i++) {
      const photo = photosToSend[i];
      const uploadPromise = (async () => {
        try {
          // CAS 1: Photo a un objet File valide (idéal)
          if (photo.file && photo.file instanceof File) {
            console.log(`📤 Photo ${i + 1}: Envoi File direct (${photo.file.name}, ${photo.file.size} bytes)`);
            formData.append("photos", photo.file);
            filesSent++;
          }
          // CAS 2: URL blob (image récemment uploadée)
          else if (photo.url && photo.url.startsWith('blob:')) {
            try {
              console.log(`📤 Photo ${i + 1}: Conversion blob en File...`);
              const response = await fetch(photo.url);
              if (!response.ok) throw new Error('Fetch failed');
              
              const blob = await response.blob();
              if (blob.size === 0) throw new Error('Blob vide');
              
              const file = new File([blob], `photo_${i + 1}.jpg`, { 
                type: blob.type || 'image/jpeg' 
              });
              
              formData.append("photos", file);
              console.log(`✅ Photo ${i + 1}: Blob converti (${blob.size} bytes)`);
              blobsSent++;
            } catch (blobError: any) {
              console.error(`❌ Photo ${i + 1} blob error:`, blobError.message);
              errors++;
            }
          }
          // CAS 3: Data URL (base64)
          else if (photo.url && photo.url.startsWith('data:')) {
            try {
              console.log(`📤 Photo ${i + 1}: Traitement base64...`);
              const base64Data = photo.url.split(',')[1];
              if (!base64Data) throw new Error('Données base64 manquantes');
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              
              for (let j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j);
              }
              
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'image/jpeg' });
              const file = new File([blob], `photo_${i + 1}.jpg`, { type: 'image/jpeg' });
              
              formData.append("photos", file);
              console.log(`✅ Photo ${i + 1}: Base64 converti (${byteArray.length} bytes)`);
              base64Sent++;
            } catch (base64Error: any) {
              console.error(`❌ Photo ${i + 1} base64 error:`, base64Error.message);
              errors++;
            }
          }
          // CAS 4: URL normale (déjà uploadée)
          else if (photo.url && (photo.url.startsWith('http') || photo.url.startsWith('https'))) {
            console.log(`📤 Photo ${i + 1}: Envoi URL directe`);
            formData.append("photos", photo.url);
            urlsSent++;
          }
          // CAS 5: Aucune donnée valide
          else {
            console.warn(`⚠️ Photo ${i + 1}: Aucune donnée valide - ignorée`);
            errors++;
          }
        } catch (error: any) {
          console.error(`❌ Photo ${i + 1} erreur générale:`, error.message);
          errors++;
        }
      })();

      uploadPromises.push(uploadPromise);
    }

    // Attendre que tous les uploads soient traités
    await Promise.all(uploadPromises);

    console.log(`📊 RÉSUMÉ PHOTOS:`);
    console.log(`✅ Files envoyés: ${filesSent}`);
    console.log(`✅ Blobs convertis: ${blobsSent}`);
    console.log(`✅ Base64 convertis: ${base64Sent}`);
    console.log(`✅ URLs directes: ${urlsSent}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log(`📤 Total envoyées: ${filesSent + blobsSent + base64Sent + urlsSent} sur ${photosToSend.length}`);

    // Si aucune photo n'a été envoyée
    if (filesSent + blobsSent + base64Sent + urlsSent === 0 && photosToSend.length > 0) {
      console.warn('⚠️ Aucune photo envoyée, tentative de récupération des Files depuis PhotosStep...');
      
      // Dernière tentative: vérifier si on peut récupérer les photos depuis PhotosStep
      // (vous devrez peut-être passer photosWithFiles en prop ou context)
    }
    // === FIN DE LA NOUVELLE SOLUTION ===

    console.log('📦 Envoi du formulaire à l\'API...');
    
    const response = await fetch("/api/publish", {
      method: "POST",
      body: formData
    })

    const result = await response.json()

    if (!response.ok) {
      if (result.error?.includes('Limite atteinte') || result.limitReached) {
        throw new Error(
          `LIMITE ATTEINTE: Vous avez déjà ${result.currentCount || 5} annonces. ` +
          `La limite est de ${result.maxLimit || 5} annonces par propriétaire.`
        )
      }
      throw new Error(result.error || 'Erreur lors de la publication')
    }

    // Effacer le brouillon après publication réussie
    localStorage.removeItem('draft_listing')
    localStorage.removeItem('draft_current_step')
    localStorage.removeItem('draft_saved_at')
    
    // Réinitialiser les refs
    draftToastShownRef.current = false
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
    
    let errorMessage = e.message
    let duration = 7000
    
    if (e.message.includes('LIMITE ATTEINTE')) {
      errorMessage = e.message.replace('LIMITE ATTEINTE: ', '')
      duration = 10000
    }
    
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
        <p className="text-sm text-red-600">{errorMessage || "Une erreur est survenue. Veuillez réessayer."}</p>
      </div>,
      {
        id: loadingToast,
        duration: duration,
      }
    )
  } finally {
    isSubmittingRef.current = false
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
            // PASSER LES ÉTATS ET SETTERS
            termsAccepted={termsAccepted}
            infoCertified={infoCertified}
            onTermsAcceptedChange={setTermsAccepted}
            onInfoCertifiedChange={setInfoCertified}
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
              
              {/* Bouton sauvegarder et quitter */}
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