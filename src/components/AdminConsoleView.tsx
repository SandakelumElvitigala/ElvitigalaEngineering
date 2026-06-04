/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Locale,
  Project,
  Service,
  Testimonial,
  BOQSubmission,
  ContactSubmission,
  TeamMember,
  Milestone,
} from "../types";

import AdminHeader from "./admin/AdminHeader";
import AdminTabNav, { AdminTab } from "./admin/AdminTabNav";
import ProjectsTab from "./admin/ProjectsTab";
import ScopesTab from "./admin/ScopesTab";
import BOQsTab from "./admin/BOQsTab";
import TestimonialsTab from "./admin/TestimonialsTab";
import ContactsTab from "./admin/ContactsTab";
import SQLTab from "./admin/SQLTab";
import DeployTab from "./admin/DeployTab";
import TeamMembersTab from "./admin/TeamMembersTab";
import SiteSettingsTab from "./admin/SiteSettingsTab";
import MilestonesTab from "./admin/MilestoneTab";

interface AdminConsoleViewProps {
  locale: Locale;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  boqs: BOQSubmission[];
  contacts: ContactSubmission[];
  team: TeamMember[];
  milestones: Milestone[];
  onRefreshData: () => void;
}

export default function AdminConsoleView({
  locale,
  projects,
  services,
  testimonials,
  boqs,
  contacts,
  team,
  milestones,
  onRefreshData,
}: AdminConsoleViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <AdminHeader />

      <AdminTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          projects: projects.length,
          boqs: boqs.length,
          testimonials: testimonials.length,
          contacts: contacts.length,
        }}
      />

      {activeTab === "projects" && (
        <ProjectsTab
          projects={projects}
          services={services}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "scopes" && (
        <ScopesTab
          services={services}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "boqs" && (
        <BOQsTab
          boqs={boqs}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "testimonials" && (
        <TestimonialsTab
          testimonials={testimonials}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "contacts" && (
        <ContactsTab contacts={contacts} />
      )}

      {activeTab === "team" && (
        <TeamMembersTab
          members={team}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "milestones" && (
        <MilestonesTab
          milestones={milestones}
          onRefreshData={onRefreshData}
        />
      )}

      {activeTab === "settings" && <SiteSettingsTab />}

      {activeTab === "sql" && <SQLTab />}

      {activeTab === "deploy" && <DeployTab />}
    </div>
  );
}