'use client';

import { useRef } from 'react';
import Hero from '@/components/Hero';
import Problems from '@/components/Problems';
import Solution from '@/components/Solution';
import Steps from '@/components/Steps';
import BetaCTA from '@/components/BetaCTA';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function PromptGuardPage() {
  const betaRef = useRef<HTMLDivElement>(null);

  const scrollToBeta = () => {
    betaRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <main className="min-h-screen">
      <Hero onScrollToBeta={scrollToBeta} />
      <Problems />
      <Solution />
      <Steps />
      <div ref={betaRef}>
        <BetaCTA />
      </div>
      <FAQ />
      <Footer />
    </main>
  );
}



