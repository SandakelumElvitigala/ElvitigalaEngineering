/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Locale } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { HardHat, Flame, ShieldAlert, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  locale: Locale;
  setActiveTab: (t: string) => void;
}

export default function Footer({ locale, setActiveTab }: FooterProps) {
  const t = TRANSLATIONS[locale];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 transition-colors duration-300" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission Statement */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded bg-white-500 text-black">
                <img
                src="/logo01.png"
                alt="Elvitigala Engineering Logo"
                className="h-10 w-10 object-contain"
              />
              </div>
              <span className="font-sans font-black tracking-tight text-white text-lg">
                ELVITIGALA <span className="text-amber-500 text-sm">ENG</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Leading the architectural design, heavy structural steel fabrication, high-pressure hydraulic swimming pool plants, and civil works across Sri Lanka and beyond.
            </p>
            <div className="flex items-center text-xs gap-1.5 font-mono text-amber-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>A web powered by - Elvitech Solutions</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-white uppercase text-xs tracking-wider">
              Navigation Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-500 transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-amber-500 transition-colors">
                  {t.navServices}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className="hover:text-amber-500 transition-colors">
                  {t.navProjects}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('boq')} className="hover:text-amber-500 transition-colors">
                  {t.navBoq}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-amber-500 transition-colors">
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Specialized Capabilities List */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-white uppercase text-xs tracking-wider">
              Engineering Specialties
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                Civil Contracting & Reinforcement
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                Waterfront Architects & Interior
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                Pre-Fabricated Steel Structures
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                Advanced Resort Pools & Pumps
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                Commercial Building BMS & ELV
              </li>
            </ul>
          </div>

          {/* Headquarters Contacts */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-white uppercase text-xs tracking-wider">
              Headquarters Reach
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  No. 75/D, Balikawa Rd, Pahala Kosgama,<br /> Kosgama, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>+94 71 108 960</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                <span>info@elvitigalaengineers.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs gap-4">
          <div className="text-zinc-500">
            © {currentYear} Elvitigala Engineering Pvt Ltd. All rights reserved. • Sri Lankan Structural Licensure Class A01
          </div>
          <div className="flex space-x-6 text-zinc-500">
            <span className="hover:text-amber-500 cursor-pointer">Sitemap</span>
            <span>•</span>
            <span className="hover:text-amber-500 cursor-pointer">Postgres DB Sync</span>
            <span>•</span>
            <span className="hover:text-amber-500 cursor-pointer text-amber-500/80 font-mono">Supabase Standard Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
