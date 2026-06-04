/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FolderGit,
  Calculator,
  MessageSquare,
  HardHat,
  Database,
  Footprints,
  Settings,
  Users,
  Settings2,
} from "lucide-react";

export type AdminTab =
  | "projects"
  | "scopes"
  | "boqs"
  | "testimonials"
  | "contacts"
  | "team"
  | "milestones"
  | "sql"
  | "deploy"
  | "settings";

interface AdminTabNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    projects: number;
    boqs: number;
    testimonials: number;
    contacts: number;
  };
}

export default function AdminTabNav({
  activeTab,
  onTabChange,
  counts,
}: AdminTabNavProps) {
  const tabClass = (tab: AdminTab) =>
    `px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
      activeTab === tab
        ? "bg-amber-500 text-white"
        : "text-zinc-500 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-850 pb-2">
      <button
        onClick={() => onTabChange("projects")}
        className={tabClass("projects")}
      >
        <FolderGit className="h-3.5 w-3.5" />
        <span>Projects CRUD ({counts.projects})</span>
      </button>

      <button onClick={() => onTabChange("boqs")} className={tabClass("boqs")}>
        <Calculator className="h-3.5 w-3.5" />
        <span>BOQ Submissions ({counts.boqs})</span>
      </button>

      <button
        onClick={() => onTabChange("testimonials")}
        className={tabClass("testimonials")}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>Review Moderation ({counts.testimonials})</span>
      </button>

      <button
        onClick={() => onTabChange("contacts")}
        className={tabClass("contacts")}
      >
        <HardHat className="h-3.5 w-3.5" />
        <span>Contact Leads ({counts.contacts})</span>
      </button>

      <button onClick={() => onTabChange("team")} className={tabClass("team")}>
        <Users className="h-3.5 w-3.5" />
        <span>Team Members</span>
      </button>

      <button onClick={() => onTabChange("milestones")} className={tabClass("milestones")}>
        <Footprints className="h-3.5 w-3.5" />
        <span>Milestones</span>
      </button>

      <button onClick={() => onTabChange("sql")} className={tabClass("sql")}>
        <Database className="h-3.5 w-3.5" />
        <span>Supabase SQL Scripts</span>
      </button>

      <button
        onClick={() => onTabChange("deploy")}
        className={tabClass("deploy")}
      >
        <Settings className="h-3.5 w-3.5" />
        <span>CI Deploy Guides</span>
      </button>

      <button
        onClick={() => onTabChange("settings")}
        className={tabClass("settings")}
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span>Site Settings</span>
      </button>
    </div>
  );
}
