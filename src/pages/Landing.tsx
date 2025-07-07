
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Integrations from '@/components/landing/Integrations';
import Dashboard from '@/components/landing/Dashboard';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900">
      <Hero />
      <Features />
      <Integrations />
      <Dashboard />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Landing;
