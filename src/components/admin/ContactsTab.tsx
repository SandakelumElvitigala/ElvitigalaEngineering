/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContactSubmission } from "../../types";
import { Phone } from "lucide-react";

interface ContactsTabProps {
  contacts: ContactSubmission[];
}

export default function ContactsTab({ contacts }: ContactsTabProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm text-xs">
      
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <h4 className="font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Incoming Contact Leads ({contacts.length})
        </h4>
      </div>

      {contacts.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
          No contact leads yet. Submit an inquiry on the Contact page.
        </div>
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-5 space-y-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100 text-sm block font-bold">
                    {c.name}
                  </strong>

                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {c.email} • ID: {c.id}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  {new Date(c.submittedAt).toLocaleString()}
                </span>
              </div>

              {/* Message */}
              <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl space-y-1">
                <strong className="text-zinc-900 dark:text-zinc-100 block">
                  Subject: {c.subject}
                </strong>

                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {c.message}
                </p>
              </div>

              {/* Phone */}
              {c.phone && (
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-500">
                  <Phone className="h-3 w-3" />
                  <span>{c.phone}</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                    c.isResponded
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {c.isResponded ? "RESPONDED" : "AWAITING RESPONSE"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}