/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cpu } from "lucide-react";

export default function AdminHeader() {
  return (
    <div className="p-6 bg-zinc-950 text-white rounded-3xl border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="space-y-1.5 text-center md:text-left">
        <div className="flex gap-2 justify-center md:justify-start items-center text-amber-500 text-xs font-mono font-bold uppercase tracking-widest">
          <Cpu className="h-4 w-4 text-amber-500 animate-spin" />
          <span>ELVITIGALA CENTRAL DATABASE CONSOLE</span>
        </div>
        <h1 className="font-sans font-black text-2xl tracking-tight">
          System Administrative Control Panel
        </h1>
        <p className="text-zinc-400 text-xs mt-0.5">
          Edit portfolio items, approve reviews, revise quantity bids, and read
          deployment schemas.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] shrink-0">
        <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-500 font-bold">
          DATABASE SIMULATOR ACTIVE
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
          RLS ACTIVE
        </span>
      </div>
    </div>
  );
}