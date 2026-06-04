/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Locale, Project, Service } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  X, 
  Maximize2,
  HardHat, 
  Maximize,
  Briefcase
} from 'lucide-react';

interface ProjectsViewProps {
  locale: Locale;
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  services: Service[];
}

export default function ProjectsView({
  locale,
  projects,
  selectedProject,
  setSelectedProject,
  services
}: ProjectsViewProps) {
  const t = TRANSLATIONS[locale];
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Dynamically assemble unique project categories from registered database scopes
  const uniqueCategories = Array.from(new Set(services.map(s => s.category)))
    .map(categoryCode => {
      const parentSvc = services.find(s => s.category === categoryCode);
      return {
        id: categoryCode,
        label: parentSvc ? parentSvc.title : (categoryCode.charAt(0).toUpperCase() + categoryCode.slice(1))
      };
    });

  const categories = [
    { id: 'all', label: t.filterAll || 'All Work' },
    ...uniqueCategories
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in" id="projects-view-container">
      
      {/* Header heading */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          PROVEN STRUCTURAL FEATS
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50">
          Our Structural & Architectural Works Portfolio
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
          From high-tension steel warehouse spans to clifftop infinity swimming pools, explore how Elvitigala Engineering builds permanent monuments to functional aesthetics.
        </p>
      </div>

      {/* Filter Menu Bar */}
      <div className="flex flex-wrap justify-center items-center gap-2.5" id="projects-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-btn-${cat.id}`}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-4.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-mono font-bold border transition-all ${
              activeFilter === cat.id
                ? 'bg-amber-500 border-amber-500 text-zinc-950 font-bold active-filter shadow-sm'
                : 'bg-white dark:bg-zinc-905 border-zinc-200 dark:border-zinc-850 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/45 dark:hover:border-amber-500/40 transition-all cursor-pointer flex flex-col"
            id={`project-card-${project.id}`}
          >
            {/* Visual Header */}
            <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-zinc-950/80 text-white font-mono text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                {project.category}
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Core Details */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-sans font-extrabold text-lg leading-snug text-zinc-900 dark:text-zinc-50 group-hover:text-amber-550 dark:group-hover:text-amber-500 transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{project.location}</span>
                </div>
                <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 pt-2">
                  {project.description}
                </p>
              </div>

              {/* Quick Specs Overview Strip */}
              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 font-mono italic block text-[9px]">Budget valuation</span>
                  <strong className="text-zinc-800 dark:text-zinc-100 font-mono font-bold text-sm uppercase">{project.cost}</strong>
                </div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                  SPEC SHEET →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MODAL DIALOG / DETAIL OVERLAY */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-4" id="project-detail-modal">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-scale-up">
            
            {/* Carousel display header image */}
            <div className="relative aspect-[21/9] bg-zinc-800">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
              
              {/* Close Button right corner */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/60 hover:bg-zinc-900 text-white border border-white/10 transition-colors"
                id="close-modal-btn"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Breadcrumb info overlay bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-2.5 py-1 text-[9px] font-mono leading-none font-bold tracking-widest bg-amber-500 text-zinc-950 rounded uppercase inline-block mb-2">
                  {selectedProject.category.toUpperCase()} DIVISION
                </span>
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-white">
                  {selectedProject.title}
                </h2>
              </div>
            </div>

            {/* Content Details Layout */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[60vh] overflow-y-auto">
              
              {/* Left detail writeup */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h4 className="text-zinc-400 font-mono text-[10px] uppercase font-bold tracking-widest mb-1">
                    Abstract & Engineering Report
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Sub-images row */}
                {selectedProject.galleryUrls && selectedProject.galleryUrls.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">
                      Physical Renderings / Progress snaps
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProject.galleryUrls.map((gUrl, gIdx) => (
                        <div key={gIdx} className="aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900">
                          <img src={gUrl} alt={`gallery-${gIdx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right numerical spec table */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Visual scorecard attributes */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-3">
                  <h4 className="text-zinc-900 dark:text-zinc-200 text-xs font-mono font-extrabold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-2 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                    <span>Project Credentials</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-450 dark:text-zinc-400">Principal Client:</span>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-bold">{selectedProject.client}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-455 dark:text-zinc-400">Site Coordinates:</span>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{selectedProject.location}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-455 dark:text-zinc-400">Quantified Cost:</span>
                      <strong className="text-amber-600 dark:text-amber-400 uppercase font-mono font-bold text-sm leading-none">{selectedProject.cost}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-455 dark:text-zinc-400">Commission Year:</span>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-mono">{selectedProject.year}</strong>
                    </div>
                  </div>
                </div>

                {/* Specific technical specifications metrics */}
                {selectedProject.specs && selectedProject.specs.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest block">
                      Tension & Material Threshold Metrics
                    </h4>
                    <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-850 bg-white dark:bg-zinc-900 text-xs">
                      {selectedProject.specs.map((spec, specIdx) => (
                        <div key={specIdx} className="flex justify-between p-3">
                          <span className="text-zinc-500 dark:text-zinc-400 font-medium">{spec.label}</span>
                          <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold uppercase">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
