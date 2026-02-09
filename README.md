ImmoBénin - Plateforme d’Annonces Immobilières
📋 À propos du projet

ImmoBénin est une plateforme web moderne dédiée à la recherche, la publication et la gestion de biens immobiliers au Bénin. Les utilisateurs peuvent consulter des annonces, filtrer par ville, catégorie ou prix, et contacter directement les propriétaires ou agences.

Stack Technologique

Framework : Next.js 16.1.1
 (App Router)

Langage : TypeScript 5.9.3

Styling : Tailwind CSS 4 + PostCSS

Animations : Framer Motion 12.26.1

Package Manager : pnpm ou npm

Linting : ESLint 9 + eslint-config-next 16.1.1

Base de données : Prisma 5.7.0

🚀 Démarrage Rapide
Prérequis

Node.js 18+

pnpm (recommandé) ou npm

Installation
# Cloner le projet
git clone <repository-url>
cd beninstay

# Installer les dépendances
pnpm install

Lancer le serveur de développement
pnpm dev


Le site sera accessible sur http://localhost:3000
 et se met à jour automatiquement lors de vos modifications.

📁 Architecture du Projet
beninstay/
├── prisma/                  # Schéma Prisma et seed
│   └── seed.ts
├── src/
│   ├── app/                 # Pages et layouts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── sections/
│       │   ├── Header.tsx
│       │   ├── Hero.tsx
│       │   ├── Listings.tsx
│       │   └── Filters.tsx
│       └── ....
├── public/                  # Fichiers statiques et images
│   ├── images/
│   └── [roles]/
├── package.json
└── tsconfig.json

🔨 Scripts Disponibles
Commande	Description
pnpm dev	Lance le serveur de développement
pnpm build	Génère Prisma + build pour production
pnpm start	Lance le serveur de production
pnpm lint	Vérifie le code avec ESLint
pnpm prisma:seed	Initialise la base de données avec seed Prisma
📝 Conventions de Code

Composants : PascalCase (Header.tsx)

Fichiers utilitaires : camelCase (utils.ts)

Types : utiliser interfaces pour objets et props

Tailwind CSS : préférer les classes utilitaires au CSS custom

Export par défaut pour tous les composants React

🌍 Navigation et Pages

Accueil (/)

Annonces (/annonces)

Agences (/agences)

À propos (/a-propos)

Contact (/contact)

📦 Dépendances Principales
Package	Usage
next	Framework React
react, react-dom	Bibliothèque React
@prisma/client	ORM pour base de données
prisma	Gestion des migrations et seed
framer-motion	Animations
lucide-react	Icônes SVG
react-hot-toast	Notifications
react-icons	Icônes supplémentaires
cloudinary	Gestion des images
leaflet, @types/leaflet	Cartographie interactive
@emailjs/browser	Envoi d’emails côté client
🔐 Variables d’Environnement

Créer un fichier .env.local :

DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
CLOUDINARY_URL="cloudinary://key:secret@cloudname"
EMAILJS_PUBLIC_KEY=""
EMAILJS_SERVICE_ID=""
EMAILJS_TEMPLATE_ID=""

🐛 Dépannage Courant

Port 3000 déjà utilisé : pnpm dev -p 3001

Cache Next.js : rm -rf .next && pnpm dev

Dépendances cassées : rm -rf node_modules pnpm-lock.yaml && pnpm install

🚀 Déploiement sur Hostinger
Option Node.js (recommandé)
pnpm build
pnpm start


Configurer le port fourni par Hostinger

Node.js ≥ 18 requis

Option hébergement mutualisé (statique)

Modifier next.config.js :

module.exports = {
  output: "export",
};


Build statique : pnpm build

Uploader le contenu du dossier out/ dans public_html/

Note : Les fonctionnalités côté serveur (Prisma, API) ne fonctionneront pas sur statique.

📚 Documentation

Next.js 16

Tailwind CSS 4

Prisma

Framer Motion

📞 Contact et Support

Pour toute question, consultez l’équipe ou les documentations officielles.

Dernière mise à jour : Février 2026