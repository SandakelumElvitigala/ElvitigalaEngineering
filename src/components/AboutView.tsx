/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Locale, TeamMember, Milestone } from "../types";
import { TRANSLATIONS } from "../utils/i18n";
import {
  History,
  Target,
  Award,
  Users,
  Mail,
  ShieldCheck,
  BookmarkCheck,
  Briefcase,
  Milestone as MilestoneIcon,
} from "lucide-react";

interface AboutViewProps {
  locale: Locale;
  team: TeamMember[];
  milestones: Milestone[];
}

export default function AboutView({
  locale,
  team,
  milestones = [],
}: AboutViewProps) {
  const t = TRANSLATIONS[locale];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 animate-fade-in"
      id="about-view-wrapper"
    >
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          ABOUT ELVITIGALA GROUP
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 leading-none">
          {t.aboutTitle}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {t.aboutSubtitle}
        </p>
      </div>

      {/* Grid: Mission and Strategy */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        id="about-vision-cards"
      >
        <div className="border border-zinc-200 dark:border-zinc-850 p-8 sm:p-10 rounded-2xl bg-white dark:bg-zinc-900/40 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
              Our Overarching Vision
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              To remain the absolute gold-standard in high-precision civil
              engineering, bridging architectural aesthetic brilliance and steel
              fabrications to yield beautiful, safe, and everlasting structures
              across South Asia.
            </p>
          </div>
          <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-450">
            <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
            <span>ISO 9001:2015 Registered Entity</span>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-850 p-8 sm:p-10 rounded-2xl bg-white dark:bg-zinc-900/40 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl inline-block">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
              Precision Commitment
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We operate under a strict policy of Zero-Budget-Overruns and zero
              material waste. Our quantity estimators perform structural
              take-offs prior to excavation, protecting developer liquidity.
            </p>
          </div>
          <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-450">
            <BookmarkCheck className="h-4.5 w-4.5 text-amber-500" />
            <span>No Budget-Overrun Guarantee</span>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-10" id="about-milestones">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="font-sans font-extrabold text-xl text-zinc-900 dark:text-zinc-50">
            Our Timeline of Construction Milestones
          </h3>
          <p className="text-xs text-zinc-400">
            Tracing our evolutionary roots from local builders to regional
            structural consultants.
          </p>
        </div>

        <div className="relative pl-6 md:pl-0 border-l md:border-l-0 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:w-0.5 md:before:bg-zinc-200 dark:md:before:bg-zinc-850 space-y-8 max-w-4xl mx-auto">
          {milestones.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative md:w-1/2 ${isLeft ? "md:pr-10 md:mr-auto text-left md:text-right" : "md:pl-10 md:ml-auto text-left"}`}
              >
                {/* Node counter */}
                <div
                  className="absolute top-0.5 -left-[30px] md:left-auto md:right-auto md:top-1/2 md:-translate-y-1/2 md:w-4 md:h-4 md:rounded-full md:bg-amber-500 md:border-4 md:border-white dark:md:border-zinc-950 z-10"
                  style={{
                    left: isLeft ? "auto" : "-9px",
                    right: isLeft ? "-9px" : "auto",
                  }}
                ></div>

                <div className="border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                  <div className="font-mono text-amber-500 font-black text-sm">
                    {item.year}
                  </div>

                  <h4 className="font-sans font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Board */}
      <div className="space-y-10" id="about-team">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest block">
            Executive Board
          </span>
          <h3 className="font-sans font-extrabold text-2xl text-zinc-900 dark:text-zinc-50">
            Our Principal Specialists
          </h3>
          <p className="text-xs text-zinc-400">
            The key directors and chartered estimators steering our structural
            divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-zinc-55/30 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full"
            >
              <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 duration-300"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                    {member.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                    {member.role}
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 text-xs text-zinc-450">
                  <Mail className="h-4 w-4 text-amber-500" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:underline hover:text-amber-500 font-mono text-[10px] select-all"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
