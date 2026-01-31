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
    
    // Validation téléphone (Bénin)
    if (!formData.telephone) {
      newErrors.telephone = 'Le numéro de téléphone est requis'
    } else if (!/^(?:\+229|00229)?[0-9]{8}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Numéro béninois valide requis (ex: +229 60 00 00 00)'
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
      // Sauvegarde temporaire dans localStorage (pour développement)
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingData', JSON.stringify(formData))
      }
      
      console.log('✅ Données prêtes:', formData)
      onNext()
      
    } catch (error) {
      console.error('❌ Erreur:', error)
      alert('Erreur de sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Nettoie le numéro
    let cleaned = value.replace(/\D/g, '')
    
    // Si commence par 229 (indicatif Bénin)
    if (cleaned.startsWith('229')) {
      cleaned = '+' + cleaned
    } else if (cleaned.length === 8) {
      // Numéro local béninois (8 chiffres)
      cleaned = '+229 ' + cleaned.match(/.{1,2}/g)?.join(' ') || cleaned
    }
    
    return cleaned
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    handleChange('telephone', formatted)
  }

  const canContinue = formData.telephone && formData.email && formData.nom

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
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
              🇧🇯 +229
            </div>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full pl-20 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none ${
                errors.telephone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="60 00 00 00"
              disabled={isLoading}
            />
          </div>
          {errors.telephone ? (
            <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Format: +229 XX XX XX XX
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