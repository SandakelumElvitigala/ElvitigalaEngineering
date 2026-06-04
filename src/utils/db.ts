/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import {
  Project,
  Service,
  TeamMember,
  Testimonial,
  BOQSubmission,
  ContactSubmission,
  SiteSettings,
  Milestone,
} from "../types";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ==========================================
// SEED DATA
// ==========================================

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "Elvitigala Engineering Pvt Ltd",
  companyEmail: "info@elvitigala.lk",
  companyPhone: "+94 11 285 4120",
  address: "No. 345, Elvitigala Mawatha, Colombo 05, Sri Lanka",
  tagline: "Precision Concrete. Formidable Steel. Inspired Spaces.",
  experienceYears: 28,
  projectsCount: 15,
  teamCount: 12,
  maintenanceMode: false,
};

// ==========================================
// LOCAL STORAGE INIT
// ==========================================

export const initializeLocalDB = () => {
  if (!localStorage.getItem("ee_boqs")) {
    localStorage.setItem("ee_boqs", JSON.stringify([]));
  }
  if (!localStorage.getItem("ee_contacts")) {
    localStorage.setItem("ee_contacts", JSON.stringify([]));
  }
};

// ==========================================
// DB ACTIONS
// ==========================================

export const db = {
  // ── Services ────────────────────────────────────────────────────────────

  getServices: async (): Promise<Service[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("title");
        if (error) {
          console.error("Supabase getServices error:", error);
        } else {
          return (data ?? []).map(
            (s: any): Service => ({
              id: s.id,
              title: s.title || "",
              category: s.category || "",
              icon: s.icon || "Wrench",
              shortDesc: s.shortDesc || s.short_desc || s.shortdesc || "",
              longDesc: s.longDesc || s.long_desc || s.longdesc || "",
              features: Array.isArray(s.features) ? s.features : [],
            }),
          );
        }
      } catch (err) {
        console.warn("Supabase getServices network failure, using cache:", err);
      }
    }
    return JSON.parse(localStorage.getItem("ee_services") || "[]");
  },

  updateService: async (service: Service): Promise<boolean> => {
    const services = JSON.parse(localStorage.getItem("ee_services") || "[]");
    const idx = services.findIndex((s: Service) => s.id === service.id);
    if (idx !== -1) {
      services[idx] = service;
    } else {
      services.push(service);
    }
    localStorage.setItem("ee_services", JSON.stringify(services));

    if (supabase) {
      try {
        const { error: e1 } = await supabase.from("services").upsert(service);
        if (!e1) return true;
        const { error: e2 } = await supabase.from("services").upsert({
          id: service.id,
          title: service.title,
          category: service.category,
          icon: service.icon,
          short_desc: service.shortDesc,
          long_desc: service.longDesc,
          features: service.features,
        });
        if (!e2) return true;
        const { error: e3 } = await supabase.from("services").upsert({
          id: service.id,
          title: service.title,
          category: service.category,
          icon: service.icon,
          shortdesc: service.shortDesc,
          longdesc: service.longDesc,
          features: service.features,
        });
        if (!e3) return true;
        console.error(
          "All 3 column styles failed for service upsert:",
          e1,
          e2,
          e3,
        );
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  },

  deleteService: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (!error) {
          const services = JSON.parse(
            localStorage.getItem("ee_services") || "[]",
          );
          localStorage.setItem(
            "ee_services",
            JSON.stringify(services.filter((s: Service) => s.id !== id)),
          );
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const services = JSON.parse(localStorage.getItem("ee_services") || "[]");
    localStorage.setItem(
      "ee_services",
      JSON.stringify(services.filter((s: Service) => s.id !== id)),
    );
    return true;
  },

  // ── Projects ─────────────────────────────────────────────────────────────

  getProjects: async (): Promise<Project[]> => {
    const normalizeProject = (p: any): Project => {
      const imgUrl =
        p.imageUrl ||
        p.image_url ||
        p.imageurl ||
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop";
      const gallery = p.galleryUrls ||
        p.gallery_urls ||
        p.galleryurls || [imgUrl];
      const featured =
        p.isFeatured !== undefined
          ? p.isFeatured
          : p.is_featured !== undefined
            ? p.is_featured
            : p.isfeatured !== undefined
              ? p.isfeatured
              : false;
      return {
        id: p.id,
        title: p.title || "",
        category: p.category || "construction",
        client: p.client || "",
        location: p.location || "",
        cost: p.cost || "",
        year: p.year || "",
        description: p.description || "",
        imageUrl: imgUrl,
        galleryUrls: Array.isArray(gallery) ? gallery : [gallery],
        specs: Array.isArray(p.specs) ? p.specs : [],
        isFeatured: featured,
      };
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("year", { ascending: false });
        if (error) {
          console.error("Supabase getProjects error:", error);
        } else {
          const cloudProjects = (data ?? []).map(normalizeProject);
          localStorage.setItem("ee_projects", JSON.stringify(cloudProjects));
          return cloudProjects;
        }
      } catch (err) {
        console.warn("Supabase getProjects network failure, using cache:", err);
      }
    }
    return JSON.parse(localStorage.getItem("ee_projects") || "[]");
  },

  updateProject: async (project: Project): Promise<boolean> => {
    const projects = JSON.parse(localStorage.getItem("ee_projects") || "[]");
    const idx = projects.findIndex((p: Project) => p.id === project.id);
    if (idx !== -1) {
      projects[idx] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem("ee_projects", JSON.stringify(projects));

    if (supabase) {
      try {
        const { error: e1 } = await supabase.from("projects").upsert(project);
        if (!e1) return true;
        const { error: e2 } = await supabase.from("projects").upsert({
          id: project.id,
          title: project.title,
          category: project.category,
          client: project.client,
          location: project.location,
          cost: project.cost,
          year: project.year,
          description: project.description,
          image_url: project.imageUrl,
          gallery_urls: project.galleryUrls,
          specs: project.specs,
          is_featured: project.isFeatured,
        });
        if (!e2) return true;
        const { error: e3 } = await supabase.from("projects").upsert({
          id: project.id,
          title: project.title,
          category: project.category,
          client: project.client,
          location: project.location,
          cost: project.cost,
          year: project.year,
          description: project.description,
          imageurl: project.imageUrl,
          galleryurls: project.galleryUrls,
          specs: project.specs,
          isfeatured: project.isFeatured,
        });
        if (!e3) return true;
        console.error(
          "All 3 column styles failed for project upsert:",
          e1,
          e2,
          e3,
        );
      } catch (err) {
        console.error("Supabase project update threw exception.", err);
      }
    }
    return true;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) console.error("Supabase deleteProject error:", error);
      } catch (err) {
        console.error("Supabase project delete threw exception:", err);
      }
    }
    const projects = JSON.parse(localStorage.getItem("ee_projects") || "[]");
    localStorage.setItem(
      "ee_projects",
      JSON.stringify(projects.filter((p: Project) => p.id !== id)),
    );
    return true;
  },

  // ── Team ─────────────────────────────────────────────────────────────────

  getTeam: async (): Promise<TeamMember[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from("team_members").select("*");
        if (error) {
          console.error("Supabase getTeam error:", error);
        } else {
          return (data ?? []).map(
            (t: any): TeamMember => ({
              id: t.id,
              name: t.name || "",
              role: t.role || "",
              bio: t.bio || "",
              imageUrl: t.imageUrl || t.image_url || t.imageurl || "",
              email: t.email || "",
            }),
          );
        }
      } catch (err) {
        console.warn("Supabase getTeam network failure, using cache:", err);
      }
    }
    return JSON.parse(localStorage.getItem("ee_team") || "[]");
  },

  updateTeamMember: async (member: TeamMember): Promise<boolean> => {
    const team = JSON.parse(localStorage.getItem("ee_team") || "[]");
    const idx = team.findIndex((t: TeamMember) => t.id === member.id);
    if (idx !== -1) {
      team[idx] = member;
    } else {
      team.push(member);
    }
    localStorage.setItem("ee_team", JSON.stringify(team));

    if (supabase) {
      try {
        const { error: e1 } = await supabase
          .from("team_members")
          .upsert(member);
        if (!e1) return true;
        const { error: e2 } = await supabase.from("team_members").upsert({
          id: member.id,
          name: member.name,
          role: member.role,
          bio: member.bio,
          image_url: member.imageUrl,
          email: member.email,
        });
        if (!e2) return true;
        const { error: e3 } = await supabase.from("team_members").upsert({
          id: member.id,
          name: member.name,
          role: member.role,
          bio: member.bio,
          imageurl: member.imageUrl,
          email: member.email,
        });
        if (!e3) return true;
        console.error(
          "All 3 column styles failed for team member upsert:",
          e1,
          e2,
          e3,
        );
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  },

  deleteTeamMember: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("team_members")
          .delete()
          .eq("id", id);
        if (!error) {
          const team = JSON.parse(localStorage.getItem("ee_team") || "[]");
          localStorage.setItem(
            "ee_team",
            JSON.stringify(team.filter((t: TeamMember) => t.id !== id)),
          );
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const team = JSON.parse(localStorage.getItem("ee_team") || "[]");
    localStorage.setItem(
      "ee_team",
      JSON.stringify(team.filter((t: TeamMember) => t.id !== id)),
    );
    return true;
  },

  // --- Milestones ----------------------------------------------------------
  getMilestones: async (): Promise<Milestone[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("milestoners")
      .select("*")
      .order("year", { ascending: true });

    if (error) {
      console.error(error);
      return [];
    }

    return (data ?? []).map((m: any) => ({
      id: m.id,
      year: m.year,
      title: m.title,
      description: m.description,
    }));
  },

  addMilestone: async (milestone: Omit<Milestone, "id">): Promise<boolean> => {
    if (!supabase) return false;

    const { error } = await supabase.from("milestoners").insert({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
    });

    return !error;
  },

  updateMilestone: async (milestone: Milestone): Promise<boolean> => {
    if (!supabase) return false;
    console.log("Updating milestone:", milestone);

    const { error } = await supabase
      .from("milestoners")
      .update({
        year: milestone.year,
        title: milestone.title,
        description: milestone.description,
      })
      .eq("id", milestone.id);

    console.log(error);

    return !error;
  },

  deleteMilestone: async (id: string): Promise<boolean> => {
    if (!supabase) return false;

    const { error } = await supabase.from("milestoners").delete().eq("id", id);

    return !error;
  },

  // ── Testimonials ──────────────────────────────────────────────────────────

  getTestimonials: async (): Promise<Testimonial[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from("testimonials").select("*");
        if (error) {
          console.error("Supabase getTestimonials error:", error);
        } else {
          return (data ?? []).map(
            (t: any): Testimonial => ({
              id: t.id,
              name: t.name || "",
              company: t.company || "",
              rating: t.rating || 5,
              comment: t.comment || "",
              date: t.date || "2026",
              isApproved:
                t.isApproved !== undefined
                  ? t.isApproved
                  : t.is_approved !== undefined
                    ? t.is_approved
                    : t.isapproved !== undefined
                      ? t.isapproved
                      : false,
            }),
          );
        }
      } catch (err) {
        console.warn(
          "Supabase getTestimonials network failure, using cache:",
          err,
        );
      }
    }
    return JSON.parse(localStorage.getItem("ee_testimonials") || "[]");
  },

  updateTestimonial: async (test: Testimonial): Promise<boolean> => {
    const testimonials = JSON.parse(
      localStorage.getItem("ee_testimonials") || "[]",
    );
    const idx = testimonials.findIndex((t: Testimonial) => t.id === test.id);
    if (idx !== -1) {
      testimonials[idx] = test;
    } else {
      testimonials.push(test);
    }
    localStorage.setItem("ee_testimonials", JSON.stringify(testimonials));

    if (supabase) {
      try {
        const { error: e1 } = await supabase.from("testimonials").upsert(test);
        if (!e1) return true;
        const { error: e2 } = await supabase.from("testimonials").upsert({
          id: test.id,
          name: test.name,
          company: test.company,
          rating: test.rating,
          comment: test.comment,
          date: test.date,
          is_approved: test.isApproved,
        });
        if (!e2) return true;
        const { error: e3 } = await supabase.from("testimonials").upsert({
          id: test.id,
          name: test.name,
          company: test.company,
          rating: test.rating,
          comment: test.comment,
          date: test.date,
          isapproved: test.isApproved,
        });
        if (!e3) return true;
        console.error(
          "All 3 styles failed for testimonial upsert:",
          e1,
          e2,
          e3,
        );
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  },

  deleteTestimonial: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", id);
        if (!error) {
          const testimonials = JSON.parse(
            localStorage.getItem("ee_testimonials") || "[]",
          );
          localStorage.setItem(
            "ee_testimonials",
            JSON.stringify(
              testimonials.filter((t: Testimonial) => t.id !== id),
            ),
          );
          return true;
        }
      } catch (err) {
        console.error(err);
      }
    }
    const testimonials = JSON.parse(
      localStorage.getItem("ee_testimonials") || "[]",
    );
    localStorage.setItem(
      "ee_testimonials",
      JSON.stringify(testimonials.filter((t: Testimonial) => t.id !== id)),
    );
    return true;
  },

  // ── Site Settings ─────────────────────────────────────────────────────────

  getSiteSettings: async (): Promise<SiteSettings | null> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();
        if (!error && data) {
          return {
            companyName: data.company_name ?? data.companyName ?? "",
            companyEmail: data.company_email ?? data.companyEmail ?? "",
            companyPhone: data.company_phone ?? data.companyPhone ?? "",
            address: data.address ?? "",
            tagline: data.tagline ?? "",
            experienceYears: data.experience_years ?? data.experienceYears ?? 0,
            projectsCount: data.projects_count ?? data.projectsCount ?? 0,
            teamCount: data.team_count ?? data.teamCount ?? 0,
            maintenanceMode:
              data.maintenance_mode ?? data.maintenanceMode ?? false,
          };
        }
      } catch (err) {
        console.warn(
          "getSiteSettings network failure, using localStorage:",
          err,
        );
      }
    }
    return JSON.parse(localStorage.getItem("ee_site_settings") || "null");
  },

  updateSiteSettings: async (s: SiteSettings): Promise<boolean> => {
    localStorage.setItem("ee_site_settings", JSON.stringify(s));
    if (supabase) {
      try {
        const { error: e1 } = await supabase
          .from("site_settings")
          .upsert({ id: 1, ...s });
        if (!e1) return true;
        const { error: e2 } = await supabase.from("site_settings").upsert({
          id: 1,
          company_name: s.companyName,
          company_email: s.companyEmail,
          company_phone: s.companyPhone,
          address: s.address,
          tagline: s.tagline,
          experience_years: s.experienceYears,
          projects_count: s.projectsCount,
          team_count: s.teamCount,
          maintenance_mode: s.maintenanceMode,
        });
        if (!e2) return true;
        console.error("updateSiteSettings: both column styles failed", e1, e2);
      } catch (err) {
        console.error("updateSiteSettings:", err);
      }
    }
    return true;
  },

  // ── Contacts ──────────────────────────────────────────────────────────────

  getContacts: async (): Promise<ContactSubmission[]> => {
    initializeLocalDB();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*");
        if (error) {
          console.error("Supabase getContacts error:", error);
        } else {
          return (data ?? []).map(
            (c: any): ContactSubmission => ({
              id: c.id,
              name: c.name || "",
              email: c.email || "",
              phone: c.phone || "",
              subject: c.subject || "",
              message: c.message || "",
              isResponded:
                c.isResponded !== undefined
                  ? c.isResponded
                  : c.is_responded !== undefined
                    ? c.is_responded
                    : c.isresponded !== undefined
                      ? c.isresponded
                      : false,
              submittedAt:
                c.submittedAt ||
                c.submitted_at ||
                c.submittedat ||
                new Date().toISOString(),
              adminNotes: c.adminNotes || c.admin_notes || c.adminnotes || "",
            }),
          );
        }
      } catch (err) {
        console.warn("Supabase getContacts network failure, using cache:", err);
      }
    }
    return JSON.parse(localStorage.getItem("ee_contacts") || "[]");
  },

  submitContact: async (
    contact: Omit<ContactSubmission, "id" | "submittedAt" | "isResponded">,
  ): Promise<ContactSubmission> => {
    initializeLocalDB();
    const newContact: ContactSubmission = {
      ...contact,
      id: "contact-" + Date.now(),
      submittedAt: new Date().toISOString(),
      isResponded: false,
    };
    const contacts = JSON.parse(localStorage.getItem("ee_contacts") || "[]");
    contacts.unshift(newContact);
    localStorage.setItem("ee_contacts", JSON.stringify(contacts));

    if (supabase) {
      try {
        const { data: d1, error: e1 } = await supabase
          .from("contact_submissions")
          .insert(newContact)
          .select()
          .single();
        if (!e1 && d1) return d1 as ContactSubmission;
        const { data: d2, error: e2 } = await supabase
          .from("contact_submissions")
          .insert({
            id: newContact.id,
            name: newContact.name,
            email: newContact.email,
            phone: newContact.phone,
            subject: newContact.subject,
            message: newContact.message,
            is_responded: newContact.isResponded,
            submitted_at: newContact.submittedAt,
            admin_notes: newContact.adminNotes,
          })
          .select()
          .single();
        if (!e2 && d2) return { ...newContact, ...d2 };
        console.error("All styles failed for submitContact insert:", e1, e2);
      } catch (err) {
        console.warn(err);
      }
    }
    return newContact;
  },

  updateContact: async (contact: ContactSubmission): Promise<boolean> => {
    const contacts = JSON.parse(localStorage.getItem("ee_contacts") || "[]");
    const idx = contacts.findIndex(
      (c: ContactSubmission) => c.id === contact.id,
    );
    if (idx !== -1) {
      contacts[idx] = contact;
      localStorage.setItem("ee_contacts", JSON.stringify(contacts));
    }

    if (supabase) {
      try {
        const { error: e1 } = await supabase
          .from("contact_submissions")
          .upsert(contact);
        if (!e1) return true;
        const { error: e2 } = await supabase
          .from("contact_submissions")
          .upsert({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            subject: contact.subject,
            message: contact.message,
            is_responded: contact.isResponded,
            submitted_at: contact.submittedAt,
            admin_notes: contact.adminNotes,
          });
        if (!e2) return true;
        console.error("All styles failed for updateContact upsert:", e1, e2);
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  },

  // ── BOQ Submissions ───────────────────────────────────────────────────────

  getBOQs: async (): Promise<BOQSubmission[]> => {
    initializeLocalDB();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("boq_submissions")
          .select("*")
          .order("submittedAt", { ascending: false });

        if (error) {
          console.error("Supabase getBOQs error:", error);
        } else {
          return (data ?? []).map(
            (b: any): BOQSubmission => ({
              id: b.id ?? "",
              clientName: b.clientName ?? "",
              clientEmail: b.clientEmail ?? "",
              clientPhone: b.clientPhone ?? "",
              projectType: b.projectType ?? "",
              notes: b.notes ?? "",

              fileName: b.fileName ?? "no-file",
              storagePath: b.storagePath ?? "",

              mappedItems: Array.isArray(b.mappedItems) ? b.mappedItems : [],

              totalEstimate: Number(b.totalEstimate ?? 0),
              status: b.status ?? "pending",
              quoteUrl: b.quoteUrl ?? "",
              submittedAt: b.submittedAt ?? new Date().toISOString(),
              adminNote: b.adminNote ?? "",
              logs: Array.isArray(b.logs) ? b.logs : [],
            }),
          );
        }
      } catch (err) {
        console.warn("Supabase getBOQs network failure:", err);
      }
    }

    return JSON.parse(localStorage.getItem("ee_boqs") || "[]");
  },

  submitBOQ: async (
    boq: Omit<BOQSubmission, "id" | "status" | "submittedAt" | "logs">,
  ): Promise<BOQSubmission> => {
    initializeLocalDB();
    const timestamp = new Date().toISOString();

    const newBoq: BOQSubmission = {
      ...boq,
      notes: boq.notes ?? "",
      quoteUrl: boq.quoteUrl ?? "",
      adminNote: boq.adminNote ?? "",
      id: "boq-" + Date.now(),
      status: "pending",
      submittedAt: timestamp,
      logs: [
        {
          timestamp,
          action: "Submission Received",
          note: "BOQ request submitted via client portal.",
        },
      ],
    };

    try {
      const boqs = JSON.parse(localStorage.getItem("ee_boqs") || "[]");
      boqs.unshift(newBoq);
      localStorage.setItem("ee_boqs", JSON.stringify(boqs));
    } catch (err) {
      console.warn("Local storage quota exceeded:", err);
    }

    if (supabase) {
      try {
        const { error } = await supabase.from("boq_submissions").insert({
          id: newBoq.id,
          clientName: newBoq.clientName,
          clientEmail: newBoq.clientEmail,
          clientPhone: newBoq.clientPhone,
          projectType: newBoq.projectType,
          notes: newBoq.notes,
          fileName: newBoq.fileName,
          storagePath: newBoq.storagePath ?? "", // ← now reliably set by caller
          fileUrl: newBoq.fileUrl ?? "",
          mappedItems: newBoq.mappedItems,
          totalEstimate: newBoq.totalEstimate,
          status: newBoq.status,
          quoteUrl: newBoq.quoteUrl,
          submittedAt: newBoq.submittedAt,
          adminNote: newBoq.adminNote,
          logs: newBoq.logs,
        });

        if (error) {
          console.error("Supabase submitBOQ insert error:", error);
          // Return local record — don't throw, user already saved to localStorage
          return newBoq;
        }
      } catch (err) {
        console.warn("Supabase submitBOQ threw exception:", err);
      }
    }

    return newBoq;
  },

  updateBOQ: async (boq: BOQSubmission): Promise<boolean> => {
    const boqs = JSON.parse(localStorage.getItem("ee_boqs") || "[]");
    const idx = boqs.findIndex((b: BOQSubmission) => b.id === boq.id);
    if (idx !== -1) {
      boqs[idx] = boq;
      localStorage.setItem("ee_boqs", JSON.stringify(boqs));
    }

    if (supabase) {
      try {
        const { error } = await supabase.from("boq_submissions").upsert({
          id: boq.id,
          clientName: boq.clientName,
          clientEmail: boq.clientEmail,
          clientPhone: boq.clientPhone,
          projectType: boq.projectType,
          notes: boq.notes ?? "",

          fileName: boq.fileName,
          storagePath: boq.storagePath ?? "",

          mappedItems: boq.mappedItems,
          totalEstimate: boq.totalEstimate,
          status: boq.status,
          quoteUrl: boq.quoteUrl ?? "",
          submittedAt: boq.submittedAt,
          adminNote: boq.adminNote ?? "",
          logs: boq.logs,
        });

        if (error) {
          console.error("Supabase updateBOQ upsert error:", error);
        } else {
          return true;
        }
      } catch (err) {
        console.error("Supabase updateBOQ threw exception:", err);
      }
    }

    return true;
  },

  // ── Settings (alias used by some admin panels) ────────────────────────────

  getSettings: async (): Promise<SiteSettings> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .single();
        if (error) {
          console.error("Supabase getSettings error:", error);
        } else if (data) {
          return {
            companyName:
              data.companyName ||
              data.company_name ||
              data.companyname ||
              DEFAULT_SETTINGS.companyName,
            companyEmail:
              data.companyEmail ||
              data.company_email ||
              data.companyemail ||
              DEFAULT_SETTINGS.companyEmail,
            companyPhone:
              data.companyPhone ||
              data.company_phone ||
              data.companyphone ||
              DEFAULT_SETTINGS.companyPhone,
            address: data.address || DEFAULT_SETTINGS.address,
            tagline: data.tagline || DEFAULT_SETTINGS.tagline,
            experienceYears: Number(
              data.experienceYears ||
                data.experience_years ||
                data.experienceyears ||
                DEFAULT_SETTINGS.experienceYears,
            ),
            projectsCount: Number(
              data.projectsCount ||
                data.projects_count ||
                data.projectscount ||
                DEFAULT_SETTINGS.projectsCount,
            ),
            teamCount: Number(
              data.teamCount ||
                data.team_count ||
                data.teamcount ||
                DEFAULT_SETTINGS.teamCount,
            ),
            maintenanceMode:
              data.maintenanceMode !== undefined
                ? data.maintenanceMode
                : data.maintenance_mode !== undefined
                  ? data.maintenance_mode
                  : data.maintenancemode !== undefined
                    ? data.maintenancemode
                    : DEFAULT_SETTINGS.maintenanceMode,
          };
        }
      } catch (err) {
        console.warn("Supabase getSettings network failure, using cache:", err);
      }
    }
    return JSON.parse(
      localStorage.getItem("ee_settings") || JSON.stringify(DEFAULT_SETTINGS),
    );
  },

  saveSettings: async (settings: SiteSettings): Promise<boolean> => {
    localStorage.setItem("ee_settings", JSON.stringify(settings));
    if (supabase) {
      try {
        const { error: e1 } = await supabase
          .from("site_settings")
          .upsert({ id: "config", ...settings });
        if (!e1) return true;
        const { error: e2 } = await supabase.from("site_settings").upsert({
          id: "config",
          company_name: settings.companyName,
          company_email: settings.companyEmail,
          company_phone: settings.companyPhone,
          address: settings.address,
          tagline: settings.tagline,
          experience_years: settings.experienceYears,
          projects_count: settings.projectsCount,
          team_count: settings.teamCount,
          maintenance_mode: settings.maintenanceMode,
        });
        if (!e2) return true;
        const { error: e3 } = await supabase.from("site_settings").upsert({
          id: "config",
          companyname: settings.companyName,
          companyemail: settings.companyEmail,
          companyphone: settings.companyPhone,
          address: settings.address,
          tagline: settings.tagline,
          experienceyears: settings.experienceYears,
          projectscount: settings.projectsCount,
          teamcount: settings.teamCount,
          maintenancemode: settings.maintenanceMode,
        });
        if (!e3) return true;
        console.error(
          "All 3 styles failed for saveSettings upsert:",
          e1,
          e2,
          e3,
        );
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  },
};

// ==========================================
// SQL SCHEMA BLUEPRINT
// ==========================================

export const SQL_SCHEMA_BLUEPRINT = `-- SQL Script for Supabase PostgreSQL Database Setup
-- Elvitigala Engineering Pvt Ltd

-- 1. PROJECTS TABLE
create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  client text not null,
  location text not null,
  cost text not null,
  year text not null,
  description text not null,
  "imageUrl" text not null,
  "galleryUrls" text[] default '{}',
  specs jsonb default '[]'::jsonb,
  "isFeatured" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SERVICES TABLE
create table if not exists public.services (
  id text primary key,
  title text not null,
  category text not null,
  "shortDesc" text not null,
  "longDesc" text not null,
  icon text not null,
  features text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TEAM MEMBERS TABLE
create table if not exists public.team_members (
  id text primary key,
  name text not null,
  role text not null,
  bio text not null,
  "imageUrl" text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TESTIMONIALS TABLE
create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  company text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text not null,
  date text not null,
  "isApproved" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CONTACT SUBMISSIONS TABLE
create table if not exists public.contact_submissions (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  "isResponded" boolean default false,
  "submittedAt" text not null,
  "adminNotes" text
);

-- 6. BOQ SUBMISSIONS TABLE
create table if not exists public.boq_submissions (
  id text primary key,
  "clientName" text not null,
  "clientEmail" text not null,
  "clientPhone" text not null,
  "projectType" text not null,
  notes text default '',
  "fileName" text not null default 'no-file',
  "rawCsvContent" text default '',
  "mappedItems" jsonb not null default '[]'::jsonb,
  "totalEstimate" numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'quoting', 'completed', 'declined')),
  "quoteUrl" text default '',
  "submittedAt" text not null,
  "adminNote" text default '',
  logs jsonb default '[]'::jsonb
);

-- Add notes column if table already exists (idempotent)
alter table public.boq_submissions
  add column if not exists notes text default '';

-- 7. SITE SETTINGS TABLE
create table if not exists public.site_settings (
  id text primary key default 'config',
  "companyName" text default 'Elvitigala Engineering Pvt Ltd',
  "companyEmail" text default 'info@elvitigala.lk',
  "companyPhone" text default '+94 11 285 4120',
  address text,
  tagline text,
  "experienceYears" integer default 28,
  "projectsCount" integer default 15,
  "teamCount" integer default 12,
  "maintenanceMode" boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
`;

export const RLS_POLICIES_BLUEPRINT = `-- ROW LEVEL SECURITY POLICIES

alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.boq_submissions enable row level security;
alter table public.site_settings enable row level security;

-- Public read
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read services" on public.services for select using (true);
create policy "Public read team_members" on public.team_members for select using (true);
create policy "Public read approved testimonials" on public.testimonials for select using ("isApproved" = true);
create policy "Public read site settings" on public.site_settings for select using (true);

-- Public write (lead capture)
create policy "Public insert contacts" on public.contact_submissions for insert with check (true);
create policy "Public insert boqs" on public.boq_submissions for insert with check (true);
create policy "Public insert testimonials" on public.testimonials for insert with check (true);

-- Admin full access
create policy "Admin all projects" on public.projects for all using (auth.jwt() ->> 'role' = 'service_role' or auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin all services" on public.services for all using (auth.jwt() ->> 'role' = 'service_role' or auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin all team_members" on public.team_members for all using (auth.jwt() ->> 'role' = 'service_role' or auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin all testimonials" on public.testimonials for all using (auth.jwt() ->> 'role' = 'service_role' or auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin all contacts" on public.contact_submissions for all using (auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin all boqs" on public.boq_submissions for all using (auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
create policy "Admin site settings" on public.site_settings for all using (auth.jwt() -> 'user_metadata' ->> 'isAdmin' = 'true');
`;
