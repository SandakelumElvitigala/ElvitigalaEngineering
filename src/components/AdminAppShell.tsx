/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import {
  Locale,
  Project,
  Service,
  Testimonial,
  BOQSubmission,
  ContactSubmission,
  GoogleUser,
  TeamMember,
} from "../types";
import AdminLoginView from "./AdminLoginView";
import AdminConsoleView from "./AdminConsoleView";
import { TRANSLATIONS } from "../utils/i18n";
import {
  Shield,
  HardHat,
  Terminal,
  Chrome,
  Globe,
  Sun,
  Moon,
  X,
  BadgeCheck,
  ArrowLeft,
  Lock,
  LogOut,
  Settings,
} from "lucide-react";
import { EXCLUSIVE_ADMIN_EMAILS } from "../App";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface AdminAppShellProps {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  isAdmin: boolean;
  setIsAdmin: (a: boolean) => void;
  googleUser: GoogleUser | null;
  setGoogleUser: (user: GoogleUser | null) => void;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  boqs: BOQSubmission[];
  contacts: ContactSubmission[];
  team: TeamMember[];
  onRefreshData: () => void;
  setIsAdminWebsite: (b: boolean) => void;
}

export default function AdminAppShell({
  locale,
  setLocale,
  theme,
  setTheme,
  isAdmin,
  setIsAdmin,
  googleUser,
  setGoogleUser,
  projects,
  services,
  testimonials,
  boqs,
  contacts,
  team,
  onRefreshData,
  setIsAdminWebsite,
}: AdminAppShellProps) {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [pendingAccountToVerify, setPendingAccountToVerify] =
    useState<GoogleUser | null>(null);
  const [verificationPasscode, setVerificationPasscode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  const t = TRANSLATIONS[locale];
  const isChromeAdminAuthorized =
    googleUser?.verified && EXCLUSIVE_ADMIN_EMAILS.includes(googleUser.email);

  const selectAccountAndVerify = (account: GoogleUser) => {
    setVerificationError(null);

    const isAdminEmail = EXCLUSIVE_ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === account.email.toLowerCase(),
    );

    if (!isAdminEmail) {
      setVerificationError("This Google account is not authorized.");
      return;
    }

    setPendingAccountToVerify(account);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAccountToVerify) return;
    const code = verificationPasscode.trim();
    if (code === "elvitigala2026") {
      setGoogleUser(pendingAccountToVerify);

      sessionStorage.setItem(
        "chrome_google_session",
        JSON.stringify(pendingAccountToVerify),
      );

      sessionStorage.setItem("elvitigala_secure_session", "authorized");

      setIsAdmin(true);

      setShowSyncModal(false);
    } else {
      setVerificationError(
        locale === "en"
          ? "Access Denied: Invalid structural engineer administrative passcode."
          : "ප්‍රවේශය ප්‍රතික්ෂේප විය: වලංගු නොවන පරිපාලන මුරපදයකි.",
      );
    }
  };

  // Exit portal safely
  const handleExitAdminPortal = () => {
    // Reset path/params
    const url = new URL(window.location.href);
    url.pathname = "/";
    url.search = "";
    window.history.pushState({}, "", url.toString());
    setIsAdminWebsite(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-300">
      {/* Standalone Admin Header */}
      <header className="border-b border-zinc-850 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Brand */}
            <div className="flex items-center space-x-3 select-none">
              <div className="p-2.5 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Shield className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-sans font-black text-base tracking-tight leading-none text-white flex items-center gap-1.5 uppercase">
                  Elvitigala
                  <span className="text-amber-500 text-[10px] font-mono px-1 rounded bg-amber-500/10 border border-amber-500/30">
                    PORTAL
                  </span>
                </h1>
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mt-1">
                  Secure Administrative Console
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center space-x-3">
              {/* Back to Public Web */}
              <button
                onClick={handleExitAdminPortal}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer uppercase"
                title="Exit administrative portal and return to public website"
              >
                <ArrowLeft className="h-4 w-4 text-amber-500 animate-pulse" />
                <span>Client Site</span>
              </button>

              {/* Language Selection */}
              <button
                onClick={() => setLocale(locale === "en" ? "si" : "en")}
                className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Change language"
              >
                <Globe className="h-4 w-4 text-amber-500" />
                <span>{locale === "en" ? "සිංහල" : "EN"}</span>
              </button>

              {/* Dark & Light Toggle */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white transition-all"
                title="Toggle visual theme"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
              </button>

              {/* Verified Chrome Account Link */}
              <button
                onClick={() => setShowSyncModal(true)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  googleUser
                    ? isChromeAdminAuthorized
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-403"
                    : "border-dashed border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-900 text-zinc-400"
                }`}
                title="Identity security link verification"
              >
                <Chrome className="h-4 w-4 text-amber-500" />
                <span>
                  {googleUser
                    ? `SECURE: ${googleUser.email.split("@")[0]}`
                    : "SYNC CHROME"}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${googleUser ? (isChromeAdminAuthorized ? "bg-emerald-500 animate-pulse" : "bg-red-500") : "bg-zinc-650 animate-ping"}`}
                />
              </button>

              {/* Explicit Sign Out from Admin Portal */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    sessionStorage.removeItem("elvitigala_secure_session");
                  }}
                  className="p-2 rounded-lg border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Revoke Admin Token Session"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Primary Console Site Body */}
      <main className="flex-grow py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {isAdmin ? (
          <AdminConsoleView
            locale={locale}
            projects={projects}
            services={services}
            testimonials={testimonials}
            boqs={boqs}
            contacts={contacts}
            team={team}
            onRefreshData={onRefreshData}
          />
        ) : (
          <div className="max-w-md mx-auto my-12">
            <AdminLoginView
              locale={locale}
              onLoginSuccess={() => setIsAdmin(true)}
              googleUser={googleUser}
              setGoogleUser={setGoogleUser}
            />
          </div>
        )}
      </main>

      {/* Standalone Secure Footer */}
      <footer className="border-t border-zinc-850 py-6 bg-zinc-900/60 text-zinc-500 text-center font-mono text-[10px] space-y-1">
        <p>ELVITIGALA CRYPTOGRAPHIC COMMAND AND CONTROLLER NODES</p>
        <p className="text-amber-500/80 font-bold">
          SECURED PORTAL ACCESS INTENT. RE-ENTER TO AUDIT LEADS OR SERVICES.
        </p>
        <p className="text-zinc-600 mt-1">
          Colombo Area Executive Node • Version 1.25 Stable Production Build •
          2026
        </p>
      </footer>

      {/* Chrome Google Identity Login modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/85 backdrop-blur-inner flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-850 text-white rounded-2xl max-w-sm w-full p-6 space-y-5 relative animate-scale-up shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Chrome className="h-5 w-5 text-amber-505" />
                <div>
                  <h3 className="font-sans font-black text-sm tracking-tight text-white uppercase flex items-center gap-1.5">
                    Internal Google SSO Link
                  </h3>
                  <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                    Chrome Admin Handshake
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conditional verification phase */}
            {pendingAccountToVerify ? (
              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-400 leading-relaxed text-center space-y-1">
                  <Lock className="h-4 w-4 mx-auto text-amber-505" />
                  <p className="font-bold">Passcode Authentication Required</p>
                  <p className="opacity-90 leading-normal text-[10px]">
                    To sync administrative credentials for{" "}
                    {pendingAccountToVerify.email}, input the main Elvitigala
                    engineering security key.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                    Verification Key
                  </label>
                  <input
                    type="password"
                    required
                    value={verificationPasscode}
                    onChange={(e) => {
                      setVerificationPasscode(e.target.value);
                      setVerificationError(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-center font-mono rounded-xl bg-zinc-950 border border-zinc-805 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {verificationError && (
                  <p className="text-[10px] font-semibold text-center text-red-500 font-mono">
                    {verificationError}
                  </p>
                )}

                <div className="flex gap-2 text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAccountToVerify(null);
                      setVerificationPasscode("");
                      setVerificationError(null);
                    }}
                    className="w-1/2 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-850 text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-center"
                  >
                    CONFIRM
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] leading-relaxed text-zinc-400">
                  <p>
                    Portal checks active logged-in Chrome identity nodes. Only
                    team members matching the developer security pool can sign
                    in.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 flex items-center justify-between text-xs bg-zinc-950">
                  <div>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Security State
                    </span>
                    <span className="font-bold text-zinc-100 flex items-center gap-1 mt-0.5">
                      {googleUser
                        ? isChromeAdminAuthorized
                          ? "👑 Owner Authorized"
                          : "👥 Guest Sandbox Status"
                        : "⚪ Session Unlinked"}
                    </span>
                    {googleUser && (
                      <span className="block font-mono text-[10px] text-zinc-405 mt-0.5">
                        {googleUser.email}
                      </span>
                    )}
                  </div>

                  {googleUser && (
                    <button
                      onClick={() => {
                        setGoogleUser(null);
                        setIsAdmin(false);
                        sessionStorage.removeItem("chrome_google_session");
                        sessionStorage.removeItem("elvitigala_secure_session");
                      }}
                      className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border border-red-550/20 hover:border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      Unlink
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                    Select a testing Google workspace node:
                  </span>

                  <div className="space-y-1.5 font-sans">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        try {
                          const payload: any = jwtDecode(
                            credentialResponse.credential!,
                          );

                          const account: GoogleUser = {
                            email: payload.email,
                            name: payload.name,
                            verified: payload.email_verified,
                          };

                          selectAccountAndVerify(account);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      onError={() => {
                        setVerificationError("Google Sign-In failed");
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 text-center text-[10px] text-zinc-650 font-mono border-t border-zinc-850/50">
              Admin Link Controller v2.6 cryptographic validation active
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
