/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string; // 'civil' | 'architecture' | 'interior' | 'steel' | 'pools' | 'electrical' | 'acoustics'
  client: string;
  location: string;
  cost: string;
  year: string;
  description: string;
  imageUrl: string;
  galleryUrls?: string[];
  specs?: {
    label: string;
    value: string;
  }[];
  isFeatured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: string; // Lucide icon string
  category: string;
  features: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface BOQItem {
  id: string;
  serial?: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface BOQSubmission {
  id: string;

  clientName: string;
  clientEmail: string;
  clientPhone: string;

  projectType: string;
  notes?: string;

  // Original uploaded file
  fileName: string;
  storagePath?: string; // Supabase Storage path
  fileUrl?: string;  

  // Legacy field (can remove later after migration)
  rawCsvContent?: string;

  mappedItems: {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }[];

  totalEstimate: number;

  status:
    | "pending"
    | "reviewing"
    | "quoting"
    | "completed"
    | "declined";

  quoteUrl?: string;

  submittedAt: string;

  adminNote?: string;

  logs: {
    timestamp: string;
    action: string;
    note: string;
  }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isResponded: boolean;
  submittedAt: string;
  adminNotes?: string;
}

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

export type Locale = 'en' | 'si'; // English, Sinhala

export interface TranslationSet {
  navHome: string;
  navServices: string;
  navProjects: string;
  navBoq: string;
  navAbout: string;
  navTestimonials: string;
  navContact: string;
  navAdmin: string;
  navDiagnostics: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroCTA: string;
  homeStatsExp: string;
  homeStatsProjects: string;
  homeStatsClients: string;
  quickEstimateTitle: string;
  quickEstimateDesc: string;
  servicesTitle: string;
  servicesSubtitle: string;
  projectsTitle: string;
  projectsSubtitle: string;
  filterAll: string;
  boqTitle: string;
  boqSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
}

export interface TestCaseResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  verified: boolean;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export type AddMilestone = Omit<
  Milestone,
  "id"
>;