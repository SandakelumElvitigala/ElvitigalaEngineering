/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Copy } from "lucide-react";
import { SQL_SCHEMA_BLUEPRINT, RLS_POLICIES_BLUEPRINT } from "../../utils/db";

export default function SQLTab() {
  const [sqlCopied, setSqlCopied] = useState(false);
  const [rlsCopied, setRlsCopied] = useState(false);

  const copy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Instructions */}
      <div className="lg:col-span-12">
        <div className="p-4 rounded-xl border border-dashed border-amber-500/25 bg-amber-500/5 text-zinc-700 dark:text-zinc-300 font-sans text-xs leading-relaxed">
          <strong className="text-zinc-900 dark:text-zinc-50 text-sm block font-black border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2">
            Supabase Provisioning Instructions
          </strong>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>Create a new project in your <strong className="text-amber-500">Supabase Dashboard</strong>.</li>
            <li>Open the <strong>SQL Editor</strong> inside Supabase.</li>
            <li>Copy and run the DDL script below, then the RLS policies in separate queries.</li>
            <li>
              Set <code className="font-mono font-bold text-amber-500 bg-amber-200/20 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and{" "}
              <code className="font-mono font-bold text-amber-500 bg-amber-200/20 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono text-amber-500">.env</code> file.
            </li>
          </ol>
        </div>
      </div>

      {/* DDL Script */}
      <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono font-bold text-zinc-400">1. CORE POSTGRESQL DDL</span>
          <button
            onClick={() => copy(SQL_SCHEMA_BLUEPRINT, setSqlCopied)}
            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-850 hover:bg-amber-500 hover:text-black hover:font-bold rounded-lg text-[10px] flex items-center gap-1.5 uppercase transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{sqlCopied ? "COPIED ✓" : "Copy DDL"}</span>
          </button>
        </div>
        <pre className="p-4 bg-zinc-950 text-emerald-400 border border-zinc-850 text-[10px] rounded-xl overflow-x-auto max-h-[350px]">
          {SQL_SCHEMA_BLUEPRINT}
        </pre>
      </div>

      {/* RLS Policies */}
      <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono font-bold text-zinc-400">2. ROW LEVEL SECURITY (RLS)</span>
          <button
            onClick={() => copy(RLS_POLICIES_BLUEPRINT, setRlsCopied)}
            className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-855 hover:bg-amber-500 hover:text-black hover:font-bold rounded-lg text-[10px] flex items-center gap-1.5 uppercase transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{rlsCopied ? "COPIED ✓" : "Copy Rules"}</span>
          </button>
        </div>
        <pre className="p-4 bg-zinc-950 text-rose-400 border border-zinc-850 text-[10px] rounded-xl overflow-x-auto max-h-[350px]">
          {RLS_POLICIES_BLUEPRINT}
        </pre>
      </div>
    </div>
  );
}