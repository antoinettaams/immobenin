"use client"
import React, { useState, useRef, useEffect } from 'react'
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
  const [phoneInput, setPhoneInput] = useState('')
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Initialisation
  useEffect(() => {
    if (data.telephone) {
      const digitsOnly = data.telephone.replace(/\D/g, '')
      if (digitsOnly.startsWith('229')) {
        setPhoneInput(digitsOnly.slice(3))
      } else {
        setPhoneInput(digitsOnly)
      }
    }
  }, [data.telephone])

  const handleChange = (field: keyof OnboardingData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
    
    onUpdate(updated)
  }

  const handlePhoneInputChange = (rawValue: string) => {
    // Supprimer TOUT sauf les chiffres
    let cleanValue = rawValue.replace(/\D/g, '')
    
    // Limiter à 8 chiffres maximum
    cleanValue = cleanValue.slice(0, 8)
    
    // Mettre à jour l'affichage
    setPhoneInput(cleanValue)
    
    // Mettre à jour formData
    if (cleanValue.length === 8) {
      const fullNumber = `+229${cleanValue}`
      handleChange('telephone', fullNumber)
    } else {
      handleChange('telephone', cleanValue ? `+229${cleanValue}` : '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const phoneDigits = phoneInput.replace(/\D/g, '')
      if (phoneDigits.length !== 8) {
        throw new Error('Numéro de téléphone incomplet')
      }
      
      const finalPhone = `+229${phoneDigits}`
      const finalData = {
        ...formData,
        telephone: finalPhone
      }
      
      onUpdate(finalData)
      onNext()
      
    } catch (error) {
      setErrors({
        telephone: 'Veuillez vérifier votre numéro de téléphone'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OnboardingData> = {}
    
    const phoneDigits = phoneInput.replace(/\D/g, '')
    if (!phoneDigits) {
      newErrors.telephone = 'Le numéro de téléphone est requis'
    } else if (phoneDigits.length !== 8) {
      newErrors.telephone = 'Numéro béninois valide requis (8 chiffres)'
    } else if (!/^[679][0-9]{7}$/.test(phoneDigits)) {
      newErrors.telephone = 'Numéro béninois invalide (doit commencer par 6, 7 ou 9)'
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Nom trop court'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
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

        {/* CHAMP TÉLÉPHONE CORRIGÉ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Téléphone
            </div>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 flex items-center gap-2 pointer-events-none">
              <span className="text-lg">🇧🇯</span>
              <span className="font-medium">+229</span>
            </div>
            
            {/* SOLUTION: Retirer font-mono et ajouter un meilleur contrôle */}
            <input
              ref={phoneInputRef}
              type="text"
              inputMode="tel"
              value={phoneInput}
              onChange={(e) => {
                // Formatage visuel pour mobile: espace tous les 2 chiffres
                let value = e.target.value.replace(/\D/g, '')
                
                // Limiter à 8 chiffres
                value = value.slice(0, 8)
                
                setPhoneInput(value)
                
                // Mettre à jour formData
                if (value.length === 8) {
                  handleChange('telephone', `+229${value}`)
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.replace(/\D/g, '')
                if (value.length === 8) {
                  handleChange('telephone', `+229${value}`)
                }
              }}
              className={`w-full pl-20 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-lg tracking-wider ${
                errors.telephone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="60 00 00 00"
              disabled={isLoading}
              maxLength={10} // Un peu plus large pour l'espacement visuel
              pattern="[0-9]{8}"
              title="8 chiffres béninois (commençant par 6, 7 ou 9)"
            />
            
            {/* Indicateur de longueur */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {phoneInput.replace(/\D/g, '').length}/8
            </div>
          </div>
          
          {/* Afficher le numéro formaté pour le mobile */}
          <div className="mt-2">
            {phoneInput.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Numéro complet :</span>{' '}
                <span className="font-bold">
                  +229 {phoneInput.replace(/(\d{2})(?=\d)/g, '$1 ')}
                </span>
              </div>
            )}
          </div>
          
          {errors.telephone ? (
            <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Format : 8 chiffres (commence par 6, 7 ou 9)
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
        
        {/* Bouton continuer */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || phoneInput.length !== 8 || !formData.email || !formData.nom}
            className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Validation...
              </>
            ) : (
              'Continuer'
            )}
          </button>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            {phoneInput.length === 8 && formData.email && formData.nom ? (
              <span className="text-green-600">✓ Tous les champs sont valides</span>
            ) : (
              <span>Remplissez tous les champs pour continuer</span>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}