import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Building2, Mail, MapPin, Globe, ShieldCheck, Users, Eye, ArrowUpRight, Phone, Clock, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const quickLinks = [
    { key: 'about', label: t('nav.about') },
    { key: 'business', label: t('nav.business') },
    { key: 'network', label: t('nav.network') },
    { key: 'certification', label: t('nav.certification') },
    { key: 'sitemap', label: 'Sitemap' },
    { key: 'faq', label: 'FAQ' },
  ];

  const services = [
    { key: 'pharma', label: t('business.pharma') },
    { key: 'medical', label: t('business.medical') },
    { key: 'consumer', label: t('business.consumer') },
  ];

  const investors = [
    { key: 'investor', label: t('nav.investor') },
    { key: 'gcg', label: 'Good Corporate Governance' },
    { key: 'news', label: t('nav.news') },
    { key: 'career', label: t('nav.career') },
  ];

  const social = [
    {
      name: 'LinkedIn',
      icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      link: '#',
      color: 'hover:bg-[#0077B5]'
    },
    {
      name: 'Instagram',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
      link: '#',
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500'
    },
    {
      name: 'Twitter',
      icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
      link: '#',
      color: 'hover:bg-[#1DA1F2]'
    },
    {
      name: 'YouTube',
      icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
      link: '#',
      color: 'hover:bg-[#FF0000]'
    },
  ];

  const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);
    const [active, setActive] = useState<number>(0);

    useEffect(() => {
      const fetchAndIncrement = async () => {
        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single();

          if (data && !error) {
            const newCount = (data.visitor_count || 0) + 1;
            setCount(newCount);

            await supabase
              .from('site_settings')
              .update({ visitor_count: newCount })
              .eq('id', data.id);
          } else {
            setCount(0);
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const { count: todayCount, error: logsError } = await supabase
            .from('visitor_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

          if (!logsError && todayCount !== null) {
            setActive(todayCount);
          } else {
            setActive(0);
          }

          try {
            const userAgent = navigator.userAgent;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

            let browser = "Unknown";
            if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
            else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
            else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
            else if (userAgent.indexOf("MSIE") > -1 || !!(document as any).documentMode) browser = "IE";

            let os = "Unknown";
            if (navigator.platform.indexOf("Win") != -1) os = "Windows";
            else if (navigator.platform.indexOf("Mac") != -1) os = "MacOS";
            else if (navigator.platform.indexOf("Linux") != -1) os = "Linux";
            else if (/Android/.test(userAgent)) os = "Android";
            else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";

            await supabase.from('visitor_logs').insert({
              ip_address: 'localhost',
              browser: browser,
              os: os,
              city: 'Local Development',
              country: 'Local',
              page_url: window.location.href,
              referrer: document.referrer,
              user_agent: userAgent,
              is_mobile: isMobile
            });
          } catch (geoErr) {
            console.warn('Analytics logging failed:', geoErr);
          }
        } catch (err) {
          console.error('Counter update error:', err);
        }
      };

      fetchAndIncrement();
    }, []);

    if (count === null) return null;

    return (
      <div className="flex flex-col gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-2xl shadow-3xl shadow-blue-500/10 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all group w-full max-w-[200px]">
        {/* Live Traffic */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users size={14} className="text-green-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#020617]"></span>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">Traffic Live</p>
            <p className="text-xl font-black text-white leading-none tracking-tighter group-hover:text-green-400 transition-colors uppercase italic">{active}</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10"></div>

        {/* Total Audit */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Eye size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">Total Audit</p>
            <p className="text-xl font-black text-white leading-none tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">
              {count.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden pt-12 pb-12">
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#0f172a] to-[#020617]"></div>
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-[700px] bg-gradient-to-t from-blue-600/20 via-purple-600/10 to-transparent blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full items-end flex opacity-50 scale-110 origin-bottom mix-blend-luminosity">
          <svg className="w-full h-[250px] text-slate-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,320 L0,120 L80,120 L80,200 L160,200 L160,80 L240,80 L240,240 L320,240 L320,160 L400,160 L400,280 L480,280 L480,100 L560,100 L560,220 L640,220 L640,140 L720,140 L720,260 L800,260 L800,60 L880,60 L880,180 L960,180 L960,100 L1040,100 L1040,220 L1120,220 L1120,140 L1200,140 L1200,40 L1280,40 L1280,200 L1360,200 L1360,320 Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full items-end flex opacity-80 mix-blend-normal">
          <svg className="w-full h-[200px] text-slate-800" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,320 L0,160 L50,160 L50,140 L100,140 L100,200 L180,200 L180,100 L240,100 L240,250 L300,250 L300,120 L380,120 L380,220 L440,220 L440,180 L500,180 L500,280 L580,280 L580,80 L640,80 L640,190 L700,190 L700,150 L760,150 L760,240 L820,240 L820,110 L900,110 L900,200 L960,200 L960,130 L1020,130 L1020,260 L1080,260 L1080,90 L1140,90 L1140,170 L1200,170 L1200,230 L1280,230 L1280,140 L1350,140 L1350,320 Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden opacity-90">
          <div className="absolute bottom-0 left-[10%] w-[2px] h-32 bg-cyan-400 shadow-[0_0_10px_cyan] animate-pulse"></div>
          <div className="absolute bottom-0 left-[15%] w-[3px] h-48 bg-blue-500 shadow-[0_0_15px_blue]"></div>
          <div className="absolute bottom-0 left-[25%] w-[2px] h-24 bg-purple-400 shadow-[0_0_10px_purple]"></div>
          <div className="absolute bottom-0 left-[45%] w-[4px] h-64 bg-indigo-500 shadow-[0_0_20px_indigo] opacity-80"></div>
          <div className="absolute bottom-0 left-[60%] w-[3px] h-40 bg-blue-300 shadow-[0_0_12px_blue]"></div>
          <div className="absolute bottom-0 left-[80%] w-[2px] h-36 bg-cyan-300 shadow-[0_0_10px_cyan]"></div>
          <div className="absolute bottom-0 left-[90%] w-[3px] h-56 bg-purple-500 shadow-[0_0_15px_purple]"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#020617] to-transparent opacity-80"></div>
        <div className="absolute bottom-[-50px] left-1/4 w-[800px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-50px] right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-0 pb-16 border-b border-white/5">
          {/* Column 1: Logo, Social, Counter */}
          <div className="space-y-8 flex flex-col items-center">
            <div className="relative group p-2 hover:scale-105 transition-transform duration-300">
              <img src="/logo-penta-valent.png" alt="Penta Valent" className="h-16 w-auto brightness-0 invert" />
            </div>

            <div className="space-y-6 w-full flex flex-col items-center">
              <div className="flex items-center gap-3 justify-center">
                {social.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
                    aria-label={item.name}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={item.icon} />
                    </svg>
                  </a>
                ))}
              </div>

              <div className="pt-2 w-full flex justify-center">
                <VisitorCounter />
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="pt-2 pl-4">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><span className="w-1 h-4 bg-orange-500 rounded-full"></span>Contact Us</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer">
                <div className="mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><MapPin size={16} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jakarta HQ</p><p className="text-white text-xs font-medium leading-relaxed">Tanah Abang III No. 12<br />Jakarta, Indonesia</p></div>
              </div>
              <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer">
                <div className="mt-1 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0"><Mail size={16} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Digital Mail</p><p className="text-white text-xs font-medium">info@pentavalent.co.id</p></div>
              </div>
              <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer">
                <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0"><Phone size={16} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Head Office</p><p className="text-white text-xs font-medium">+62 21 350-1010</p></div>
              </div>
              <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer">
                <div className="mt-1 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><Clock size={16} /></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Business Hours</p><p className="text-white text-xs font-medium">Mon - Fri: 08:00 - 17:00</p></div>
              </div>
            </div>
          </div>

          {/* Column 3: Corporate Menu */}
          <div className="pt-2 lg:pl-8">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><span className="w-1 h-4 bg-blue-500 rounded-full"></span>Corporate</h4>
            <ul className="space-y-4 pl-4 border-l border-white/5">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.key}><button onClick={() => onNavigate(link.key)} className="text-slate-300 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 transition-all transition-transform duration-300 flex items-center gap-2 group text-left"><span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-blue-400">→</span>{link.label}</button></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stakeholders Menu */}
          <div className="pt-2">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><span className="w-1 h-4 bg-cyan-500 rounded-full"></span>Stakeholders</h4>
            <ul className="space-y-4 pl-4 border-l border-white/5">
              {investors.map((link) => (
                <li key={link.key}><button onClick={() => onNavigate(link.key)} className="text-slate-300 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 transition-all transition-transform duration-300 flex items-center gap-2 group text-left"><span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 text-cyan-400">→</span>{link.label}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-4">
          <div className="flex items-center gap-6">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} PT PENTA VALENT TBK. <span className="hidden sm:inline opacity-30 mx-2">|</span> <span className="text-slate-400">All rights reserved.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="/privacy-policy" className="group flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</a>
            <a href="/code-of-conduct" className="group flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
