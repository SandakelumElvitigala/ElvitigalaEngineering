/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Locale, Service } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { db } from '../utils/db';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ContactViewProps {
  locale: Locale;
  services?: Service[];
}

export default function ContactView({ locale, services = [] }: ContactViewProps) {
  const t = TRANSLATIONS[locale];

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Civil Tender bidding');
  const [message, setMessage] = useState('');
  const [receivedCode, setReceivedCode] = useState('');

  // Synchronize subject with database service options
  React.useEffect(() => {
    if (services && services.length > 0) {
      if (!subject || !services.some(s => s.title === subject || s.category === subject)) {
        setSubject(services[0].title);
      }
    }
  }, [services]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Secure validator: Name, Email + text are required fields.');
      return;
    }

    try {
      const saved = await db.submitContact({
        name,
        email,
        phone,
        subject,
        message
      });

      setReceivedCode(saved.id);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

      setTimeout(() => {
        setReceivedCode('');
      }, 9000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in" id="contact-view-wrapper">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
          CENTRAL COMMERCE REACH
        </span>
        <h1 className="font-sans font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 leading-none">
          {t.contactTitle}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {t.contactSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Side: Core reach coordinates */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between" id="contact-coordinates">
          
          <div className="space-y-6">
            <h2 className="text-zinc-900 dark:text-zinc-100 font-sans font-black text-xl">Headquarters Colombo</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              We coordinate our engineering consultancies, QS steel estimations, and heavy machinery fleets from our centralized Colombo Mawatha headquarters block.
            </p>
          </div>

          <div className="space-y-6">
            
            <div className="flex gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-amber-550 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">Office Address</h4>
                <p className="text-zinc-800 dark:text-zinc-200 font-semibold mt-1">No. 345, Elvitigala Mawatha, Colombo 05, Sri Lanka</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-amber-550 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">Operational Hotline</h4>
                <p className="text-zinc-800 dark:text-zinc-200 font-mono font-bold mt-1">+94 11 285 4120</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-amber-550 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <h4 className="text-zinc-400 font-mono text-[9px] uppercase font-bold tracking-widest">Tender Correspondence</h4>
                <p className="text-zinc-800 dark:text-zinc-200 font-mono font-semibold mt-1 select-all">info@elvitigala.lk</p>
              </div>
            </div>

          </div>

          {/* Licensing accreditation logo box */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <strong className="text-zinc-800 dark:text-zinc-200 block text-xs">CIDA Grade CS2 Accreditation</strong>
              National engineering licensure for mass construction volumes and safety.
            </div>
          </div>

        </div>

        {/* Right Side: Message form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 sm:p-10 shadow-xl" id="contact-submission-box">
          
          <div className="space-y-2 mb-6 border-b border-zinc-150 dark:border-zinc-850 pb-4">
            <h2 className="font-sans font-extrabold text-base text-zinc-900 dark:text-zinc-100">Send an Inquiry or Tender Bid</h2>
            <p className="text-xs text-zinc-400">Your message is securely recorded and routed to the corresponding department directors.</p>
          </div>

          <form onSubmit={handleMessageSubmit} className="space-y-4 text-sm" id="contact-form">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Representative Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  placeholder="Eng. Priyantha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Official Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  placeholder="p.elvitigala@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Telephone / Fax</label>
                <input
                  type="tel"
                  className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  placeholder="+94 11 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-655 dark:text-zinc-450">Subject Category</label>
                <select
                  className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {services && services.length > 0 ? (
                    services.map((svc) => (
                      <option key={svc.id} value={svc.title}>{svc.title}</option>
                    ))
                  ) : (
                    <>
                      <option value="General civil Tender bidding">General Civil Tender Bidding</option>
                      <option value="Architecture and villa layout proposals">Architecture & Villa Layout Proposals</option>
                      <option value="Quantity surveying rates evaluation">Quantity Surveying Rates Evaluation</option>
                    </>
                  )}
                </select>
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-650 dark:text-zinc-450">Inquiry Proposal / Abstract Text</label>
              <textarea
                required
                rows={5}
                className="w-full p-2 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-800 text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none"
                placeholder="Declare structural specs, project location and standard materials expectations..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {receivedCode && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex gap-2 items-center" id="contact-submission-success">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <div>
                  <strong className="block text-xs font-bold">Secure ledger created!</strong>
                  Message logged with ID <code className="font-mono text-[10px] uppercase font-bold text-emerald-400 select-all">{receivedCode}</code>. Active review routing initiated. Review this submission under Admin Console!
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 text-center"
              id="submit-contact-btn"
            >
              <Send className="h-4 w-4" />
              <span>COMMIT SECURE INQUIRY ROW</span>
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
