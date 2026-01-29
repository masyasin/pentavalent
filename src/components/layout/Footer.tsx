import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

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

  const certifications = [
    { name: 'CDOB', desc: 'Certified' },
    { name: 'CDAKB', desc: 'Certified' },
    { name: 'ISO 9001', desc: 'Quality' },
    { name: 'ISO 27001', desc: 'Security' },
  ];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden pt-24">
      {/* Visual Depth Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/5">

          {/* Brand Architecture Column */}
          <div className="lg:col-span-4 space-y-10">
            <div className="relative group inline-block">
              <div className="absolute -inset-4 bg-white/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative bg-white p-6 rounded-[1.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/logo-penta-valent.png"
                  alt="Penta Valent"
                  className="h-14 w-auto"
                />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-slate-400 text-sm leading-relaxed font-bold max-w-sm">
                {t('about.description')}
              </p>

              <div className="flex items-center gap-6">
                {social.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    className="group relative"
                    aria-label={item.name}
                  >
                    <div className="absolute -inset-2 bg-cyan-500/0 rounded-lg blur group-hover:bg-cyan-500/10 transition-colors"></div>
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d={item.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Micro-Certificates Widget */}
            <div className="flex gap-3 pt-4">
              {['CDOB', 'CDAKB', 'ISO 9001'].map(cert => (
                <div key={cert} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black tracking-widest text-slate-300 uppercase">
                  {cert}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Intelligence Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Perusahaan</h4>
              <ul className="space-y-4">
                {quickLinks.slice(0, 4).map((link) => (
                  <li key={link.key}>
                    <button
                      onClick={() => onNavigate(link.key)}
                      className="text-slate-400 text-xs font-bold hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cyan-500 group-hover:w-4 transition-all duration-300"></span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Investor</h4>
              <ul className="space-y-4">
                {investors.map((link) => (
                  <li key={link.key}>
                    <button
                      onClick={() => onNavigate(link.key)}
                      className="text-slate-400 text-xs font-bold hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cyan-500 group-hover:w-4 transition-all duration-300"></span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Executive Contact Pulse Column */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[4rem] group-hover:bg-cyan-500/10 transition-colors"></div>

              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Pusat Informasi</h4>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Markas Besar</h5>
                    <p className="text-white text-xs font-bold leading-relaxed">Jl. Tanah Abang III No. 12, Jakarta</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Resmi</h5>
                    <p className="text-white text-xs font-bold">info@pentavalent.co.id</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-500 hover:text-white transition-all duration-500">
                  {t('hero.cta2')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Baseline */}
        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} PT PENTA VALENT TBK. {t('footer.rights')}
          </div>

          <div className="flex gap-8">
            {['Privacy', 'Ethics', 'Admin'].map(nav => (
              <a key={nav} href={nav === 'Admin' ? '/admin' : '#'} className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                {nav}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
