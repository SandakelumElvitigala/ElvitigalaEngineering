/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Project, Service } from "../../types";
import { db } from "../../utils/db";
import { Plus, Trash, UploadCloud, Star } from "lucide-react";

const compressImage = (base64Str: string, callback: (compressed: string) => void) => {
  const img = new Image();
  img.src = base64Str;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;
    const MAX_DIM = 800;
    if (width > MAX_DIM || height > MAX_DIM) {
      if (width > height) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      } else {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.7));
    } else {
      callback(base64Str);
    }
  };
  img.onerror = () => callback(base64Str);
};

const PREBUILT_STOCK_IMAGES = [
  { name: "Civil Slab Casting", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600" },
  { name: "Steel Framing", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600" },
  { name: "Executive Interiors", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
  { name: "Modern Resort Pool", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600" },
  { name: "Brutalist Concrete", url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600" },
];

interface ProjectsTabProps {
  projects: Project[];
  services: Service[];
  onRefreshData: () => void;
}

export default function ProjectsTab({ projects, services, onRefreshData }: ProjectsTabProps) {
  const DEFAULT_STOCK = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop";

  const [newProj, setNewProj] = useState({
    title: "",
    category: services[0]?.category || "civil",
    client: "",
    location: "",
    cost: "LKR 80 Million",
    year: "2026",
    description: "",
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);

  React.useEffect(() => {
    if (services.length > 0 && !services.some((s) => s.category === newProj.category)) {
      setNewProj((prev) => ({ ...prev, category: services[0].category }));
    }
  }, [services]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files as FileList).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          compressImage(reader.result, (compressed) => {
            setUploadedImages((prev) => [...prev, compressed]);
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.description) return;

    const mainImageUrl = uploadedImages[coverIndex] || uploadedImages[0] || DEFAULT_STOCK;

    const payload: Project = {
      id: "proj-" + Date.now(),
      ...newProj,
      client: newProj.client || "Corporate Client",
      location: newProj.location || "Colombo",
      imageUrl: mainImageUrl,
      galleryUrls: uploadedImages.length > 0 ? uploadedImages : [mainImageUrl],
      specs: [
        { label: "Structural Grade", value: "ISO 9001 Structural Grade" },
        { label: "Engineering Division", value: newProj.category.toUpperCase() },
      ],
      isFeatured: true,
    };

    const ok = await db.updateProject(payload);
    if (ok) {
      setNewProj({
        title: "",
        category: services[0]?.category || "civil",
        client: "",
        location: "",
        cost: "LKR 80 Million",
        year: "2026",
        description: "",
      });
      setUploadedImages([]);
      setCoverIndex(0);
      onRefreshData();
      alert("New project added successfully!");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this project?")) {
      await db.deleteProject(id);
      onRefreshData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Add Form */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 pb-3">
          Add New Project Entry
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Field label="Title">
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Seaside Residencies High-Rise"
              value={newProj.title}
              onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                className={inputClass}
                value={newProj.category}
                onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.category}>{svc.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Commission Yr">
              <input
                type="text"
                className={inputClass}
                placeholder="2026"
                value={newProj.year}
                onChange={(e) => setNewProj({ ...newProj, year: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Budget Cost">
            <input
              type="text"
              className={inputClass}
              placeholder="LKR 120 Million"
              value={newProj.cost}
              onChange={(e) => setNewProj({ ...newProj, cost: e.target.value })}
            />
          </Field>

          <Field label="Client Name">
            <input
              type="text"
              className={inputClass}
              placeholder="Supreme Residencies Pvt Ltd"
              value={newProj.client}
              onChange={(e) => setNewProj({ ...newProj, client: e.target.value })}
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              className={inputClass}
              placeholder="Colombo 03"
              value={newProj.location}
              onChange={(e) => setNewProj({ ...newProj, location: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <textarea
              required
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Provide concrete grading specs, excavation metrics..."
              value={newProj.description}
              onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
            />
          </Field>

          {/* Image upload */}
          <div className="space-y-3 pt-2">
            <label className="text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase font-bold tracking-wider block">
              Gallery Attachments
            </label>

            <div className="border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-amber-500 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-905 flex flex-col items-center text-center cursor-pointer relative transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <UploadCloud className="h-6 w-6 text-zinc-400 mb-1" />
              <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                Drag & Drop or Browse
              </p>
              <p className="text-[9px] text-zinc-400 mt-0.5 font-mono">JPG, PNG. Auto-compressed.</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PREBUILT_STOCK_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.name}
                  onClick={() => setUploadedImages((prev) => [...prev, img.url])}
                  className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-[9px] text-zinc-600 dark:text-zinc-400 hover:text-amber-600 font-mono transition-colors cursor-pointer"
                >
                  + {img.name}
                </button>
              ))}
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCoverIndex(idx)}
                        className={`p-1 rounded-full ${coverIndex === idx ? "bg-amber-500 text-zinc-950" : "bg-zinc-900/90 text-zinc-350 hover:text-amber-400"}`}
                      >
                        <Star className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                          if (coverIndex === idx) setCoverIndex(0);
                        }}
                        className="p-1 rounded-full bg-zinc-900/90 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash className="h-3 w-3" />
                      </button>
                    </div>
                    {coverIndex === idx && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-black text-[7px] uppercase">
                        COVER
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold tracking-tight uppercase rounded-xl flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="h-4 w-4" />
            <span>SAVE NEW PROJECT</span>
          </button>
        </form>
      </div>

      {/* Projects Table */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200 dark:border-zinc-800">
          <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
            Active Projects Catalog ({projects.length} Entries)
          </h4>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-850 font-mono text-zinc-400 text-[10px]">
                <th className="p-4">Project Title</th>
                <th className="p-4">Division</th>
                <th className="p-4">Client</th>
                <th className="p-4">Valuation</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-905/30">
                  <td className="p-4">
                    <strong className="text-zinc-900 dark:text-zinc-50 block font-bold">{proj.title}</strong>
                    <span className="text-[10px] text-zinc-450 font-mono block mt-0.5">{proj.location}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase">
                      {proj.category}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-650 dark:text-zinc-300">{proj.client}</td>
                  <td className="p-4 font-mono font-bold uppercase text-zinc-800 dark:text-zinc-200">{proj.cost}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
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

// Shared helpers scoped to this file
const inputClass = "w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 font-medium text-xs focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-zinc-500 dark:text-zinc-400 font-bold uppercase block text-[10px] tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}