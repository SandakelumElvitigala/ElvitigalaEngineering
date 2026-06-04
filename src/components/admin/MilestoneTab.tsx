import React, { useEffect, useState } from "react";
import { AddMilestone, Milestone } from "../../types";
import { db } from "../../utils/db";
import { Plus, Trash, Pencil, X, Check, Loader2 } from "lucide-react";

interface MilestonesTabProps {
  milestones?: Milestone[];
  onRefreshData?: () => void;
}

const EMPTY_FORM = {
  year: "",
  title: "",
  description: "",
};

export default function MilestonesTab({
  milestones: milestonesProp,
  onRefreshData,
}: MilestonesTabProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(
    milestonesProp ?? [],
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const fetchMilestones = async () => {
    setLoading(true);

    try {
      const data = await db.getMilestones();
      setMilestones(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  useEffect(() => {
    if (milestonesProp) {
      setMilestones(milestonesProp);
    }
  }, [milestonesProp]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (m: Milestone) => {
    setEditingId(m.id);

    setForm({
      year: m.year,
      title: m.title,
      description: m.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.year || !form.title || !form.description) {
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await db.updateMilestone({
          id: editingId,
          year: form.year,
          title: form.title,
          description: form.description,
        });
      } else {
        await db.addMilestone({
          year: form.year,
          title: form.title,
          description: form.description,
        });
      }

      resetForm();

      await fetchMilestones();

      onRefreshData?.();

      alert(editingId ? "Milestone updated!" : "Milestone added!");
    } catch (err) {
      console.error(err);
      alert("Failed to save milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this milestone?")) return;

    try {
      await db.deleteMilestone(id);

      await fetchMilestones();

      onRefreshData?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* FORM */}

      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
          <h3 className="font-sans font-extrabold text-base">
            {editingId ? "Edit Milestone" : "Add Milestone"}
          </h3>

          {editingId && (
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Year">
            <input
              required
              value={form.year}
              className={inputClass}
              placeholder="2025"
              onChange={(e) =>
                setForm({
                  ...form,
                  year: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Title">
            <input
              required
              value={form.title}
              className={inputClass}
              placeholder="ISO Certification"
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Description">
            <textarea
              required
              rows={5}
              value={form.description}
              className={`${inputClass} resize-none`}
              placeholder="Milestone description..."
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <>
                <Check className="h-4 w-4" />
                SAVE CHANGES
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                ADD MILESTONE
              </>
            )}
          </button>
        </form>
      </div>

      {/* TABLE */}

      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
          <h4 className="text-xs font-mono font-bold uppercase">
            Timeline Milestones ({milestones.length})
          </h4>

          {loading && (
            <span className="flex items-center gap-2 text-[10px]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Fetching...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b">
                <th className="p-4">Year</th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {milestones.map((milestone) => (
                <tr
                  key={milestone.id}
                  className="border-b border-zinc-200 dark:border-zinc-850"
                >
                  <td className="p-4 font-mono font-bold text-amber-500">
                    {milestone.year}
                  </td>

                  <td className="p-4 font-semibold">{milestone.title}</td>

                  <td className="p-4">
                    <p className="line-clamp-2 text-zinc-500">
                      {milestone.description}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => startEdit(milestone)}
                        className="p-1.5 rounded hover:bg-amber-500/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(milestone.id)}
                        className="p-1.5 rounded hover:bg-red-500/10"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {milestones.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400">
                    No milestones found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-xs";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
