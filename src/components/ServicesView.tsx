/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Locale, Service } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  Building,
  Compass,
  Hammer,
  Waves,
  Zap,
  FileText,
  Volume2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Wrench,
  Layers,
  Activity,
  Cpu,
  Droplet,
  Plug,
  Tv,
  Settings
} from 'lucide-react';

interface ServicesViewProps {
  locale: Locale;
  services: Service[];
  setActiveTab: (t: string) => void;
}

export default function ServicesView({ locale, services, setActiveTab }: ServicesViewProps) {
  const t = TRANSLATIONS[locale];
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="h-6 w-6 text-amber-500" />;
      case 'Building': return <Building className="h-6 w-6 text-amber-500" />;
      case 'HardHat': return <Building className="h-6 w-6 text-amber-500" />;
      case 'Compass': return <Compass className="h-6 w-6 text-amber-500" />;
      case 'Layers': return <Layers className="h-6 w-6 text-amber-500" />;
      case 'Zap': return <Zap className="h-6 w-6 text-amber-500" />;
      case 'Activity': return <Activity className="h-6 w-6 text-amber-500" />;
      case 'FileText': return <FileText className="h-6 w-6 text-amber-500" />;
      case 'Cpu': return <Cpu className="h-6 w-6 text-amber-500" />;
      case 'Waves': return <Waves className="h-6 w-6 text-amber-500" />;
      case 'Volume2': return <Volume2 className="h-6 w-6 text-amber-500" />;
      case 'Hammer': return <Hammer className="h-6 w-6 text-amber-500" />;
      case 'Settings': return <Settings className="h-6 w-6 text-amber-500" />;
      case 'Droplet': return <Droplet className="h-6 w-6 text-amber-500" />;
      case 'Plug': return <Plug className="h-6 w-6 text-amber-500" />;
      case 'Tv': return <Tv className="h-6 w-6 text-amber-500" />;
      default: return <HelpCircle className="h-6 w-6 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in" id="services-view-container">
      
      {/* Header Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          LATEST ENGINEERING CONVENTIONS
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50">
          Our Architectural and Civil Engineering Capabilities
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
          All our engineering divisions are driven strictly by ISO certified frameworks and overseen by structural architects to guarantee solid safety margins and breathtaking aesthetics.
        </p>
      </div>

      {/* Grid Layout: Left selector sidebar, Right elaborate descriptions panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Services selector button drawer */}
        <div className="lg:col-span-4 space-y-3.5" id="services-sidebar">
          <h2 className="text-zinc-400 uppercase text-xs font-mono font-bold tracking-widest mb-4 block px-2">
            Engineering Divisions
          </h2>
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`w-full text-left p-5 transition-all outline-none rounded-xl border flex items-center gap-4 ${
                selectedServiceId === service.id
                  ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-md transform translate-x-1 font-bold'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-850 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-800'
              }`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${selectedServiceId === service.id ? 'bg-amber-300 text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-amber-500'}`}>
                {getIconComponent(service.icon)}
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-sm">{service.title}</h3>
                <span className={`text-[10px] font-mono block ${selectedServiceId === service.id ? 'text-zinc-800' : 'text-zinc-400'}`}>
                  {service.category.toUpperCase()} DIVISION
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Elucidated descriptions panel */}
        {activeService && (
          <div className="lg:col-span-8 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-250 dark:border-zinc-850 rounded-2xl p-8 sm:p-12 space-y-8 flex flex-col justify-between" id="services-specs-panel">
            
            <div className="space-y-6">
              
              {/* Specialized Tagline */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 flex items-center justify-center">
                  {getIconComponent(activeService.icon)}
                </div>
                <div>
                  <span className="text-amber-500 font-mono text-[10px] uppercase font-bold tracking-widest block">Core Discipline</span>
                  <h2 className="font-sans font-extrabold text-2xl text-zinc-900 dark:text-zinc-50 leading-none">{activeService.title}</h2>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-zinc-700 dark:text-zinc-200 text-base leading-relaxed font-sans font-medium">
                  {activeService.shortDesc}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  {activeService.longDesc}
                </p>
              </div>

              {/* Bullet Features Checklist */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <h4 className="text-zinc-900 dark:text-zinc-200 text-xs font-mono font-extrabold uppercase tracking-widest">
                  Standard Execution Benchmarks
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeService.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                      <CheckCircle className="h-4.5 w-4.5 text-amber-550 dark:text-amber-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Direct Estimate CTA */}
            <div className="pt-8 border-t border-zinc-250 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <strong className="text-zinc-950 dark:text-zinc-100 text-sm font-sans font-extrabold block">Need estimates for {activeService.title}?</strong>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 block">Prepare and drag your pricing sheets to receive quantity evaluations.</span>
              </div>
              <button
                onClick={() => setActiveTab('boq')}
                className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black dark:hover:text-black transition-all text-white dark:text-zinc-950 text-xs font-bold font-mono tracking-tight flex items-center gap-1.5 shrink-0 uppercase"
              >
                <span>Submit BOQ For review</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
