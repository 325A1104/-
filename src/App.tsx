/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SyncedLyricPlayer } from './components/SyncedLyricPlayer';
import { SummerScenesGallery } from './components/SummerScenesGallery';
import { SoundMixer } from './components/SoundMixer';
import { ColorPaletteSpecimen } from './components/ColorPaletteSpecimen';
import { Footer } from './components/Footer';
import { WaterCausticsCanvas } from './components/WaterCausticsCanvas';

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-800 selection:bg-sky-200 selection:text-sky-900 overflow-x-hidden">
      {/* Dynamic Crystalline Water Caustics & Particle Canvas */}
      <WaterCausticsCanvas />

      {/* Atmospheric Multi-layer Background: Sky Gradient & Sunbeam Radiance */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd]/50 to-[#f0f9ff]" />
      
      {/* Subtle radial sunbeam flare top right (evoking IMG_0591 sun ray flare) */}
      <div 
        className="fixed -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 opacity-70 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(186,230,253,0.5) 40%, rgba(224,242,254,0) 70%)'
        }}
      />

      {/* Soft secondary cyan pool bottom left */}
      <div 
        className="fixed -bottom-48 -left-48 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(6,182,212,0.15) 50%, rgba(240,249,255,0) 70%)'
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow space-y-8 sm:space-y-12">
          <Hero />
          <SyncedLyricPlayer />
          <SummerScenesGallery />
          <SoundMixer />
          <ColorPaletteSpecimen />
        </main>

        <Footer />
      </div>
    </div>
  );
}
