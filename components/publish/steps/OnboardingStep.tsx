// components/publish/steps/OnboardingStep.tsx
"use client"
import React, { useState } from 'react'
import { Phone, Mail, User, Shield } from 'lucide-react'

interface OnboardingData {
  telephone: string
  email: string
  nom: string
}

interface OnboardingStepProps {
  data: OnboardingData
  onUpdate: (data: OnboardingData) => void
  onNext: () => void
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [formData, setFormData] = useState<OnboardingData>(data)
  const [errors, setErrors] = useState<Partial<OnboardingData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [phoneInput, setPhoneInput] = useState('') // Stockage séparé pour l'affichage

  // Initialisation depuis les props
  React.useEffect(() => {
    if (data.telephone) {
      // Extraire uniquement les chiffres sans le préfixe +229
      const digitsOnly = data.telephone.replace(/\D/g, '')
      if (digitsOnly.startsWith('229')) {
        setPhoneInput(digitsOnly.slice(3)) // Enlève le 229
      } else {
        setPhoneInput(digitsOnly)
      }
    }
  }, [data.telephone])

  const handleChange = (field: keyof OnboardingData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    
    // Validation en temps réel
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
    
    onUpdate(updated)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OnboardingData> = {}
    
    // Validation téléphone
    const phoneDigits = phoneInput.replace(/\D/g, '')
    if (!phoneDigits) {
      newErrors.telephone = 'Le numéro de téléphone est requis'
    } else if (phoneDigits.length !== 8) {
      newErrors.telephone = 'Numéro béninois valide requis (8 chiffres)'
    } else if (!/^[679][0-9]{7}$/.test(phoneDigits)) {
      newErrors.telephone = 'Numéro béninois invalide (doit commencer par 6, 7 ou 9)'
    }
    
    // Validation email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    
    // Validation nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Nom trop court'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhoneDisplay = (value: string): string => {
    // Garde uniquement les chiffres
    const digits = value.replace(/\D/g, '')
    
    // Limite à 8 chiffres max
    const limited = digits.slice(0, 8)
    
    // Format pour l'affichage: XX XX XX XX
    if (limited.length <= 2) return limited
    if (limited.length <= 4) return `${limited.slice(0, 2)} ${limited.slice(2)}`
    if (limited.length <= 6) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`
  }

  const handlePhoneInputChange = (value: string) => {
    // Mise à jour de l'affichage
    const formattedDisplay = formatPhoneDisplay(value)
    setPhoneInput(formattedDisplay)
    
    // Extraire les chiffres uniquement
    const digits = value.replace(/\D/g, '').slice(0, 8)
    
    // Stocker dans formData avec le préfixe +229
    if (digits.length === 8) {
      const fullNumber = `+229${digits}`
      handleChange('telephone', fullNumber)
    } else {
      // Si le numéro n'est pas complet, on stocke quand même
      handleChange('telephone', digits ? `+229${digits}` : '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Validation finale du numéro
      const phoneDigits = phoneInput.replace(/\D/g, '')
      if (phoneDigits.length !== 8) {
        throw new Error('Numéro de téléphone incomplet')
      }
      
      // S'assurer que le format est correct
      const finalPhone = `+229${phoneDigits}`
      const finalData = {
        ...formData,
        telephone: finalPhone
      }
      
      // Sauvegarde dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingData', JSON.stringify(finalData))
      }
      
      console.log('✅ Données finales:', finalData)
      
      // Mettre à jour les données parentes avec le format final
      onUpdate(finalData)
      onNext()
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      setErrors({
        telephone: 'Veuillez vérifier votre numéro de téléphone'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canContinue = phoneInput.replace(/\D/g, '').length === 8 && 
                     formData.email && 
                     formData.nom.trim().length >= 2

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
      {/* En-tête */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-full mb-4">
          <User className="w-8 h-8 text-brand" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Vos informations de contact
        </h1>
        <p className="text-gray-600">
          Ces informations seront utilisées pour les réservations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom complet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Nom complet
            </div>
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none ${
              errors.nom ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: Jean Dupont"
            disabled={isLoading}
          />
          {errors.nom && (
            <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    <div className="flex items-center gap-2">
      <Phone className="w-4 h-4 text-gray-500" />
      Téléphone
    </div>
  </label>

  <div className="flex">
    
    {/* Bloc indicatif */}
    <div className="flex items-center gap-2 px-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700">
      <span className="text-lg">🇧🇯</span>
      <span className="font-medium">+229</span>
    </div>

    {/* Champ numéro */}
    <input
      type="tel"
      value={phoneInput}
      onChange={(e) => handlePhoneInputChange(e.target.value)}
      placeholder="60 00 00 00"
      disabled={isLoading}
      maxLength={11}
      inputMode="numeric"
      autoComplete="off"
      pattern="[0-9]*"
      className={`w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none ${
        errors.telephone ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
    />

  </div>

  {errors.telephone && (
    <p className="text-red-500 text-sm mt-1">
      {errors.telephone}
    </p>
  )}
</div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Adresse email
            </div>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="exemple@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Informations de confidentialité */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                Vos informations sont sécurisées
              </p>
              <p className="text-xs text-blue-700">
                Votre numéro de téléphone et email ne seront partagés qu'avec les voyageurs.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  ) 
} 