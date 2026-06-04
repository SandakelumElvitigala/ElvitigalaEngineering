/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Locale, Testimonial } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { db } from '../utils/db';
import { Star, MessageSquareCode, CheckSquare, PlusCircle } from 'lucide-react';

interface TestimonialsViewProps {
  locale: Locale;
  testimonials: Testimonial[];
  onTestimonialSubmitted: () => void;
}

export default function TestimonialsView({
  locale,
  testimonials,
  onTestimonialSubmitted
}: TestimonialsViewProps) {
  const t = TRANSLATIONS[locale];
  
  // Submission form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      alert('Please fill out all mandatory review inputs.');
      return;
    }

    const payload: Testimonial = {
      id: 'test-' + Date.now(),
      name,
      company: company || 'Property Developer',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      isApproved: false // Requires admin moderation
    };

    try {
      await db.updateTestimonial(payload);
      setSuccessMsg(true);
      setName('');
      setCompany('');
      setRating(5);
      setComment('');
      onTestimonialSubmitted();
      
      setTimeout(() => {
        setSuccessMsg(false);
      }, 6000);
    } catch (err) {
      console.error(err);
    }
  };

  const approvedTestimonials = testimonials.filter((t) => t.isApproved);
  const averageRating = approvedTestimonials.length > 0
    ? (approvedTestimonials.reduce((sum, current) => sum + current.rating, 0) / approvedTestimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in" id="testimonials-view-wrapper">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          DEVELOPER VERDICTS & CASE REVIEWS
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 leading-none">
          {t.testimonialsTitle}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {t.testimonialsSubtitle}
        </p>
      </div>

      {/* Grid Layout: Left Statistics Cards, Right User submissions form cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Scorecard & Testimonials Listing Grid */}
        <div className="lg:col-span-7 space-y-8" id="testimonials-listing-panel">
          
          {/* Average Rating Scorecard Card */}
          <div className="border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/10 flex items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Consolidated Scorecard</span>
              <strong className="font-sans font-black text-4xl text-zinc-900 dark:text-zinc-50 flex items-baseline gap-1">
                {averageRating} <span className="text-xs text-zinc-400 font-medium">/ 5.0</span>
              </strong>
              <div className="flex text-amber-500">
                {Array.from({ length: Math.round(parseFloat(averageRating)) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-right text-xs text-zinc-500 font-mono">
              <span>{approvedTestimonials.length} Verified Endorsements</span>
            </div>
          </div>

          {/* Testimonial Core Cards */}
          <div className="space-y-6" id="testimonials-scroller">
            {approvedTestimonials.map((item) => (
              <div
                key={item.id}
                className="border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/30 p-6 rounded-xl space-y-4 relative"
                id={`testimonial-card-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{item.date}</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-sans font-extrabold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-zinc-900 dark:text-zinc-100 font-bold text-xs">{item.name}</h4>
                    <span className="text-zinc-450 dark:text-zinc-450 font-mono text-[9px] uppercase tracking-wider block">
                      {item.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: New Review Submit Form card */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl" id="review-submission-box">
          
          <div className="flex items-center gap-3 border-b border-zinc-150 dark:border-zinc-850 pb-4">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <MessageSquareCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-100 leading-none">Submit Corporate Feedback</h2>
              <p className="text-zinc-400 text-[11px] mt-1">Share your structural experiences with the executive board.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm" id="testimonial-form">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Full Business Name / Representation</label>
              <input
                type="text"
                required
                className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500/50"
                placeholder="Eng. Dilhan De Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Associated Corporation / Department</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500/50"
                placeholder="Supreme Residencies Ceylon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Star Rating Valuation</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => setRating(starNum)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star className={`h-6 w-6 ${rating >= starNum ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Review Testimonial Text</label>
              <textarea
                required
                rows={4}
                className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:border-amber-500/50"
                placeholder="Write your structural review or feedback on planning/execution here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex gap-2 items-center" id="review-submit-success">
                <CheckSquare className="h-4.5 w-4.5" />
                <span>Testimonial saved! Logged in moderation queue. Tip: You can approve this instantly by toggling Administrative Mode!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
              id="submit-testimonial-btn"
            >
              <PlusCircle className="h-4 w-4" />
              <span>COMMIT DIRECT REVIEW</span>
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
