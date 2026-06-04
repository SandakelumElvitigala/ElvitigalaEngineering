/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Locale, GoogleUser } from '../types';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Terminal, Chrome, ArrowRight } from 'lucide-react';
import { EXCLUSIVE_ADMIN_EMAILS } from '../App';

interface AdminLoginViewProps {
  locale: Locale;
  onLoginSuccess: () => void;
  googleUser: GoogleUser | null;
  setGoogleUser: (user: GoogleUser | null) => void;
}

export default function AdminLoginView({ locale, onLoginSuccess, googleUser, setGoogleUser }: AdminLoginViewProps) {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Sri Lanka standard engineering administrative code
  const VALID_PASSCODE = 'elvitigala2026';
  const ALTERNATE_PASSCODE = 'admin123';

  const isChromeAdminAuthorized = googleUser?.verified && EXCLUSIVE_ADMIN_EMAILS.includes(googleUser.email);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorStatus(null);
    setSubmitting(true);

    setTimeout(() => {
      const normalizedInput = passcode.trim();
      if (normalizedInput === VALID_PASSCODE || normalizedInput === ALTERNATE_PASSCODE) {
        setAuthorized(true);
        setErrorStatus(null);
        // Persist session to limit nagging re-logins during active user action
        sessionStorage.setItem('elvitigala_secure_session', 'authorized');
        
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      } else {
        setErrorStatus(
          locale === 'en' 
            ? 'Access Denied: Invalid structural engineer administrative passcode.' 
            : 'ප්‍රවේශය ප්‍රතික්ෂේප විය: වලංගු නොවන පරිපාලන මුරපදයකි.'
        );
        setSubmitting(false);
      }
    }, 600);
  };

  const handleSSOBypass = () => {
    setSubmitting(true);
    setAuthorized(true);
    sessionStorage.setItem('elvitigala_secure_session', 'authorized');
    setTimeout(() => {
      onLoginSuccess();
    }, 800);
  };


  return (
    <div className="max-w-md mx-auto my-12 px-4 select-none">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Subtle accent border on top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center animate-pulse">
            <Shield className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="font-sans font-black text-xl tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
              {locale === 'en' ? 'Administrative Entry' : 'පරිපාලන පිවිසුම'}
            </h2>
            <p className="text-[10px] font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mt-1">
              {locale === 'en' ? 'Authorized Contractors Only' : 'බලයලත් කොන්ත්‍රාත්කරුවන් පමණි'}
            </p>
          </div>
        </div>

        {/* Instruction Disclaimer */}
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-150 dark:border-zinc-850 space-y-2 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          <div className="flex gap-2 items-start">
            <Lock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold dark:text-zinc-100">
                {locale === 'en' ? 'Secure Protocol Active' : 'ආරක්ෂිත ප්‍රොටෝකෝලය ක්‍රියාත්මකයි'}
              </span>
              <p className="mt-0.5 text-zinc-500">
                {locale === 'en' 
                  ? 'Accessing structural logs, submitted client quotes, testimonials queue, and the SQL terminal requires validation keys.'
                  : 'ව්‍යුහාත්මක ලඝු-සටහන්, සේවාදායක මිල ගණන් සහ SQL ටර්මිනලය වෙත පිවිසීමට වලංගු පරිපාලන යතුරු අවශ්‍ය වේ.'}
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-[10px]">
            <span className="font-mono text-amber-500">
              {locale === 'en' ? 'KEY HINT: elvitigala2026' : 'මුරපද ඉඟිය: elvitigala2026'}
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono text-[9px] rounded uppercase font-bold tracking-wider">
              ONLINE
            </span>
          </div>
        </div>

        {/* Phase Feedback UI */}
        {authorized ? (
          <div className="py-6 text-center space-y-3 animate-scale-up">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                {locale === 'en' ? 'CREDENTIALS VALIDATED' : 'පිවිසුම් දත්ත සාර්ථකයි'}
              </p>
              <h3 className="font-sans font-bold text-zinc-950 dark:text-zinc-50 text-xs">
                {locale === 'en' ? 'Unlocking Central Command Vault...' : 'පරිපාලන පද්ධතිය විවෘත වේ...'}
              </h3>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* If Synced Chrome Account is Admin, offer passwordless click bypass! */}
            {isChromeAdminAuthorized ? (
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/25 text-center space-y-3.5 animate-scale-up">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Chrome className="h-5 w-5 text-amber-500 animate-spin" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-zinc-800 dark:text-zinc-100">
                    {locale === 'en' ? 'Verified Admin Google Account Connected' : 'පරිපාලක ගූගල් ගිණුම තහවුරුයි'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                    {googleUser?.email}
                  </p>
                </div>
                <button
                  onClick={handleSSOBypass}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
                >
                  <span>{locale === 'en' ? 'Fast Sign-In & Enter' : 'ක්ෂණිකව ඇතුල් වන්න'}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : googleUser ? (
              <div className="p-3 bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-red-500/25 text-center space-y-1 text-[11px] text-red-500">
                <p className="font-bold">Google account linked is not an Administrator:</p>
                <p className="font-mono text-[10px] opacity-75">{googleUser.email}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Please enter passcode key below to proceed manually, or switch account in the header.</p>
              </div>
            ) : (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {locale === 'en' 
                  ? 'Want to avoid key entry? Sync your authorized Chrome email ' 
                  : 'මුරපද ලිවීම මඟ හැරීමට? ඔබගේ ' }
                <span className="font-bold dark:text-zinc-200">consoletirex@gmail.com</span> 
                {locale === 'en' ? ' account using the ' : ' ගිණුම top bar හි '}
                <span className="font-mono text-amber-500 border border-amber-500/30 px-1 py-0.5 rounded bg-amber-500/5 font-bold">SYNC CHROME</span> 
                {locale === 'en' ? ' button in the menu bar!' : ' බොත්තම මඟින් සම්බන්ධ කරන්න!' }
              </div>
            )}
            
            <div className="relative flex py-2 items-center text-[10px] font-mono text-zinc-350 dark:text-zinc-600">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-3 uppercase font-bold tracking-wider">
                {locale === 'en' ? 'OR USE SECURE KEY' : 'හෝ ආරක්ෂක යතුර භාවිතා කරන්න'}
              </span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Input Passcode Panel */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                {locale === 'en' ? 'Engineering Security Key' : 'ඉංජිනේරු ආරක්ෂක යතුර'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorStatus) setErrorStatus(null);
                  }}
                  disabled={submitting}
                  placeholder={locale === 'en' ? 'Enter administrative security key...' : 'ආරක්ෂක යතුර ඇතුල් කරන්න...'}
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 transition-all font-mono"
                  required
                  autoFocus
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Panel if validation failed */}
            {errorStatus && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] leading-relaxed flex gap-2 items-start animate-shake">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorStatus}</span>
              </div>
            )}

            {/* Authentication Buttons */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-100 disabled:dark:bg-zinc-850 disabled:text-zinc-450 font-bold text-white text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-md group"
            >
              <Terminal className="h-4 w-4 text-amber-200 group-hover:animate-spin" />
              <span>
                {submitting 
                  ? (locale === 'en' ? 'Authorizing Checksums...' : 'පරික්ෂා කරමින් පවතී...') 
                  : (locale === 'en' ? 'Verify Key & Access' : 'සත්‍යාපනය කර ඇතුල් වන්න')}
              </span>
            </button>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}
