/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { db } from "../../utils/db";
import {
  Save,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Trophy,
  FolderOpen,
  Users,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SiteSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  address: string;
  tagline: string;
  experienceYears: number;
  projectsCount: number;
  teamCount: number;
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  address: "",
  tagline: "",
  experienceYears: 0,
  projectsCount: 0,
  teamCount: 0,
  maintenanceMode: false,
};

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[9px] font-mono font-black uppercase tracking-[0.15em] text-zinc-400">
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-zinc-500 dark:text-zinc-400 font-bold uppercase block text-[10px] tracking-wider">
          {label}
        </label>
        {hint && (
          <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "w-full p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-zinc-400";

function IconInput({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
      <input
        {...props}
        className={`${inputClass} pl-8`}
      />
    </div>
  );
}

function StatInput({
  icon: Icon,
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-2 hover:border-amber-500/30 transition-colors">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Icon className="h-3 w-3 text-amber-500" />
        </div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
          {label}
        </span>
      </div>
      <input
        {...props}
        type="number"
        min={0}
        className="w-full bg-transparent border-none outline-none text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {hint && (
        <p className="text-[9px] font-mono text-zinc-400">{hint}</p>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface SiteSettingsTabProps {
  onRefreshData?: () => void;
}

export default function SiteSettingsTab({ onRefreshData }: SiteSettingsTabProps) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [dirty, setDirty]       = useState(false);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await db.getSiteSettings();
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
    } catch (err) {
      console.error("SiteSettingsTab: failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // ── change helpers ────────────────────────────────────────────────────────
  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await db.updateSiteSettings(settings);
      setDirty(false);
      setSaved(true);
      onRefreshData?.();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("SiteSettingsTab: save failed", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400 gap-2 font-mono text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading site settings…
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSave}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left column: identity + contact ─────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Company Identity card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                Company Identity
              </h3>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                Public-facing
              </span>
            </div>

            <Field label="Company Name">
              <IconInput
                icon={Building2}
                type="text"
                required
                placeholder="Excel Engineering (Pvt) Ltd"
                value={settings.companyName}
                onChange={(e) => set("companyName", e.target.value)}
              />
            </Field>

            <Field label="Tagline" hint="Shown in hero / footer">
              <div className="relative">
                <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  className={`${inputClass} pl-8`}
                  placeholder="Building Sri Lanka's Future, One Structure at a Time."
                  value={settings.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </div>
            </Field>

            <SectionHeading label="Contact Details" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address">
                <IconInput
                  icon={Mail}
                  type="email"
                  required
                  placeholder="info@exceleng.lk"
                  value={settings.companyEmail}
                  onChange={(e) => set("companyEmail", e.target.value)}
                />
              </Field>
              <Field label="Phone Number">
                <IconInput
                  icon={Phone}
                  type="tel"
                  placeholder="+94 11 234 5678"
                  value={settings.companyPhone}
                  onChange={(e) => set("companyPhone", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Office Address">
              <div className="relative">
                <MapPin className="absolute left-2.5 top-3 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                <textarea
                  rows={2}
                  className={`${inputClass} pl-8 resize-none`}
                  placeholder="No. 42, Galle Road, Colombo 03, Sri Lanka"
                  value={settings.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>
            </Field>
          </div>

          {/* Stats card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                Public Statistics
              </h3>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                Displayed on homepage
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatInput
                icon={Trophy}
                label="Years Active"
                hint="e.g. Founded 2004"
                value={settings.experienceYears}
                onChange={(e) => set("experienceYears", parseInt(e.target.value) || 0)}
              />
              <StatInput
                icon={FolderOpen}
                label="Projects Done"
                hint="Completed projects"
                value={settings.projectsCount}
                onChange={(e) => set("projectsCount", parseInt(e.target.value) || 0)}
              />
              <StatInput
                icon={Users}
                label="Team Size"
                hint="Full-time staff"
                value={settings.teamCount}
                onChange={(e) => set("teamCount", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* ── Right column: system controls + save ────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Maintenance Mode card */}
          <div className={`rounded-2xl border-2 p-6 space-y-4 transition-colors ${
            settings.maintenanceMode
              ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-850"
          }`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${settings.maintenanceMode ? "text-red-500" : "text-zinc-400"}`} />
                  Maintenance Mode
                </h3>
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed max-w-[260px]">
                  When enabled, visitors see a maintenance page. Admin access is unaffected.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={settings.maintenanceMode}
                onClick={() => set("maintenanceMode", !settings.maintenanceMode)}
                className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  settings.maintenanceMode
                    ? "bg-red-500 focus:ring-red-400"
                    : "bg-zinc-300 dark:bg-zinc-700 focus:ring-zinc-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    settings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {settings.maintenanceMode && (
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                <p className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Site is currently offline to visitors
                </p>
              </div>
            )}
          </div>

          {/* Save card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-4">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                Save Changes
              </h3>
            </div>

            {/* Status indicator */}
            <div className={`flex items-center gap-2 text-[10px] font-mono rounded-lg px-3 py-2 border ${
              saved
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                : dirty
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
                : "bg-zinc-50 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 text-zinc-400"
            }`}>
              {saved ? (
                <><CheckCircle2 className="h-3.5 w-3.5" /><span>All changes saved successfully</span></>
              ) : dirty ? (
                <><span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /><span>You have unsaved changes</span></>
              ) : (
                <><span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" /><span>No pending changes</span></>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || !dirty}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-tight uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving…</span></>
              ) : (
                <><Save className="h-4 w-4" /><span>Save Site Settings</span></>
              )}
            </button>

            <button
              type="button"
              onClick={fetchSettings}
              className="w-full py-2.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-bold tracking-tight uppercase rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Discard & Reload
            </button>
          </div>

          {/* Field summary card */}
          <div className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              Current Values Preview
            </p>
            <div className="space-y-2">
              {[
                { label: "Company", value: settings.companyName },
                { label: "Email",   value: settings.companyEmail },
                { label: "Phone",   value: settings.companyPhone },
                { label: "Tagline", value: settings.tagline },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-[9px] font-mono text-zinc-400 w-14 flex-shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {value || <span className="text-zinc-300 dark:text-zinc-600 italic">—</span>}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                <span className="text-[9px] font-mono text-zinc-400 w-14 flex-shrink-0">Mode</span>
                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                  settings.maintenanceMode
                    ? "bg-red-100 dark:bg-red-900/40 text-red-500"
                    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600"
                }`}>
                  {settings.maintenanceMode ? "Maintenance" : "Live"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}