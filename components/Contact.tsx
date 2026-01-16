"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Facebook,
  Instagram, 
  Music
} from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ajoutez ici la logique d'envoi du formulaire
  };

  return (
    <section className="relative min-h-screen pt-24 pb-20 bg-gradient-to-br from-white via-gray-50 to-red-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-bold text-brand bg-brand/10 rounded-full">
            Contact
          </span>
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
                value="+229 60 00 00 00"
                subtitle="Lun - Ven: 8h - 18h"
              />
              <Info
                icon={Mail}
                title="Email"
                value="immobenin@gmail.com"
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
                  href="https://facebook.com/immobenin"
                  label="Facebook"
                />
                <Social 
                  icon={Instagram} 
                  href="https://instagram.com/immobenin"
                  label="Instagram"
                />
                <Social 
                  icon={Music} 
                  href="https://tiktok.com/@immobenin"
                  label="TikTok"
                />
              </div>
            </div>

            {/* WhatsApp Direct */}
            <div className="bg-gradient-to-r from-brand/10 to-brand/5 p-2 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-brand" />
                <div>
                  <h3 className="font-semibold text-gray-900">Support WhatsApp</h3>
                  <p className="text-sm text-gray-600">Disponible H24</p>
                </div>
              </div>
              <a
                href="https://wa.me/22961000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors w-full"
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nom complet *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Votre nom complet"
              />

              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
              />

              <Input
                label="Sujet *"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Objet de votre message"
              />

              <Textarea
                label="Message *"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Décrivez votre demande..."
              />

              <button
                type="submit"
                className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand-dark transition-all flex items-center justify-center gap-2 group"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Envoyer le message
              </button>
              
              <p className="text-sm text-gray-500 text-center">
                * Champs obligatoires
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Components ---------- */

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
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
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
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none transition-all"
    />
  </div>
);