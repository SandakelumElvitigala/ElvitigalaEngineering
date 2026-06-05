/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ServicesView from "./components/ServicesView";
import ProjectsView from "./components/ProjectsView";
import BoqPortalView from "./components/BoqPortalView";
import AboutView from "./components/AboutView";
import TestimonialsView from "./components/TestimonialsView";
import ContactView from "./components/ContactView";
import AdminConsoleView from "./components/AdminConsoleView";
import DiagnosticsView from "./components/DiagnosticsView";
import AdminLoginView from "./components/AdminLoginView";
import AdminAppShell from "./components/AdminAppShell";

import { db } from "./utils/db";
import {
  Locale,
  Project,
  Service,
  Testimonial,
  BOQSubmission,
  ContactSubmission,
  GoogleUser,
  TeamMember,
  Milestone,
} from "./types";
import { Milestone as MilestoneIcon } from "lucide-react";

export const EXCLUSIVE_ADMIN_EMAILS = [
  "consoletirex@gmail.com",
  "elvitigalaengineeringservices@gmail.com",
  "pramudithaelvitigala419@gmail.com",
];

export default function App() {
  // Separate website layout state for administrator portal
  const [isAdminWebsite, setIsAdminWebsite] = useState<boolean>(() => {
    return (
      window.location.pathname === "/admin" ||
      window.location.search.includes("admin=true")
    );
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Keep track of URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminWebsite(
        window.location.pathname === "/admin" ||
          window.location.search.includes("admin=true"),
      );
    };
    window.addEventListener("popstate", handleLocationChange);
    const interval = setInterval(handleLocationChange, 1000);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      clearInterval(interval);
    };
  }, []);

  // Theme & Language State
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [locale, setLocale] = useState<Locale>("en");

  // Chrome Integrated security state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    const cached = sessionStorage.getItem("chrome_google_session");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Administrative credentials role preview state with session storage memory fallback
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem("elvitigala_secure_session") === "authorized";
  });

  const [activeTab, setActiveTab] = useState<string>("home");

  // Unified Data Entities State
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [boqs, setBoqs] = useState<BOQSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Global modal state for project specifications overlay
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sync state data from the unified database simulation layer
  const syncRepositoryData = async () => {
    try {
      const [
        projsList,
        svcsList,
        testsList,
        boqsList,
        contactsList,
        teamList,
        milestonesList,
      ] = await Promise.all([
        db.getProjects(),
        db.getServices(),
        db.getTestimonials(),
        db.getBOQs(),
        db.getContacts(),
        db.getTeam(),
        db.getMilestones(), 
      ]);

      setProjects(projsList ?? []);
      setServices(svcsList ?? []);
      setTestimonials(testsList ?? []);
      setBoqs(boqsList ?? []);
      setContacts(contactsList ?? []);
      setTeam(teamList ?? []); 
      setMilestones(milestonesList ?? []);
    } catch (err) {
      console.error("Unified data repository sync failure.", err);
    }
  };

  // Run initial loading on boot
  useEffect(() => {
    syncRepositoryData();
  }, []);

  // Sync DOM classes for Light/Dark toggler
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#1a1c59";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
    }
  }, [theme]);

  // Handle active rendering route
  const renderActiveRoute = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView
            locale={locale}
            projects={projects}
            services={services}
            testimonials={testimonials}
            setActiveTab={setActiveTab}
            setSelectedProject={setSelectedProject}
          />
        );
      case "services":
        return (
          <ServicesView
            locale={locale}
            services={services}
            setActiveTab={setActiveTab}
          />
        );
      case "projects":
        return (
          <ProjectsView
            locale={locale}
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            services={services}
          />
        );
      case "boq":
        return (
          <BoqPortalView
            locale={locale}
            services={services}
            onSubmitSuccess={() => syncRepositoryData()}
          />
        );
      case "about":
        return (
          <AboutView
            locale={locale}
            team={team}
            milestones={milestones} // ✅ already correct — now populated
          />
        );
      case "testimonials":
        return (
          <TestimonialsView
            locale={locale}
            testimonials={testimonials}
            onTestimonialSubmitted={syncRepositoryData}
          />
        );
      case "contact":
        return <ContactView locale={locale} services={services} />;
      case "admin":
        if (!isAdmin) {
          return (
            <AdminLoginView
              locale={locale}
              onLoginSuccess={() => setIsAdmin(true)}
              googleUser={googleUser}
              setGoogleUser={setGoogleUser}
            />
          );
        }
        return (
          <AdminConsoleView
            locale={locale}
            projects={projects}
            services={services}
            testimonials={testimonials}
            milestones={milestones}
            boqs={boqs}
            contacts={contacts}
            team={team} // ✅ was hardcoded team={[]} before
            onRefreshData={syncRepositoryData}
          />
        );
      case "diagnostics":
        return <DiagnosticsView locale={locale} />;
      default:
        return (
          <div className="py-20 text-center text-zinc-500 text-xs font-mono">
            404: Architectural division coordinate not found.
          </div>
        );
    }
  };

  if (isAdminWebsite) {
    return (
      <AdminAppShell
        locale={locale}
        setLocale={setLocale}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        googleUser={googleUser}
        setGoogleUser={setGoogleUser}
        projects={projects}
        services={services}
        testimonials={testimonials}
        boqs={boqs}
        contacts={contacts}
        onRefreshData={syncRepositoryData}
        setIsAdminWebsite={setIsAdminWebsite}
        team={[]}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <Header
        theme={theme}
        setTheme={setTheme}
        locale={locale}
        setLocale={setLocale}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        googleUser={googleUser}
        setGoogleUser={setGoogleUser}
      />

      {/* Main Page Content Body */}
      <main className="flex-grow">{renderActiveRoute()}</main>

      {/* Persistence spec detail modal if selection arises from Home */}
      {selectedProject && activeTab !== "projects" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-xs relative animate-scale-up space-y-4">
            <h2 className="font-sans font-black text-xl text-zinc-950 dark:text-zinc-50 border-b pb-2">
              {selectedProject.title}
            </h2>
            <p className="text-zinc-655 dark:text-zinc-300 leading-relaxed text-sm">
              {selectedProject.description}
            </p>
            <div className="space-y-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border">
              <div>
                <strong>Client:</strong> {selectedProject.client}
              </div>
              <div>
                <strong>Location:</strong> {selectedProject.location}
              </div>
              <div>
                <strong>Est budget LKR:</strong> {selectedProject.cost}
              </div>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4.5 py-2 rounded bg-amber-500 font-bold hover:bg-amber-600 text-zinc-950 font-mono tracking-tight"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer locale={locale} setActiveTab={setActiveTab} />
    </div>
  );
}
