import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Branch {
  id: string;
  name: string;
  type: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

const NetworkSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalBranch, setModalBranch] = useState<Branch | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('province');

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const provinces = ['all', ...new Set(branches.map(b => b.province))];

  const filteredBranches = selectedProvince === 'all'
    ? branches
    : branches.filter(b => b.province === selectedProvince);

  const branchCount = branches.filter(b => b.type === 'branch').length;
  const depoCount = branches.filter(b => b.type === 'depo').length;

  // Calculate total slides (4 cards per slide)
  const totalSlides = Math.ceil(filteredBranches.length / 4);

  // Auto-slide effect
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <section id="network" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden text-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* Header - Premium & Modern */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          {/* Floating Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -top-10 -right-20 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-xl rounded-full shadow-lg shadow-slate-200/50 border border-white/60 mb-8 relative overflow-hidden group hover:scale-105 transition-transform">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Live Indicator */}
            <div className="relative flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50"></span>
              </span>
              <span className="text-xs font-black text-slate-700 uppercase tracking-[0.25em] relative">{t('network.header.title')}</span>
            </div>
          </div>

          {/* Main Title with Gradient Animation */}
          <h2 className="text-2xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 relative">
            <span className="text-slate-900">Penta Valent </span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 animate-gradient-x">
                {language === 'id' ? 'Network' : 'Network'}
              </span>
              {/* Underline Decoration */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </span>
          </h2>

          {/* Subtitle with Enhanced Typography */}
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            {t('network.header.desc')}
          </p>

          {/* Decorative Line */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
        </div>

        {/* Stats Overview - Redesigned for Premium Look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative px-4">
          {[
            { label: t('network.stats.main'), value: branchCount, icon: '🏢', color: 'blue', accent: 'from-blue-600 to-indigo-600' },
            { label: t('network.stats.depots'), value: depoCount, icon: '📦', color: 'cyan', accent: 'from-cyan-500 to-blue-500' },
            { label: t('network.stats.provinces'), value: '34', icon: '🗺️', color: 'indigo', accent: 'from-indigo-600 to-purple-600' },
            { label: 'On-Time Delivery', value: '99.8%', icon: '⚡', color: 'amber', accent: 'from-amber-500 to-orange-500' }
          ].map((stat, idx) => (
            <div key={idx} className="group relative bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              {/* Animated Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}></div>

              <div className="flex items-start justify-between relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-2xl group-hover:scale-110 transition-all duration-500 shadow-inner border border-slate-100 group-hover:bg-gradient-to-br ${stat.accent} group-hover:text-white`}>
                  {stat.icon}
                </div>

                {idx === 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-full border border-cyan-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span className="text-[8px] font-black text-cyan-600 uppercase tracking-widest">Live</span>
                  </div>
                )}
              </div>

              <div className="mt-8 relative z-10">
                <div className="text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter transition-all duration-500 group-hover:text-cyan-600">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                  {stat.label}
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>

        {/* The Map Dashboard - Seamless & Precise */}
        <div className="relative w-full mb-24 group">

          <div className="relative w-full bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
            {/* Map Container - Image defines dimensions for perfect dot alignment */}
            <div
              className="relative w-full bg-slate-50"
              onClick={() => setSelectedBranchId(null)}
            >
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>

              {/* The Map Image - Use w-full h-auto so dots stay perfectly synced */}
              <img
                src="/map-indonesia-new.jpg"
                alt="Map of Indonesia"
                className="w-full h-auto block mix-blend-multiply opacity-90 contrast-125"
              />

              {/* Connection Lines - Decorative Pulse */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent blur-2xl animate-pulse"></div>
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Interactive Dots */}
              {branches.map((branch) => {
                const minLng = 95.0;
                const maxLng = 141.0;
                const minLat = -15.0;
                const maxLat = 11.0;

                // Calculate percentages
                let xPercent = ((branch.longitude - minLng) / (maxLng - minLng)) * 100;
                let yPercent = ((maxLat - branch.latitude) / (maxLat - minLat)) * 100;

                // Manual Check: Shift Left Adjustment
                // "Geser kekiri sedikit" -> Subtract from X
                xPercent = xPercent - 1.5;

                if (!xPercent || !yPercent) return null;

                const isSelected = selectedBranchId === branch.id;

                return (
                  <div
                    key={branch.id}
                    className={`absolute group transition-all duration-200 ${isSelected ? 'z-50' : 'z-10 hover:z-40'}`}
                    style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // If we click a specific dot, select it.
                      setSelectedBranchId(branch.id);
                    }}
                  >
                    <div className="relative -ml-1.5 -mt-1.5 cursor-pointer p-1">
                      {/* Ping Animation */}
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${branch.type === 'branch' ? 'bg-sky-400' : 'bg-cyan-400'}`}></div>

                      {/* Main Dot */}
                      <div className={`relative rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 border-[1.5px] md:border-[3px] border-white ${isSelected ? 'scale-150 ring-2 md:ring-4 ring-black/5' : 'group-hover:scale-125'} ${branch.type === 'branch' ? 'bg-sky-600 w-2.5 h-2.5 md:w-4 md:h-4' : 'bg-cyan-500 w-2 h-2 md:w-3.5 md:h-3.5'}`}></div>

                      {/* Info Card (Visible on Click) */}
                      {isSelected && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 z-50 animate-fadeIn origin-bottom cursor-default" onClick={(e) => e.stopPropagation()}>
                          <div className="bg-slate-900/95 backdrop-blur-xl text-white p-4 md:p-5 rounded-2xl shadow-2xl shadow-slate-900/50 border border-slate-700/50 w-64 md:w-72 text-left relative transform transition-all">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${branch.type === 'branch' ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8]' : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                  {branch.type === 'branch' ? 'Kantor Cabang' : 'Depo Logistik'}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBranchId(null);
                                }}
                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>

                            {/* Content */}
                            <h4 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight">{branch.name}</h4>
                            <div className="text-xs md:text-sm font-medium text-slate-400 mb-3">{branch.city}, {branch.province}</div>

                            <div className="flex items-start gap-3 text-xs text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
                              <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              <p className="leading-relaxed opacity-90">
                                {branch.address || 'Detail alamat belum tersedia.'}
                              </p>
                            </div>

                            {/* Arrow */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rotate-45 border-r border-b border-slate-700/50"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Map Footer Legend - Responsive Position */}
              <div className="w-full flex justify-center py-4 md:absolute md:bottom-6 md:left-6 md:w-auto md:py-0 z-20 border-t border-slate-100 md:border-t-0 bg-slate-50/50 md:bg-transparent">
                <div className="flex items-center gap-3 md:gap-6 bg-white/80 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg border border-slate-200/60 transition-transform hover:scale-105 scale-90 md:scale-100 origin-center md:origin-bottom-left">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-sky-600 border-2 border-white shadow-md ring-1 ring-sky-100"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Cabang Utama</span>
                  </div>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-white shadow-md ring-1 ring-cyan-100"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Depo Logistik</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Cards Slider Section */}
          <div className="relative mt-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4 border-b border-slate-200 pb-10">
              <div>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">{t('map.header')}</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium">{t('map.subHeader')}</p>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCurrentSlide(0);
                  }}
                  className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <option value="all">{t('network.filter.all')}</option>
                  {provinces.slice(1).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cards Grid/Slider */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500 opacity-${loading ? '50' : '100'}`}>
              {(showAll ? filteredBranches : filteredBranches.slice(0, 8)).map((branch, idx) => {
                // Professional Color Palette Rotation
                const colors = [
                  { theme: 'from-[#0A2351] via-[#1E40AF] to-blue-900', accent: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'shadow-blue-500/10' },
                  { theme: 'from-[#065F46] via-[#059669] to-emerald-900', accent: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'shadow-emerald-500/10' },
                  { theme: 'from-[#4C1D95] via-[#7C3AED] to-purple-900', accent: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', glow: 'shadow-purple-500/10' },
                  { theme: 'from-[#92400E] via-[#D97706] to-amber-900', accent: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'shadow-amber-500/10' },
                  { theme: 'from-[#991B1B] via-[#DC2626] to-red-900', accent: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', glow: 'shadow-red-500/10' },
                  { theme: 'from-[#312E81] via-[#4338CA] to-indigo-900', accent: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', glow: 'shadow-indigo-500/10' },
                ];
                const color = colors[idx % colors.length];

                return (
                  <div key={branch.id} className="group bg-white rounded-[3rem] p-0 shadow-2xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-700 border border-slate-100/50 overflow-hidden hover:-translate-y-4 flex flex-col h-full relative">
                    {/* Premium Header */}
                    <div className={`h-40 relative overflow-hidden transition-all duration-700 bg-gradient-to-br ${color.theme}`}>
                      {/* Abstract Shapes */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-xl"></div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl`}>
                            {branch.type === 'branch' ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" /></svg>
                            ) : (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            )}
                          </div>
                          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{branch.type}</span>
                          </div>
                        </div>

                        {/* City Badge */}
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-ping ${color.accent.replace('text-', 'bg-')}`}></div>
                          <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{branch.city}</span>
                        </div>
                      </div>

                      {/* Floating Icon Background */}
                      <div className="absolute -right-4 -bottom-4 opacity-10 text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000">
                        {branch.type === 'branch' ? (
                          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" /></svg>
                        ) : (
                          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-10 flex-grow flex flex-col">
                      <div className="mb-8 flex-grow">
                        <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                          {branch.name}
                        </h4>
                        <div className="h-1.5 w-12 bg-slate-100 rounded-full mb-6 group-hover:w-full transition-all duration-1000 overflow-hidden">
                          <div className={`h-full w-full bg-gradient-to-r ${color.theme} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left`}></div>
                        </div>
                        <div className="flex gap-4">
                          <svg className={`w-5 h-5 flex-shrink-0 mt-1 ${color.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            {branch.address || 'Alamat lengkap tersedia melalui portal kontak kami.'}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => setModalBranch(branch)}
                        className={`w-full h-16 rounded-[1.5rem] bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-[0.2em] border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-500 flex items-center justify-center gap-4 group/btn overflow-hidden relative`}
                      >
                        <span className="relative z-10">Lihat Peta</span>
                        <div className="w-8 h-8 rounded-xl bg-slate-200 group-hover/btn:bg-white/20 flex items-center justify-center transition-colors relative z-10">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBranches.length > 8 && (
              <div className="mt-16 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-12 py-4 rounded-full bg-white border-2 border-slate-100 text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-xl shadow-slate-200/50 hover:shadow-cyan-500/10 group"
                >
                  <span className="flex items-center gap-3">
                    {showAll ? (
                      <>
                        Sembunyikan Lokasi
                        <svg className="w-4 h-4 rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </>
                    ) : (
                      <>
                        Lihat {filteredBranches.length - 8} Lokasi Lainnya
                        <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Premium Map Modal */}
        {modalBranch && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <div
              className="absolute inset-0 bg-[#051129]/90 backdrop-blur-xl animate-in fade-in duration-500"
              onClick={() => setModalBranch(null)}
            ></div>

            <div className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-700">
              <div className="grid lg:grid-cols-12 h-full max-h-[85vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
                {/* Left: Map Preview */}
                <div className="lg:col-span-7 h-[300px] lg:h-[600px] relative bg-slate-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${modalBranch.latitude},${modalBranch.longitude}&z=15&output=embed`}
                    allowFullScreen
                    className="opacity-90 contrast-110"
                  ></iframe>

                  {/* Map Overlay Decor */}
                  <div className="absolute inset-0 pointer-events-none border-[20px] border-white/10 rounded-[2.5rem]"></div>
                </div>

                {/* Right: Branch Details */}
                <div className="lg:col-span-5 p-10 lg:p-16 flex flex-col justify-between bg-white relative">
                  <button
                    onClick={() => setModalBranch(null)}
                    className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                  >
                    <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                        {modalBranch.type}
                      </div>
                      <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {modalBranch.city}
                      </div>
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                      {modalBranch.name}
                    </h2>

                    <div className="space-y-8 mt-12">
                      <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Office Address</p>
                          <p className="text-lg font-bold text-slate-700 leading-relaxed">{modalBranch.address}</p>
                        </div>
                      </div>

                      <div className="flex gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hubungi Kami</p>
                          <p className="text-xl font-bold text-slate-900 tracking-tight">{modalBranch.phone || '(021) 345-6789'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 lg:mt-0 pb-20 md:pb-0 relative z-[60]">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(modalBranch.name + ' ' + modalBranch.city)}`, '_blank')}
                      className="w-full h-18 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group/dir relative z-[60]"
                    >
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                      Dapatkan Petunjuk Arah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NetworkSection;
