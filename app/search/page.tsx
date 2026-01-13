// app/search/page.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Search } from '@/components/Search'; // Import du composant

export default function SearchPage() {
  const router = useRouter();
  
  return <Search onBack={() => router.push('/')} />;
}