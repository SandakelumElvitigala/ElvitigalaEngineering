/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Locale, Project, Service, Testimonial } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  Building, 
  ArrowUpRight, 
  Settings2, 
  Waves, 
  ShieldCheck, 
  Compass, 
  Hammer, 
  Award, 
  Clock, 
  CheckSquare, 
  Flame,
  Star
} from 'lucide-react';

interface HomeViewProps {
  locale: Locale;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  setActiveTab: (t: string) => void;
  setSelectedProject: (p: Project | null) => void;
}

export default function HomeView({
  locale,
  projects,
  services,
  testimonials,
  setActiveTab,
  setSelectedProject
}: HomeViewProps) {
  const t = TRANSLATIONS[locale];
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);

  const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 3);
  const visibleTestimonials = testimonials.filter(res => res.isApproved).slice(0, 4);

  const handleNextTestimonial = () => {
    if (visibleTestimonials.length > 0) {
      setCurrentTestimonialIdx((prev) => (prev + 1) % visibleTestimonials.length);
    }
  };

  const currentYr = '2026';

  return (
    <div className="space-y-24 pb-20 animate-fade-in" id="home-view-container">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-24 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900" id="home-hero">
        {/* Subtle architectural mesh grid pattern backing */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 animate-pulse text-xs font-mono font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Sri Lanka's Premium Civil & Structural Unit</span>
              </div>

              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-zinc-900 dark:text-zinc-50">
                {locale === 'en' ? (
                  <>
                    Precision Concrete. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600">Formidable Steel.</span> <br />
                    Inspired Spaces.
                  </>
                ) : t.homeHeroTitle}
              </h1>

              <p className="text-zinc-600 dark:text-zinc-300 text-lg sm:text-xl leading-relaxed max-w-xl">
                {t.homeHeroSubtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab('boq')}
                  className="px-8 py-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 text-base group"
                  id="hero-cta-estimate"
                >
                  <span>{t.homeHeroCTA}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="px-8 py-4 rounded-lg border border-zinc-300 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold tracking-wide transition-all text-base text-center"
                  id="hero-cta-portfolio"
                >
                  View Completed Works
                </button>
              </div>

              {/* Live Statistics Block */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 max-w-lg" id="hero-stats">
                <div className="space-y-1">
                  <div className="font-sans font-black text-3xl sm:text-4xl text-amber-500">25+</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t.homeStatsExp}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-sans font-black text-3xl sm:text-4xl text-amber-500">100+</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t.homeStatsProjects}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-sans font-black text-3xl sm:text-4xl text-amber-500">10+</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t.homeStatsClients}</div>
                </div>
              </div>

            </div>

            {/* Right Graphic/Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-200 dark:border-zinc-800 aspect-[4/3] sm:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" 
                  alt="Civil Site Construction Steel Framing" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Floating HUD over image (No telemetry - actual contextual descriptors) */}
                <div className="absolute top-4 left-4 bg-zinc-950/90 text-white border border-zinc-800 p-3 rounded-lg backdrop-blur-sm hidden sm:block max-w-xs">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-[10px] tracking-widest font-semibold uppercase">
                    <Award className="h-4.5 w-4.5" />
                    <span>LATEST HIGH-RISE PROJECT</span>
                  </div>
                  <h4 className="font-sans font-extrabold text-sm text-gray-50 mt-1 leading-snug">Colombo Supreme Tower</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Foundational Post-tension Core Structural engineering works.</p>
                </div>

                <div className="absolute bottom-4 right-4 bg-amber-500 text-white py-2 px-3.5 rounded-lg font-mono text-[11px] font-bold shadow-lg">
                  LKR 450M Budget Code
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BULLETS (Engineering Disciplines Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="home-pillars">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
            {t.servicesTitle}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
            {t.servicesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => {
            return (
              <div 
                key={service.id}
                onClick={() => setActiveTab('services')}
                className="group border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-8 rounded-xl hover:border-amber-550 dark:hover:border-amber-500/50 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decorative hover gradient border overlay */}
                <div className="absolute right-0 bottom-0 top-0 w-1 bg-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                
                {/* Visual Header */}
                <div className="inline-flex items-center justify-center p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-amber-500 mb-6 transition-colors group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20">
                  <Building className="h-6 w-6" />
                </div>

                <h3 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-amber-500 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  {service.shortDesc}
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                  <span>Explore Features</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PROJECTS CAROUSEL */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-20 border-t border-b border-zinc-200 dark:border-zinc-900" id="home-featured-projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">Showcase of Pride</span>
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-zinc-900 dark:text-zinc-50 select-none">
                Featured Engineering Masterpieces
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 font-semibold text-sm text-zinc-700 dark:text-zinc-200 transition-all shrink-0"
              id="view-all-projects-btn"
            >
              <span>Explore All Projects</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-950/80 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-grow">
                  <div className="space-y-1.5 flex-grow">
                    <h3 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-550 dark:group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400">
                      {project.location}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 pt-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-zinc-400 font-mono italic block text-[10px]">Budget Cost</span>
                      <strong className="text-zinc-800 dark:text-zinc-200 uppercase font-mono font-bold text-sm tracking-tight">{project.cost}</strong>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold font-mono group-hover:underline flex items-center gap-1">
                      VIEW SPECIFICATION
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INSTANT DIGITAL BOQ ESTIMATOR HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="home-boq-highlight">
        <div className="bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-amber-500/10 pointer-events-none">
            <Waves className="h-64 w-64" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            <div className="lg:col-span-12 space-y-6 max-w-3xl">
              <span className="text-amber-500 font-mono text-xs uppercase font-extrabold tracking-widest block">
                Revolutionary Quantity Surveying Portal
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-4xl text-white select-none">
                {t.quickEstimateTitle}
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                {t.quickEstimateDesc}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('boq')}
                  className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 transition-all text-white font-bold text-sm flex items-center gap-2"
                >
                  <span>Launch BOQ Mapper</span>
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </button>
                <div className="flex items-center text-zinc-400 gap-2 text-xs font-mono pl-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">CSV Supported</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">Excel Templates</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SLIDER SECTION */}
      {visibleTestimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-transparent" id="home-testimonials">
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 p-8 sm:p-12 rounded-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-amber-500 font-mono text-xs uppercase font-extrabold tracking-widest block mb-1">
                  Trusted Developers
                </span>
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-50">
                  {t.testimonialsTitle}
                </h2>
              </div>
              <button
                onClick={handleNextTestimonial}
                className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold"
                id="next-testimonial-trigger"
              >
                NEXT REVIEW →
              </button>
            </div>

            {/* Testimonial Active Display */}
            <div className="space-y-6" id="testimonial-slider-content">
              
              <div className="flex items-center gap-1.5 text-amber-500">
                {Array.from({ length: visibleTestimonials[currentTestimonialIdx].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current stroke-[2.5]" />
                ))}
              </div>

              <blockquote className="text-zinc-800 dark:text-zinc-200 text-lg sm:text-xl font-sans font-medium tracking-tight leading-relaxed italic">
                "{visibleTestimonials[currentTestimonialIdx].comment}"
              </blockquote>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-50 block text-base font-bold">
                    {visibleTestimonials[currentTestimonialIdx].name}
                  </strong>
                  <span className="text-zinc-500 text-xs font-mono block">
                    {visibleTestimonials[currentTestimonialIdx].company}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  Write a Review
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
}
