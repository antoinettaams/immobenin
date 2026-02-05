// components/publish/steps/OnboardingStep.tsx
"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  const [phoneDigits, setPhoneDigits] = useState('') // Stocke uniquement les 8 chiffres
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Initialisation depuis les props
  useEffect(() => {
    if (data.telephone) {
      // Extraire uniquement les 8 chiffres du numéro béninois
      const digitsOnly = data.telephone.replace(/\D/g, '')
      const beninDigits = digitsOnly.slice(-8) // Prend les 8 derniers chiffres
      setPhoneDigits(beninDigits)
      
      // S'assurer que formData a le bon format
      if (beninDigits.length === 8 && !data.telephone.startsWith('+229')) {
        const updatedData = {
          ...formData,
          telephone: '+229' + beninDigits
        }
        setFormData(updatedData)
        onUpdate(updatedData)
      }
    }
  }, [data.telephone])

  // Formater l'affichage du téléphone
  const formatPhoneDisplay = useCallback((digits: string): string => {
    const cleaned = digits.replace(/\D/g, '').slice(0, 8)
    
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`
  }, [])

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

  // Gestion du changement de téléphone avec nettoyage automatique
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // 1. Nettoyer le texte collé/autocomplété
    value = value.replace('+229', '')
    value = value.replace('229', '')
    value = value.replace('+', '')
    
    // 2. Ne garder que les chiffres
    const digitsOnly = value.replace(/\D/g, '')
    
    // 3. Limiter à 8 chiffres max
    const limitedDigits = digitsOnly.slice(0, 8)
    
    // 4. Mettre à jour l'état local
    setPhoneDigits(limitedDigits)
    
    // 5. Mettre à jour formData si le numéro est complet
    if (limitedDigits.length === 8) {
      const updatedData = {
        ...formData,
        telephone: '+229' + limitedDigits
      }
      setFormData(updatedData)
      onUpdate(updatedData)
    } else if (limitedDigits.length === 0) {
      // Si vide, on réinitialise
      const updatedData = {
        ...formData,
        telephone: ''
      }
      setFormData(updatedData)
      onUpdate(updatedData)
    } else {
      // Numéro incomplet, on stocke quand même pour ne pas perdre la saisie
      const updatedData = {
        ...formData,
        telephone: '+229' + limitedDigits
      }
      setFormData(updatedData)
      onUpdate(updatedData)
    }
    
    // 6. Effacer l'erreur si présente
    if (errors.telephone) {
      const newErrors = { ...errors }
      delete newErrors.telephone
      setErrors(newErrors)
    }
  }

  // Gestion du collage (paste)
  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    
    // Nettoyer le texte collé
    let cleaned = pastedText
      .replace('+229', '')
      .replace('229', '')
      .replace('+', '')
      .replace(/\D/g, '')
      .slice(0, 8)
    
    // Simuler un changement d'input
    const fakeEvent = {
      target: { value: cleaned }
    } as React.ChangeEvent<HTMLInputElement>
    
    handlePhoneInputChange(fakeEvent)
  }

  // Gestion de la touche Retour (Backspace)
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Si l'utilisateur essaie de supprimer le +229, on l'empêche
    if (e.key === 'Backspace' && phoneDigits.length === 0) {
      e.preventDefault()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OnboardingData> = {}
    
    // Validation téléphone
    const phoneDigitsOnly = phoneDigits.replace(/\D/g, '')
    if (!phoneDigitsOnly) {
      newErrors.telephone = 'Le numéro de téléphone est requis'
    } else if (phoneDigitsOnly.length !== 8) {
      newErrors.telephone = 'Numéro béninois valide requis (8 chiffres)'
    } else if (!/^[679][0-9]{7}$/.test(phoneDigitsOnly)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Validation finale
      const phoneDigitsOnly = phoneDigits.replace(/\D/g, '')
      if (phoneDigitsOnly.length !== 8) {
        throw new Error('Numéro de téléphone incomplet')
      }
      
      // Format final
      const finalPhone = '+229' + phoneDigitsOnly
      const finalData = {
        ...formData,
        telephone: finalPhone
      }
      
      console.log('✅ Données finales:', finalData)
      
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

  const canContinue = phoneDigits.replace(/\D/g, '').length === 8 && 
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
          <div className="relative">
            {/* Code pays fixe et non cliquable */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 flex items-center gap-2 pointer-events-none">
              <span className="text-lg">🇧🇯</span>
              <span className="font-medium">+229</span>
            </div>
            
            {/* Input séparé pour les 8 chiffres */}
            <input
              ref={phoneInputRef}
              type="tel"
              value={formatPhoneDisplay(phoneDigits)}
              onChange={handlePhoneInputChange}
              onPaste={handlePhonePaste}
              onKeyDown={handlePhoneKeyDown}
              className={`w-full pl-20 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none ${
                errors.telephone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="53 99 83 59"
              disabled={isLoading}
              maxLength={11} // 8 chiffres + 3 espaces
              inputMode="numeric"
              autoComplete="tel-national" // Empêche l'autocomplétion avec le code pays
            />
          </div>
          {errors.telephone && (
            <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Saisissez uniquement les 8 chiffres de votre numéro béninois
          </p>
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

        {/* Bouton continuer */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!canContinue || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              canContinue && !isLoading
                ? 'bg-brand text-white hover:bg-brand/90'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Vérification...
              </span>
            ) : (
              'Continuer'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}