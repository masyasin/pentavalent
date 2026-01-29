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
    <footer className="relative text-white overflow-hidden">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
          alt="Building Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2351]/90 via-[#0D2B5F]/85 to-[#000000]/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-0" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
            {/* Company Info - Larger Column */}
            <div className="lg:col-span-4">
              {/* Logo and Company Info - Premium Design */}
              <div className="mb-10">
                {/* Logo and Badges Container - Horizontal Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center mb-8">
                  {/* Logo Container with Glassmorphism */}
                  <div className="relative group flex-shrink-0">
                    {/* Glow Effect Background */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-cyan-400/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Main Logo Card */}
                    <div className="relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-4 border-white/90">
                      {/* Subtle Inner Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-blue-50 opacity-50"></div>

                      {/* Logo */}
                      <div className="relative">
                        <img
                          src="/logo-penta-valent.png"
                          alt="PT Penta Valent - Healthcare & Beyond"
                          className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges - Restored & Enlarged */}
                  <div className="flex flex-row lg:flex-col gap-4 justify-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-2xl backdrop-blur-sm hover:from-cyan-500/20 hover:to-blue-500/20 transition-all flex-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                      <span className="text-sm font-black text-white uppercase tracking-wider">Trusted Partner</span>
                    </div>
                    <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/20 rounded-2xl backdrop-blur-sm hover:from-blue-500/20 hover:to-indigo-500/20 transition-all flex-1">
                      <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-black text-white uppercase tracking-wider">ISO Certified</span>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="relative">
                  {/* Decorative Line */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>

                  <p className="text-blue-100/80 text-sm leading-relaxed font-medium">
                    {t('footer.description')}
                  </p>
                </div>



                {/* Social Media */}
                <div>
                  <h4 className="text-sm font-bold text-white/80 mb-4 uppercase tracking-wider">
                    {t('contact.social.label')}
                  </h4>
                  <div className="flex gap-3">
                    {social.map((item) => (
                      <a
                        key={item.name}
                        href={item.link}
                        className={`w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center ${item.color} transition-all duration-300 group hover:scale-110 hover:shadow-lg hover:shadow-white/20`}
                        aria-label={item.name}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Contact - 3 Columns for Balanced Proportions */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Column 1: Quick Links */}
              <div>
                <h4 className="text-white font-black text-sm mb-6 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-4 bg-accent rounded-full"></div>
                  {t('footer.about')}
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.key}>
                      <button
                        onClick={() => onNavigate(link.key)}
                        className="text-blue-100/70 text-sm hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group hover-move-icon"
                      >
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Investors (Center) */}
              <div>
                <h4 className="text-white font-black text-sm mb-6 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-4 bg-accent rounded-full"></div>
                  {t('nav.investor')}
                </h4>
                <ul className="space-y-3">
                  {investors.map((link) => (
                    <li key={link.key}>
                      <button
                        onClick={() => onNavigate(link.key)}
                        className="text-blue-100/70 text-sm hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group hover-move-icon"
                      >
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Contact Cards (Far Right) */}
              <div className="flex flex-col gap-4">
                {/* Office Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 group hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-all">
                      <svg className="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-sm mb-1">Kantor Pusat</h5>
                      <p className="text-blue-100/70 text-[11px] leading-relaxed">
                        Jl. Tanah Abang III No. 12<br />
                        Jakarta Pusat 10160
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 group hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-all">
                      <svg className="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-sm mb-1">Hubungi Kami</h5>
                      <p className="text-blue-100/70 text-[11px] leading-relaxed">
                        T. (021) 345-6789<br />
                        E. info@pentavalent.co.id
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 group hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-all">
                      <svg className="w-5 h-5 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-white font-bold text-sm mb-1">Jam Operasional</h5>
                      <p className="text-blue-100/70 text-[11px] leading-relaxed">
                        Senin - Jumat: 08:30 - 17:00 WIB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-blue-100/50 text-xs font-medium">
                © {new Date().getFullYear()} PT PENTA VALENT TBK. {t('footer.rights')}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {['Privacy Policy', 'Legal Notice', 'Ethics Code', 'Whistleblowing'].map((item) => (
                  <a key={item} href="#" className="text-blue-100/50 hover:text-white text-xs transition-colors font-medium">
                    {item}
                  </a>
                ))}
                <a href="/admin" className="text-blue-100/30 hover:text-accent flex items-center gap-1.5 transition-colors group">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Admin Portal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
