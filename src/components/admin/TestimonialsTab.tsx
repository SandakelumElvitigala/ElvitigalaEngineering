/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Testimonial } from "../../types";
import { db } from "../../utils/db";

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  onRefreshData: () => void;
}

export default function TestimonialsTab({ testimonials, onRefreshData }: TestimonialsTabProps) {
  const handleApprove = async (t: Testimonial) => {
    await db.updateTestimonial({ ...t, isApproved: true });
    onRefreshData();
  };

  const handleDelete = async (id: string) => {
    await db.deleteTestimonial(id);
    onRefreshData();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm text-xs">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200 dark:border-zinc-800">
        <h4 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
          Testimonials Moderation Queue ({testimonials.length})
        </h4>
      </div>
      {testimonials.length === 0 ? (
        <div className="p-8 text-center text-zinc-400">No testimonials pending moderation.</div>
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-850 font-sans">
          {testimonials.map((test) => (
            <div key={test.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className="text-zinc-900 dark:text-zinc-50 font-bold text-sm">{test.name}</strong>
                  <span className="text-[10px] text-zinc-400 italic">({test.company})</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    test.isApproved
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                  }`}>
                    {test.isApproved ? "VERIFIED" : "PENDING"}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {"★".repeat(test.rating)}{"☆".repeat(5 - test.rating)}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 text-xs">"{test.comment}"</p>
                <span className="text-[9px] text-zinc-400 font-mono">{test.date}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                {!test.isApproved && (
                  <button
                    onClick={() => handleApprove(test)}
                    className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg font-mono text-[10px] uppercase"
                  >
                    ✓ Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(test.id)}
                  className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-red-500 hover:text-white rounded-lg font-mono text-[10px] uppercase transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}