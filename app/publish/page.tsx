// app/publish/page.tsx ✅ BON FICHIER
"use client";
import { useRouter } from 'next/navigation';
import { PublishPage } from '@/components/PublishPage';

export default function PublishRoute() { // Nom différent pour éviter le conflit
  const router = useRouter();
  
  return <PublishPage onBack={() => router.push('/')} />;
}