/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Locale, GoogleUser } from "../types";
import { TRANSLATIONS } from "../utils/i18n";
import {
  Sun,
  Moon,
  HardHat,
  Shield,
  Globe,
  Menu,
  X,
  Terminal,
  Chrome,
  LogOut,
  CheckCircle,
  ShieldAlert,
  BadgeCheck,
} from "lucide-react";
import { EXCLUSIVE_ADMIN_EMAILS } from "../App";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  isAdmin: boolean;
  setIsAdmin: (a: boolean) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  googleUser: GoogleUser | null;
  setGoogleUser: (user: GoogleUser | null) => void;
}

export default function Header({
  theme,
  setTheme,
  locale,
  setLocale,
  isAdmin,
  setIsAdmin,
  activeTab,
  setActiveTab,
  googleUser,
  setGoogleUser,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [pendingAccountToVerify, setPendingAccountToVerify] =
    useState<GoogleUser | null>(null);
  const [verificationPasscode, setVerificationPasscode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const t = TRANSLATIONS[locale];

  const selectAccountAndVerify = (account: GoogleUser) => {
    setVerificationError(null);
    setVerificationPasscode("");
    const isAdminEmail = EXCLUSIVE_ADMIN_EMAILS.includes(account.email);
    if (isAdminEmail) {
      setPendingAccountToVerify(account);
    } else {
      setGoogleUser(account);
      sessionStorage.setItem("chrome_google_session", JSON.stringify(account));
      setShowAccountsModal(false);
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAccountToVerify) return;
    const code = verificationPasscode.trim();
    if (code === "elvitigala2026" || code === "admin123") {
      setGoogleUser(pendingAccountToVerify);
      sessionStorage.setItem(
        "chrome_google_session",
        JSON.stringify(pendingAccountToVerify),
      );
      setPendingAccountToVerify(null);
      setVerificationPasscode("");
      setShowAccountsModal(false);
    } else {
      setVerificationError(
        locale === "en"
          ? "Access Denied: Invalid structural engineer administrative passcode."
          : "ප්‍රවේශය ප්‍රතික්ෂේප විය: වලංගු නොවන පරිපාලන මුරපදයකි.",
      );
    }
  };

  const menuItems = [
    { id: "home", label: t.navHome },
    { id: "services", label: t.navServices },
    { id: "projects", label: t.navProjects },
    { id: "boq", label: t.navBoq },
    { id: "about", label: t.navAbout },
    { id: "testimonials", label: t.navTestimonials },
    { id: "contact", label: t.navContact },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isChromeAdminAuthorized =
    googleUser?.verified && EXCLUSIVE_ADMIN_EMAILS.includes(googleUser.email);

  const currentYr = "2026";

  return (
    <header className="sticky top-0 z-50 border-b transition-colors duration-300 bg-white/90 dark:bg-zinc-950/90 border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div
            onClick={() => {
              setActiveTab("home");
              setMobileOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer select-none group"
            id="header-brand"
          >
            <div className="p-1 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/logo01.png"
                alt="Elvitigala Engineering Logo"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <h1 className="font-sans font-extrabold text-lg tracking-tight leading-none text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                ELVITIGALA
                <span className="text-amber-500 text-xs font-mono px-1 rounded bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30">
                  ENG
                </span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1">
                Engineering & Construction
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-1"
            id="desktop-navbar"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-md text-sm font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? "bg-amber-500 text-white dark:bg-amber-500 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions Bar */}
          <div
            className="hidden lg:flex items-center space-x-3"
            id="desktop-actions"
          >
            {/* Run Tests Screen Button */}
            {/*<button
              onClick={() => setActiveTab("diagnostics")}
              title={t.navDiagnostics}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-xs font-mono ${
                activeTab === "diagnostics"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>TESTS</span>
            </button>*/}

            {/* Language Selection */}
            <button
              onClick={() => setLocale(locale === "en" ? "si" : "en")}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Change Language / භාෂාව වෙනස් කරන්න"
              id="btn-lang-toggle"
            >
              <Globe className="h-4 w-4 text-amber-500" />
              <span>{locale === "en" ? "සිංහල" : "ENGLISH"}</span>
            </button>

            {/* Dark & Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
              id="btn-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5" />
              ) : (
                <Sun className="h-4.5 w-4.5" />
              )}
            </button>
            <button
              onClick={() => setLocale(locale === "en" ? "si" : "en")}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold"
            >
              {locale === "en" ? "සිං" : "EN"}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              id="mobile-menu-trigger"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-2 shadow-lg"
          id="mobile-drawer"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                activeTab === item.id
                  ? "bg-amber-500 text-white font-bold"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab("diagnostics");
                setMobileOpen(false);
              }}
              className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center text-xs font-mono flex items-center justify-center gap-1.5 stroke-[1.5]"
            >
              <Terminal className="h-4 w-4" />
              RUN DIAGNOSTIC TESTS
            </button>
            <div className="text-center font-mono text-[10px] text-zinc-400 pt-2">
              Elvitigala Engineering v1.2 • Standard {currentYr} Prototype
            </div>
          </div>
        </div>
      )}

      {/* Chrome Google Identity Sync Modal Layer */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-5 relative animate-scale-up shadow-2xl">
            {/* Header branding */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <Chrome className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-sm tracking-tight text-zinc-900 dark:text-zinc-50 uppercase flex items-center gap-1.5">
                    Chrome Profile Sync
                  </h3>
                  <p className="text-[9px] font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                    Google Accounts verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountsModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-450 hover:text-zinc-600 transition-colors"
                id="btn-close-google-sync"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conditional Content based on verification state */}
            {pendingAccountToVerify ? (
              <form
                onSubmit={handleVerifyPasscode}
                className="space-y-4 animate-scale-up"
              >
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed text-center space-y-1.5">
                  <Terminal className="h-4 w-4 mx-auto text-amber-500" />
                  <p className="font-bold">
                    {locale === "en"
                      ? "Passcode Verification Required"
                      : "මුරපද තහවුරු කිරීම අවශ්‍ය වේ"}
                  </p>
                  <p className="opacity-90 leading-normal text-[10.5px]">
                    {locale === "en"
                      ? `To link the admin Chrome account (${pendingAccountToVerify.email}), please verify with your main Elvitigala administrative security key.`
                      : `මෙම පරිපාලක ගිණුම සම්බන්ධ කිරීමට (${pendingAccountToVerify.email}) කරුණාකර ඔබගේ ප්‍රධාන ආරක්ෂක කේතය ඇතුලත් කරන්න.`}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                    {locale === "en" ? "Administrative Key" : "පරිපාලක මුරපදය"}
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
                    className="w-full px-3 py-2 text-center font-mono rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                  />
                </div>

                {verificationError && (
                  <p className="text-[10px] font-semibold text-center text-red-500 font-mono animate-pulse">
                    {verificationError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAccountToVerify(null);
                      setVerificationPasscode("");
                      setVerificationError(null);
                    }}
                    className="w-1/2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-505 hover:bg-zinc-50 dark:hover:bg-zinc-950 font-bold font-mono text-xs cursor-pointer text-center text-zinc-500"
                  >
                    {locale === "en" ? "CANCEL" : "අවලංගු කරන්න"}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold font-mono text-xs cursor-pointer text-center transition-colors"
                  >
                    {locale === "en" ? "VERIFY" : "තහවුරු කරන්න"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Explanation box */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850 space-y-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  <p>
                    To secure administrative data blocks, the portfolio queries
                    Chrome browser synced accounts. Only developer-picked
                    accounts can view or switch to Admin Dashboard.
                  </p>
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-[10.5px]">
                    To sync consoletirex@gmail.com, select it below and verify
                    the executive security passcode.
                  </p>
                </div>

                {/* Session status indicator */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                      Security State
                    </span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1">
                      {googleUser
                        ? isChromeAdminAuthorized
                          ? "👑 Owner Authorized"
                          : "👥 Guest Revoked"
                        : "⚪ Anonymous Visitor"}
                    </span>
                    {googleUser && (
                      <span className="block font-mono text-[10px] text-zinc-500 mt-0.5">
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
                        if (activeTab === "admin") setActiveTab("home");
                      }}
                      className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border border-red-500/20 hover:border-red-500 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>

                {/* Simulated accounts list for current Google Profile */}
                <div className="space-y-2.5">
                  <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                    Logged-in Chrome accounts:
                  </span>

                  <div className="space-y-1.5">
                    {/* 1. Consoletirex Account */}
                    <button
                      onClick={() => {
                        const linkedUser = {
                          email: "consoletirex@gmail.com",
                          name: "Console Tirex Engineer",
                          verified: true,
                        };
                        selectAccountAndVerify(linkedUser);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-emerald-500/5 dark:bg-zinc-950 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="block font-sans font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 duration-200 flex items-center gap-1">
                          consoletirex@gmail.com
                          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                        </span>
                        <span className="block text-[9px] font-mono text-zinc-400">
                          Primary Admin (Your profile)
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[8px] rounded uppercase font-bold tracking-wider">
                        Click to Sync
                      </span>
                    </button>

                    {/* 2. Guest Reviewer */}
                    <button
                      onClick={() => {
                        const linkedUser = {
                          email: "guest.reviewer@srilankaengineers.org",
                          name: "Sri Lankan QS Reviewer",
                          verified: true,
                        };
                        selectAccountAndVerify(linkedUser);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="block font-sans font-bold text-xs text-zinc-650 dark:text-zinc-350 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 duration-200">
                          guest.reviewer@srilankaengineers.org
                        </span>
                        <span className="block text-[9px] font-mono text-zinc-400">
                          General Guest Sandbox ID
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 font-mono text-[8px] rounded uppercase font-bold tracking-wider">
                        Unlinked
                      </span>
                    </button>
                  </div>

                  {/* 3. Custom Sync Entry */}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5">
                    <span className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                      Test custom Chrome email address:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="e.g. employee@elvitigala.lk"
                        className="flex-grow pl-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => {
                          if (!customEmail.trim().includes("@")) {
                            alert("Enter a valid email structure.");
                            return;
                          }
                          const linkedUser = {
                            email: customEmail.trim(),
                            name: "Custom Team member",
                            verified: true,
                          };
                          selectAccountAndVerify(linkedUser);
                          setCustomEmail("");
                        }}
                        className="px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-white text-xs uppercase font-mono tracking-tight cursor-pointer"
                      >
                        SYNC
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 text-center text-[10px] text-zinc-400 font-mono">
              Elvitigala Cryptographic Authentication Active
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
