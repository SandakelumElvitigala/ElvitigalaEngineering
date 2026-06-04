/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Locale, BOQSubmission, Service } from "../types";
import { TRANSLATIONS } from "../utils/i18n";
import { db, supabase } from "../utils/db";
import { UploadCloud, CheckCircle2, Lock, FileText, X } from "lucide-react";

interface BoqPortalViewProps {
  locale: Locale;
  onSubmitSuccess: (boq: BOQSubmission) => void;
  services?: Service[];
}

type Phase = "form" | "success";

export default function BoqPortalView({
  locale,
  onSubmitSuccess,
  services = [],
}: BoqPortalViewProps) {
  const t = TRANSLATIONS[locale];

  const [phase, setPhase] = useState<Phase>("form");
  const [submittedRecord, setSubmittedRecord] = useState<BOQSubmission | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  // Contact fields
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectType, setProjectType] = useState(
    services[0]?.title ?? "Civil Works",
  );
  const [notes, setNotes] = useState("");

  // File attachment
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Keep projectType in sync when services load
  React.useEffect(() => {
    if (services.length > 0 && !services.some((s) => s.title === projectType)) {
      setProjectType(services[0].title);
    }
  }, [services]);

  // ── file handling ─────────────────────────────────────────────────────────
  const acceptFile = (f: File) => setFile(f);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    if (file && file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a file under 10 MB.");
      return;
    }

    setSubmitting(true);
    try {
      let fileName = "no-file";
      let storagePath = "";
      let fileUrl = "";

      if (file && supabase) {
        fileName = file.name;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        storagePath = `uploads/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`;

        // ── DEBUG: log everything before upload ──
        console.log("=== BOQ UPLOAD DEBUG ===");
        console.log("bucket: boq-files");
        console.log("storagePath:", storagePath);
        console.log("file name:", file.name);
        console.log("file size:", file.size);
        console.log("file type:", file.type);
        console.log("supabase url:", (supabase as any).supabaseUrl);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("boq-files")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "application/octet-stream",
          });

        // ── DEBUG: log result ──
        console.log("upload data:", uploadData);
        console.log("upload error:", uploadError);
        console.log("upload error message:", uploadError?.message);
        console.log("upload error status:", (uploadError as any)?.statusCode);
        console.log("========================");

        if (uploadError) {
          console.error("Storage upload failed:", uploadError.message);
          storagePath = "";
        } else {
          const { data: urlData } = supabase.storage
            .from("boq-files")
            .getPublicUrl(storagePath);
          fileUrl = urlData?.publicUrl ?? "";
          console.log("fileUrl:", fileUrl);
        }
      }

      const saved = await db.submitBOQ({
        clientName,
        clientEmail,
        clientPhone,
        projectType,
        notes,
        fileName,
        storagePath,
        fileUrl,
        mappedItems: [],
        totalEstimate: 0,
        quoteUrl: "",
        adminNote: "",
      });

      setSubmittedRecord(saved);
      onSubmitSuccess(saved);
      setPhase("success");
    } catch (err: any) {
      console.error("BOQ submit error:", err);
      alert(
        err?.message
          ? `Submission failed: ${err.message}`
          : "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setPhase("form");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setNotes("");
    setFile(null);
    setProjectType(services[0]?.title ?? "Civil Works");
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          QUANTITY SURVEYOR PORTAL
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 leading-none">
          {t.boqTitle}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {t.boqSubtitle}
        </p>
      </div>

      {/* ── FORM ── */}
      {phase === "form" && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-8 shadow-xl space-y-8">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <h2 className="font-sans font-extrabold text-lg text-zinc-900 dark:text-zinc-50">
              Submit Your BOQ Request
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Fill in your details and attach your BOQ file. Our Quantity
              Surveying team will review and send you a formal estimate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Contact details */}
            <div className="space-y-4">
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-zinc-400">
                Contact Information
              </p>

              <div className="space-y-1.5">
                <label className="font-bold uppercase text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Full Name / Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  placeholder="Eng. Priyantha Elvitigala"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 block">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className={inputClass}
                    placeholder="name@business.lk"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold uppercase text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 block">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className={inputClass}
                    placeholder="+94 77 123 4567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Project Type
                </label>
                <select
                  className={inputClass}
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  {services.length > 0 ? (
                    services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))
                  ) : (
                    <>
                      <option>Civil Concrete Superstructure</option>
                      <option>Architecture & Interior Fitouts</option>
                      <option>Structural PEB Steel Warehouse</option>
                      <option>Luxury Swimming Pool / Resort Plants</option>
                      <option>Acoustics & Auditorium Insulation</option>
                      <option>Smart Electrical / BMS Optical Grids</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Project Notes{" "}
                  <span className="text-zinc-300 dark:text-zinc-600 font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Brief description of scope, site location, special requirements…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* File upload */}
            <div className="space-y-3">
              <p className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-zinc-400">
                BOQ File Attachment{" "}
                <span className="text-zinc-300 dark:text-zinc-600 font-normal normal-case">
                  (optional)
                </span>
              </p>

              {file ? (
                /* File selected — preview chip */
                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    dragOver
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-amber-500/60 bg-zinc-50 dark:bg-zinc-850"
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud
                    className={`h-8 w-8 mx-auto mb-2 transition-colors ${dragOver ? "text-amber-500" : "text-zinc-400"}`}
                  />
                  <p className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">
                    Drag & drop or{" "}
                    <span className="text-amber-500 underline underline-offset-2">
                      browse
                    </span>
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">
                    CSV, Excel, PDF, Word — any format accepted
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-tight uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Submit BOQ Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {phase === "success" && submittedRecord && (
        <div className="max-w-lg mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-10 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full inline-block">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <h2 className="font-sans font-black text-2xl text-zinc-900 dark:text-zinc-50">
              Request Submitted!
            </h2>
            <p className="text-[11px] font-mono text-zinc-400">
              Reference ID:{" "}
              <strong className="text-amber-500 select-all">
                {submittedRecord.id}
              </strong>
            </p>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Thank you,{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {submittedRecord.clientName}
            </strong>
            . Our Quantity Surveying team will review your request and contact
            you at{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {submittedRecord.clientEmail}
            </strong>{" "}
            with a formal estimate.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left space-y-2">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Submission Summary
            </p>
            {[
              { label: "Name", value: submittedRecord.clientName },
              { label: "Email", value: submittedRecord.clientEmail },
              { label: "Phone", value: submittedRecord.clientPhone },
              { label: "Project", value: submittedRecord.projectType },
              {
                label: "File",
                value:
                  submittedRecord.fileName !== "no-file"
                    ? submittedRecord.fileName
                    : "No file attached",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-2 text-[11px]">
                <span className="font-mono text-zinc-400 w-14 flex-shrink-0 pt-px">
                  {label}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="w-full py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase rounded-xl transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-zinc-400";
