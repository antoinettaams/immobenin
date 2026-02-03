import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });
 
export const metadata: Metadata = {
  title: 'ImmoBenin - Louez ou proposez des espaces au Bénin',
  description: 'Maisons, appartements meublés, bureaux, salles d\'événements ou terrains. Trouvez l\'endroit idéal ou rentabilisez le vôtre.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 font-sans selection:bg-brand selection:text-white`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}