"use client";
import { Hero } from '@/components/HeroSection';
import { CategoriesSection, ValuePropSection } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { OwnerCTA } from '@/components/CTAHost';
import { Testimonials } from '@/components/Testimonials';
import { BeninFocus } from '@/components/BeninFocus';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategoriesSection />
      <ValuePropSection />
      <HowItWorks />
      <OwnerCTA />
      <Testimonials />
      <BeninFocus />
    </main>
  );
}