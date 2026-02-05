// app/search/page.tsx
"use client";

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from '@/components/Search';

function SearchPageContent() {
  const router = useRouter();
  
  return <Search onBack={() => router.back()} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}