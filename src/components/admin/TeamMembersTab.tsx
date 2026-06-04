/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TeamMember } from "../../types";
import { db } from "../../utils/db";
import { Plus, Trash, UploadCloud, Pencil, X, Check, Loader2 } from "lucide-react";

const compressImage = (base64Str: string, callback: (compressed: string) => void) => {
  const img = new Image();
  img.src = base64Str;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;
    const MAX_DIM = 600;
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
      callback(canvas.toDataURL("image/jpeg", 0.75));
    } else {
      callback(base64Str);
    }
  };
  img.onerror = () => callback(base64Str);
};

const PREBUILT_AVATAR_IMAGES = [
  { name: "Professional M1", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" },
  { name: "Professional F1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
  { name: "Professional M2", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" },
  { name: "Professional F2", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
  { name: "Engineer M",      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
];

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop";

const ROLE_PRESETS = [
  "Managing Director",
  "Chief Engineer",
  "Project Manager",
  "Site Supervisor",
  "Structural Engineer",
  "Quantity Surveyor",
  "Civil Engineer",
  "Interior Designer",
  "MEP Engineer",
  "HSE Officer",
];

interface TeamMembersTabProps {
  members?: TeamMember[];      // optional — tab self-fetches if not supplied
  onRefreshData?: () => void;  // optional — called after mutations so parent can sync
}

const EMPTY_FORM = { name: "", role: "", bio: "", email: "" };

export default function TeamMembersTab({
  members: membersProp,
  onRefreshData,
}: TeamMembersTabProps) {
  // ── self-managed data state ───────────────────────────────────────────────
  // The tab owns its own list so it always reflects the latest DB state,
  // regardless of whether the parent passes fresh data down.
  const [members, setMembers]   = useState<TeamMember[]>(membersProp ?? []);
  const [loading, setLoading]   = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await db.getTeam();
      setMembers(data ?? []);
    } catch (err) {
      console.error("TeamMembersTab: failed to fetch team", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and whenever the parent signals a refresh
  useEffect(() => {
    fetchMembers();
  }, []);

  // If parent provides fresh data (e.g. after its own refresh), sync it in
  useEffect(() => {
    if (membersProp && membersProp.length > 0) {
      setMembers(membersProp);
    }
  }, [membersProp]);

  // ── form state ────────────────────────────────────────────────────────────
  const [form, setForm]               = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);

  // ── image upload ──────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        compressImage(reader.result, setImagePreview);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── submit (add OR update) ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.bio || !form.email) return;

    const payload: TeamMember = {
      id: editingId ?? "member-" + Date.now(),
      ...form,
      imageUrl: imagePreview || DEFAULT_AVATAR,
    };

    setSaving(true);
    try {
      await db.updateTeamMember(payload);
      resetForm();
      await fetchMembers();          // re-fetch from DB to get ground truth
      onRefreshData?.();             // notify parent if wired
      alert(editingId ? "Team member updated!" : "Team member added successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImagePreview("");
    setEditingId(null);
  };

  const startEdit = (m: TeamMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio, email: m.email });
    setImagePreview(m.imageUrl);
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await db.deleteTeamMember(id);
      await fetchMembers();
      onRefreshData?.();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ── Add / Edit Form ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
          <h3 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-50">
            {editingId ? "Edit Team Member" : "Add New Team Member"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar upload */}
          <div className="space-y-3">
            <label className="text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase font-bold tracking-wider block">
              Profile Photo
            </label>

            <div className="flex items-start gap-3">
              {/* Preview */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Drop zone */}
              <div className="flex-1 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-amber-500 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-905 flex flex-col items-center text-center cursor-pointer relative transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <UploadCloud className="h-5 w-5 text-zinc-400 mb-1" />
                <p className="text-[9px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">
                  Upload Photo
                </p>
                <p className="text-[8px] text-zinc-400 mt-0.5 font-mono">JPG, PNG. Auto-compressed.</p>
              </div>
            </div>

            {/* Stock avatar presets */}
            <div className="flex flex-wrap gap-1.5">
              {PREBUILT_AVATAR_IMAGES.map((img) => (
                <button
                  type="button"
                  key={img.name}
                  onClick={() => setImagePreview(img.url)}
                  className={`px-2 py-1 rounded border text-[9px] font-mono transition-colors cursor-pointer ${
                    imagePreview === img.url
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-600"
                      : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-zinc-600 dark:text-zinc-400 hover:text-amber-600"
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <Field label="Full Name">
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Eng. Chamara Perera"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          {/* Role */}
          <Field label="Job Title / Role">
            <div className="space-y-1.5">
              <input
                type="text"
                required
                className={inputClass}
                placeholder="Chief Structural Engineer"
                value={form.role}
                list="role-presets"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <datalist id="role-presets">
                {ROLE_PRESETS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-1">
                {ROLE_PRESETS.slice(0, 5).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-[8px] text-zinc-500 hover:text-amber-600 hover:border-amber-500/40 font-mono transition-colors cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Field>

          {/* Email */}
          <Field label="Email Address">
            <input
              type="email"
              required
              className={inputClass}
              placeholder="chamara@company.lk"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          {/* Bio */}
          <Field label="Bio / Profile Summary">
            <textarea
              required
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Over 15 years of structural engineering experience specialising in high-rise concrete frame construction across the Western Province..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold tracking-tight uppercase rounded-xl flex items-center justify-center gap-2 mt-4 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <><Check className="h-4 w-4" /><span>SAVE CHANGES</span></>
            ) : (
              <><Plus className="h-4 w-4" /><span>ADD TEAM MEMBER</span></>
            )}
          </button>
        </form>
      </div>

      {/* ── Members Table ────────────────────────────────────────────────────── */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
            Team Directory ({members.length} Members)
          </h4>
          {loading && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Fetching…
            </span>
          )}
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-850 font-mono text-zinc-400 text-[10px]">
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4">Bio</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-850">
              {members.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400 font-mono text-[11px]">
                    No team members added yet. Use the form to add your first member.
                  </td>
                </tr>
              )}
              {members.map((member) => (
                <tr
                  key={member.id}
                  className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-905/30 transition-colors ${
                    editingId === member.id ? "bg-amber-500/5 dark:bg-amber-500/5" : ""
                  }`}
                >
                  {/* Avatar + Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 flex-shrink-0">
                        <img
                          src={member.imageUrl || DEFAULT_AVATAR}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <strong className="text-zinc-900 dark:text-zinc-50 font-bold leading-tight">
                        {member.name}
                      </strong>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase whitespace-nowrap">
                      {member.role}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="p-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 font-mono text-[10px] transition-colors"
                    >
                      {member.email}
                    </a>
                  </td>

                  {/* Bio — truncated */}
                  <td className="p-4 max-w-[220px]">
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {member.bio}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => startEdit(member)}
                        className="p-1.5 rounded hover:bg-amber-500/10 text-zinc-400 hover:text-amber-500 transition-colors"
                        title="Edit member"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete member"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
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

// ── Shared helpers ────────────────────────────────────────────────────────────
const inputClass =
  "w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 font-medium text-xs focus:outline-none focus:border-amber-500/50 transition-colors";

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