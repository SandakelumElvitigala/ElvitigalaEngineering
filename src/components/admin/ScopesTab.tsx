/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Service } from "../../types";
import { db } from "../../utils/db";
import { Trash } from "lucide-react";

const ICON_OPTIONS = [
  { value: "Wrench", label: "Wrench 🔧" },
  { value: "Building", label: "Building 🏢" },
  { value: "Compass", label: "Compass 🧭" },
  { value: "Layers", label: "Layers 🥞" },
  { value: "Zap", label: "Zap ⚡" },
  { value: "Activity", label: "Activity 📈" },
  { value: "FileText", label: "FileText 📄" },
  { value: "Cpu", label: "Cpu 💻" },
  { value: "Waves", label: "Waves 🌊" },
  { value: "Volume2", label: "Volume2 🔊" },
  { value: "Hammer", label: "Hammer 🔨" },
  { value: "Settings", label: "Settings ⚙️" },
  { value: "Droplet", label: "Droplet 💧" },
  { value: "Plug", label: "Plug 🔌" },
  { value: "Tv", label: "Tv 📺" },
];

const ICON_EMOJI_MAP: Record<string, string> = {
  Wrench: "🔧", Building: "🏢", Compass: "🧭", Layers: "🥞",
  Zap: "⚡", Activity: "📈", FileText: "📄", Cpu: "💻",
  Waves: "🌊", Volume2: "🔊", Hammer: "🔨", Settings: "⚙️",
  Droplet: "💧", Plug: "🔌", Tv: "📺",
};

interface ScopesTabProps {
  services: Service[];
  onRefreshData: () => void;
}

export default function ScopesTab({ services, onRefreshData }: ScopesTabProps) {
  const [form, setForm] = useState({
    title: "",
    category: "engineering",
    icon: "Wrench",
    shortDesc: "",
    longDesc: "",
    featuresText: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.shortDesc || !form.longDesc) return;

    const payload: Service = {
      id: "svc-" + Date.now(),
      title: form.title,
      category: form.category,
      icon: form.icon,
      shortDesc: form.shortDesc,
      longDesc: form.longDesc,
      features: form.featuresText.split(",").map((f) => f.trim()).filter(Boolean),
    };

    const ok = await db.updateService(payload);
    if (ok) {
      setForm({ title: "", category: "engineering", icon: "Wrench", shortDesc: "", longDesc: "", featuresText: "" });
      onRefreshData();
      alert("Scope registered successfully!");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this scope?")) {
      await db.deleteService(id);
      onRefreshData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Add Form */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 pb-3">
          Add New Scope of Service
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Field label="Service Title">
            <input
              type="text"
              required
              className={inputClass}
              placeholder="e.g., Specialized HVAC Systems"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category Code">
              <input
                type="text"
                required
                className={`${inputClass} font-mono font-bold text-amber-500`}
                placeholder="e.g., hvac"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              />
            </Field>
            <Field label="Lucide Icon">
              <select
                className={inputClass}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Short Description">
            <input
              type="text"
              required
              className={inputClass}
              placeholder="e.g., Thermal calculations and smart damper controls."
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
            />
          </Field>

          <Field label="Long Description">
            <textarea
              required
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Full scope, standards used, design loops, etc."
              value={form.longDesc}
              onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
            />
          </Field>

          <Field label="Features (comma-separated)">
            <input
              type="text"
              className={inputClass}
              placeholder="Damper Calibration, ISO 500, High Thermal Insulation"
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
            />
            <span className="text-[9px] text-zinc-400 block mt-0.5">
              Comma-separated. Rendered as visual checkboxes.
            </span>
          </Field>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold uppercase tracking-wide text-zinc-950 font-mono rounded-xl cursor-pointer"
          >
            Create scope division
          </button>
        </form>
      </div>

      {/* Services Table */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 pb-3">
          Active Scopes ({services.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase">
                <th className="pb-3 pt-1">Scope Division</th>
                <th className="pb-3 pt-1">Category</th>
                <th className="pb-3 pt-1">Short Description</th>
                <th className="pb-3 pt-1">Features</th>
                <th className="pb-3 pt-1 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-905/40">
                  <td className="py-3.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{ICON_EMOJI_MAP[svc.icon] ?? "❓"}</span>
                      <div>
                        <strong className="text-zinc-900 dark:text-zinc-100 text-xs block font-extrabold">{svc.title}</strong>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase block">ID: {svc.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-1 font-mono text-amber-500 font-bold uppercase">{svc.category}</td>
                  <td className="py-3.5 px-1 text-zinc-500 dark:text-zinc-400 max-w-xs truncate" title={svc.shortDesc}>
                    {svc.shortDesc}
                  </td>
                  <td className="py-3.5 px-1">
                    <div className="flex flex-wrap gap-1">
                      {svc.features.map((f, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-855">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full p-2 rounded bg-zinc-50 dark:bg-zinc-855 border border-zinc-200 dark:border-zinc-800 font-medium text-xs focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-zinc-500 dark:text-zinc-400 font-bold uppercase block text-[10px] tracking-wider">{label}</label>
      {children}
    </div>
  );
}