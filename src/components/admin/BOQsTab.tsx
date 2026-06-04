/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BOQSubmission } from "../../types";
import { db, supabase } from "../../utils/db";

interface BOQsTabProps {
  boqs: BOQSubmission[];
  onRefreshData: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400",
  reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
  quoting:
    "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
  declined: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400",
};

const NOTE_MAP: Record<string, string> = {
  reviewing: "Quantity survey assigned for detailed calculation.",
  quoting: "Commercial bid drafted.",
  completed: "Official bid approved and dispatched to client.",
  declined: "Inquiry declined due to material supply thresholds.",
};

export default function BOQsTab({ boqs, onRefreshData }: BOQsTabProps) {
  const [reviewing, setReviewing] = useState<BOQSubmission | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");

  const handleDownloadFile = async () => {
    if (!reviewing?.storagePath) {
      alert("No file attached.");
      return;
    }

    try {
      if (!supabase) {
        alert("Supabase not configured");
        return;
      }

      const { data, error } = await supabase.storage
        .from("boq-files")
        .download(reviewing.storagePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);

      const a = document.createElement("a");
      a.href = url;
      a.download = reviewing.fileName || "boq-file";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download file.");
    }
  };

  const handleViewFile = () => {
    if (!reviewing?.storagePath || !supabase) {
      alert("No file attached.");
      return;
    }

    const { data } = supabase.storage
      .from("boq-files")
      .getPublicUrl(reviewing.storagePath);

    window.open(data.publicUrl, "_blank");
  };

  const handleSelectBOQ = (boq: BOQSubmission) => {
    console.log("Selected BOQ:", boq);
    setReviewing(boq);
    setAdminNote(boq.adminNote || "");
    setQuoteAmount(boq.totalEstimate > 0 ? String(boq.totalEstimate) : "");
  };

  const handleUpdateStatus = async (status: BOQSubmission["status"]) => {
    if (!reviewing) return;

    const timestamp = new Date().toISOString();
    const noteText = NOTE_MAP[status] ?? `Status changed to ${status}.`;

    const logs = [
      ...reviewing.logs,
      { timestamp, action: `Status: ${status}`, note: noteText },
    ];

    const updated: BOQSubmission = {
      ...reviewing,
      status,
      adminNote: adminNote || reviewing.adminNote,
      quoteUrl:
        status === "completed"
          ? reviewing.quoteUrl ||
            "https://elvitigala.lk/bids/compiled_estimate.pdf"
          : reviewing.quoteUrl,
      logs,
    };

    if (quoteAmount && (status === "quoting" || status === "completed")) {
      const num = parseFloat(quoteAmount);
      if (!isNaN(num)) updated.totalEstimate = num;
    }

    const ok = await db.updateBOQ(updated);
    if (ok) {
      setReviewing(updated);
      onRefreshData();
      alert(
        `Status updated to "${status}". Notification sent to ${reviewing.clientEmail}`,
      );
    }
  };

  // ─── formatted date ────────────────────────────────────────────────────────
  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* ── Inbox list ─────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            BOQ Submissions Inbox
          </h4>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {boqs.length} total
          </span>
        </div>

        {boqs.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-xs">
            No submissions yet. Submit a BOQ from the public portal.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-850 max-h-[600px] overflow-y-auto">
            {boqs.map((boq) => (
              <div
                key={boq.id}
                onClick={() => handleSelectBOQ(boq)}
                className={`p-4 transition-colors cursor-pointer text-xs space-y-1.5 ${
                  reviewing?.id === boq.id
                    ? "bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-850 border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-zinc-900 dark:text-zinc-50 font-bold leading-tight">
                    {boq.clientName}
                  </strong>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold flex-shrink-0 ${STATUS_STYLES[boq.status]}`}
                  >
                    {boq.status}
                  </span>
                </div>
                <div className="text-zinc-500 font-mono text-[10px] space-y-0.5">
                  <div className="truncate">{boq.projectType}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400">
                      {fmtDate(boq.submittedAt)}
                    </span>
                    {boq.totalEstimate > 0 && (
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">
                        LKR {boq.totalEstimate.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {boq.fileName && boq.fileName !== "no-file" && (
                    <div className="text-amber-500 truncate">
                      📎 {boq.fileName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Review panel ───────────────────────────────────────────────────── */}
      <div className="lg:col-span-7">
        {reviewing ? (
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            {/* Header */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] font-mono text-zinc-400 font-bold block uppercase">
                  Reviewing
                </span>
                <h3 className="font-sans font-black text-lg text-zinc-900 dark:text-zinc-50 mt-1">
                  {reviewing.clientName}
                </h3>
                <span className="text-[10px] font-mono text-zinc-450 block mt-0.5">
                  {reviewing.clientEmail} • {reviewing.clientPhone}
                </span>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${STATUS_STYLES[reviewing.status]}`}
                >
                  {reviewing.status}
                </span>
              </div>
              {reviewing.totalEstimate > 0 && (
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-mono text-zinc-400 block pb-1">
                    Ledger Sum
                  </span>
                  <strong className="text-amber-600 dark:text-amber-400 font-mono font-extrabold text-sm">
                    LKR {reviewing.totalEstimate.toLocaleString()}
                  </strong>
                </div>
              )}
            </div>

            {/* Submission details */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
              <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 pb-1">
                Submission Details
              </p>
              {[
                { label: "Project", value: reviewing.projectType },
                { label: "Submitted", value: fmtDate(reviewing.submittedAt) },
                {
                  label: "File",
                  value:
                    reviewing.fileName !== "no-file" && reviewing.fileName
                      ? reviewing.fileName
                      : "No file attached",
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-2 text-[11px]">
                  <span className="font-mono text-zinc-400 w-16 flex-shrink-0 pt-px">
                    {label}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium break-all">
                    {value}
                  </span>
                </div>
              ))}

              {/* Project notes from the portal form */}
              {reviewing.notes && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                  <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 pb-1">
                    Client Notes
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {reviewing.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Workflow buttons */}
            <div className="space-y-3">
              {reviewing.storagePath && (
                <div className="flex flex-wrap gap-2 pt-3">
                  <button
                    onClick={handleViewFile}
                    className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono font-bold"
                  >
                    👁 View File
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold"
                  >
                    ⬇ Download File
                  </button>
                </div>
              )}
              <h4 className="text-zinc-900 dark:text-zinc-200 text-xs font-bold uppercase tracking-wide">
                Advance Workflow
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleUpdateStatus("reviewing")}
                  className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-mono font-bold rounded-lg transition-colors"
                >
                  ← ASSIGN TO QS
                </button>
                <button
                  onClick={() => handleUpdateStatus("quoting")}
                  className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono font-bold rounded-lg transition-colors"
                >
                  PREPARE ESTIMATE
                </button>
                <button
                  onClick={() => handleUpdateStatus("completed")}
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold rounded-lg transition-colors"
                >
                  ✓ DISPATCH QUOTATION
                </button>
                <button
                  onClick={() => handleUpdateStatus("declined")}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-mono font-bold rounded-lg transition-colors"
                >
                  ✕ DECLINE BID
                </button>
              </div>
            </div>

            {/* Quote inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                  Quotation Sum (LKR)
                </label>
                <input
                  type="number"
                  className="w-full p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 font-mono text-xs font-extrabold focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all"
                  placeholder="0"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                  Admin Note
                </label>
                <textarea
                  rows={2}
                  className="w-full p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
                  placeholder="e.g. Rate incorporates Grade 45 Concrete."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
            </div>

            {/* Mapped line items (only shown if present) */}
            {reviewing.mappedItems.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">
                  Mapped BOQ Items
                </h4>
                <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-850">
                  {reviewing.mappedItems.map((itm) => (
                    <div
                      key={itm.id}
                      className="p-3 flex justify-between items-center text-[11px] gap-2"
                    >
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {itm.description}
                      </span>
                      <span className="font-mono text-zinc-400 shrink-0">
                        {itm.quantity} {itm.unit} × LKR {itm.rate} ={" "}
                        <strong className="text-zinc-700 dark:text-zinc-300">
                          LKR {itm.amount.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity log */}
            {reviewing.logs.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">
                  Activity Log
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {[...reviewing.logs].reverse().map((log, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-[10px] font-mono"
                    >
                      <span className="text-zinc-400 shrink-0 pt-px">
                        {fmtDate(log.timestamp)}
                      </span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                        {log.action}
                      </span>
                      <span className="text-zinc-500">{log.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-12 text-center text-zinc-400 text-xs">
            Select a BOQ submission from the inbox to review details and update
            its status.
          </div>
        )}
      </div>
    </div>
  );
}
