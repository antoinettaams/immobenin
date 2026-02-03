"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import { Toaster, toast } from 'react-hot-toast'; // IMPORT TOAST
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Facebook,
  Instagram, 
  Music,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { FaTiktok } from 'react-icons/fa';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires.", {
        icon: <XCircle className="w-5 h-5" />,
        style: {
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        },
      });
      setIsLoading(false);
      return;
    }

    // Toast de chargement
    const loadingToast = toast.loading(
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Envoi du message en cours...</span>
      </div>,
      {
        style: {
          background: '#F0F9FF',
          color: '#0369A1',
          border: '1px solid #BAE6FD',
        },
      }
    );

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || "Demande de contact",
        message: formData.message,
        to_email: "immobenin08@gmail.com",
        phone: "Non fourni",
        date: new Date().toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (result.status === 200) {
        // Success toast
        toast.success(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Message envoyé avec succès !</span>
            </div>
            <p className="text-sm text-green-600">Nous vous répondrons dans les plus brefs délais.</p>
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
        );

        // Réinitialiser le formulaire
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err: any) {
      console.error("Erreur EmailJS:", err);
      
      // Error toast
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">Erreur d'envoi</span>
          </div>
          <p className="text-sm">Veuillez réessayer ou nous contacter par téléphone.</p>
        </div>,
        {
          id: loadingToast,
          duration: 5000,
          style: {
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toaster Component - Place it at the root */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 5000,
          success: {
            duration: 5000,
          },
          error: {
            duration: 5000,
          },
        }}
        containerStyle={{
          top: 80,
        }}
      />
      
      <section className="relative min-h-screen pt-24 pb-20 bg-gradient-to-br from-white via-gray-50 to-red-50/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une question, un projet ou besoin d&apos;assistance ? Notre équipe est à
              votre écoute.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* GAUCHE – Infos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <Info
                  icon={Phone}
                  title="Téléphone"
                  value="+229 01 43 75 79 82"
                  subtitle="Lun - Ven: 8h - 18h"
                />
                <Info
                  icon={Mail}
                  title="Email"
                  value="immobenin08@gmail.com"
                  subtitle="Réponse sous 24h"
                />
                <Info
                  icon={MapPin}
                  title="Lieu"
                  value="Cotonou, Fidjrossè"
                  subtitle="Bénin"
                />
              </div>

              {/* Réseaux sociaux */}
              <div>
                <p className="font-semibold text-gray-900 mb-4">
                  Suivez-nous sur les réseaux
                </p>
                <div className="flex gap-4">
                  <Social 
                    icon={Facebook} 
                    href="https://www.facebook.com/profile.php?id=61587104714306"
                    label="Facebook"
                  />
                  <Social 
                    icon={Instagram} 
                    href="https://www.instagram.com/immobenin08/"
                    label="Instagram"
                  />
                  <Social 
                    icon={FaTiktok} 
                    href="https://www.tiktok.com/@immobnin?is_from_webapp=1&sender_device=pc"
                    label="TikTok"
                  />
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div className="bg-gradient-to-r from-brand/10 to-brand/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-brand" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Support WhatsApp</h3>
                    <p className="text-sm text-gray-600">Disponible H24</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/22943757982"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-brand text-white px-6 py-4 rounded-xl font-semibold hover:bg-brand-dark transition-colors w-full"
                >
                  <MessageSquare className="w-5 h-5" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </motion.div>

            {/* DROITE – Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nom complet *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom complet"
                  disabled={isLoading}
                />

                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />

                <Input
                  label="Sujet *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Objet de votre message"
                  disabled={isLoading}
                />

                <Textarea
                  label="Message *"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Décrivez votre demande..."
                  disabled={isLoading}
                  rows={5}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand-dark transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ---------- Components (inchangés) ---------- */

interface InfoProps {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle?: string;
}

const Info = ({ icon: Icon, title, value, subtitle }: InfoProps) => (
  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 hover:bg-white transition-colors">
    <div className="p-3 rounded-xl bg-brand/10 text-brand">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-semibold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  </div>
);

interface SocialProps {
  icon: React.ElementType;
  href: string;
  label: string;
}

const Social = ({ icon: Icon, href, label }: SocialProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-4 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-brand/10 hover:border-brand/20 transition-all flex-1 text-center group"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-gray-900 mx-auto group-hover:scale-110 transition-transform" />
    <span className="text-xs text-gray-600 mt-2 hidden md:block">{label}</span>
  </a>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-900">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea = ({ label, ...props }: TextareaProps) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-900">
      {label}
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);