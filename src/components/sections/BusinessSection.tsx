import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import useEmblaCarousel from 'embla-carousel-react';

interface BusinessLine {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  features?: string[];
  stats?: { label: string; value: string }[];
  images?: string[];
  image_url?: string;
  sort_order: number;
}

const BusinessSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    fetchBusinessData();
  }, [language]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [activeTab, emblaApi, businessLines]);

  const fetchBusinessData = async () => {
    try {
      const { data, error } = await supabase
        .from('business_lines')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBusinessLines(data || []);
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };



  if (loading || businessLines.length === 0) return null;

  return (
    <section id="business" className="py-20 md:py-40 bg-white relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header Section */}
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="lg:max-w-2xl relative z-10">
            <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-xl shadow-primary/5">
              {t('business.tagline')}
            </span>
            <h2 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8 md:mb-10 text-slate-900">
              {t('business.title.text')} <br />
              <span className="text-cyan-500 italic">{t('business.title.italic')}</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              {t('business.description')}
            </p>
          </div>

          {/* Decorative Digital Ecosystem - Balanced Executive Layout */}
          <div className="hidden lg:block absolute top-0 right-0 w-[480px] h-[350px] pointer-events-none overflow-visible">
            {/* Background Orbital Paths */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-slate-100 rounded-full opacity-50 group-hover/tabs:border-cyan-100 transition-colors duration-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-slate-50 rounded-full opacity-30 animate-spin-slow"></div>

            {/* Performance Pillar - Top Right Anchor */}
            <div className="absolute top-10 -right-4 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in-up z-20">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-black">PT</div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-lg"></div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block leading-none mb-1">Market Reach</span>
                <span className="text-cyan-600 font-black text-xs leading-none">+94.8% YoY</span>
              </div>
            </div>

            {/* Floating Strategy Nodes - Strategic Arc Placement */}
            <div className="absolute top-36 left-0 w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-50 flex items-center justify-center animate-bounce-slow z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" /></svg>
              </div>
            </div>

            <div className="absolute bottom-4 right-32 w-24 h-24 bg-white rounded-[2rem] shadow-2xl border border-white flex items-center justify-center animate-float z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
            </div>

            {/* Connecting Flux Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 480 350">
              <path d="M100 180 Q 200 220 380 160" stroke="currentColor" fill="none" className="text-cyan-500" strokeWidth="1" strokeDasharray="6 6" />
              <path d="M150 280 Q 280 200 400 320" stroke="currentColor" fill="none" className="text-blue-500" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* Futuristic Tab Switcher */}
          <div className="flex flex-col lg:flex-row bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner group/tabs relative z-10 w-full lg:w-auto gap-2 lg:gap-0">
            {businessLines.map((line, index) => (
              <button
                key={line.id}
                onClick={() => setActiveTab(index)}
                className={`relative flex-1 px-6 py-4 lg:px-10 lg:py-5 rounded-[1.5rem] lg:rounded-[2rem] text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all duration-700 flex items-center justify-center gap-3 ${activeTab === index
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {activeTab === index && (
                  <div className="absolute inset-0 bg-primary animate-in fade-in zoom-in duration-500 rounded-[1.5rem] lg:rounded-[2rem]"></div>
                )}
                <span className="relative z-10 text-center">{language === 'id' ? line.title_id : line.title_en}</span>
                {activeTab === index && (
                  <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-accent relative z-10 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Display Card */}
        <div className="bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] group/main">
          <div className="grid lg:grid-cols-12 min-h-[500px] lg:min-h-[650px]">
            {/* Left: Interactive Visuals */}
            <div className="lg:col-span-5 relative h-[400px] lg:h-auto overflow-hidden">
              <div className="embla h-full w-full" ref={emblaRef}>
                <div className="embla__container h-full w-full">
                  {((businessLines[activeTab].images && businessLines[activeTab].images.length > 0)
                    ? businessLines[activeTab].images
                    : [businessLines[activeTab].image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200']
                  ).map((img, idx) => (
                    <div key={idx} className="embla__slide relative h-full w-full flex-none">
                      <img
                        src={img}
                        alt={`${businessLines[activeTab].title_en} ${idx + 1}`}
                        className="w-full h-full object-cover transition-all duration-[4000ms] group-hover/main:scale-110 contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 mix-blend-multiply transition-opacity group-hover/main:opacity-40"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sophisticated Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

              <div className="absolute bottom-12 left-12 right-12 z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-cyan-500 rounded-full mb-6 shadow-lg shadow-cyan-500/20">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('business.division')}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tighter">
                  {t('business.integrity')} <br />
                  <span className="opacity-60">{t('business.transaction')}</span>
                </h3>
              </div>

              {/* Slider Progress Indicators */}
              <div className="absolute top-12 right-12 flex gap-2">
                {((businessLines[activeTab].images && businessLines[activeTab].images.length > 0)
                  ? businessLines[activeTab].images
                  : [businessLines[activeTab].image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200']
                ).map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === 0 ? 'w-8 bg-cyan-500' : 'w-2 bg-white/30'}`}></div>
                ))}
              </div>
            </div>

            {/* Right: Content & Intelligence */}
            <div className="lg:col-span-7 p-6 md:p-12 lg:p-24 flex flex-col justify-center bg-white relative">
              {/* Subtle background letter */}
              <div className="absolute top-0 right-0 text-[20rem] font-black text-slate-50 leading-none select-none pointer-events-none opacity-50">
                {String.fromCharCode(65 + activeTab)}
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl md:text-4xl lg:text-6xl font-black text-slate-900 mb-6 md:mb-10 tracking-tighter leading-none">
                  {language === 'id' ? businessLines[activeTab].title_id : businessLines[activeTab].title_en}
                </h3>
                <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed mb-12 md:mb-16 max-w-xl">
                  {language === 'id' ? businessLines[activeTab].description_id : businessLines[activeTab].description_en}
                </p>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-10 mb-20">
                  {(businessLines[activeTab].features || [
                    'National Logistics Network',
                    'Cold Chain Management',
                    'AI-Driven Inventory',
                    'Regulatory Compliance'
                  ]).map((feature, index) => (
                    <div key={index} className="flex items-center gap-5 group/feat">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 transition-all group-hover/feat:bg-cyan-500 group-hover/feat:text-white group-hover/feat:shadow-xl group-hover/feat:shadow-cyan-500/20 group-hover/feat:-translate-y-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-slate-900 font-black text-sm tracking-tight block">{feature}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 block">{t('business.feature.certified')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Executive Stats Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 pt-16 border-t border-slate-100">
                  {(businessLines[activeTab].stats || [
                    { label: 'Market Reach', value: '34 Branches' },
                    { label: 'Experience', value: '55+ Years' },
                    { label: 'Partners', value: '70+ Principals' }
                  ]).map((stat, index) => (
                    <div key={index} className="group/stat">
                      <div className="text-2xl md:text-4xl font-black text-slate-900 mb-2 group-hover/stat:text-cyan-500 transition-colors tracking-tighter">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover/stat:text-slate-600 transition-colors">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Advantage Cards - Fully Reimagined */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10 mt-20 md:mt-32">
          {[
            {
              title: t('business.advantage.cert.title'),
              desc: t('business.advantage.cert.desc'),
              icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              color: 'from-blue-600 to-indigo-700',
              bg: 'bg-blue-50'
            },
            {
              title: t('business.advantage.innovation.title'),
              desc: t('business.advantage.innovation.desc'),
              icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.137 2.137l2.387-.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.137-2.137l-2.387.477z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>,
              color: 'from-cyan-500 to-blue-600',
              bg: 'bg-cyan-50'
            },
            {
              title: t('business.advantage.coverage.title'),
              desc: t('business.advantage.coverage.desc'),
              icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
              color: 'from-indigo-600 to-purple-700',
              bg: 'bg-indigo-50'
            }
          ].map((item, i) => (
            <div key={i} className="group relative bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden">
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-bl-[8rem] transform transition-transform duration-700 group-hover:scale-150 group-hover:bg-slate-900 group-hover:opacity-5 opacity-50`}></div>

              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center text-white mb-10 shadow-lg shadow-blue-900/10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                {item.icon}
              </div>

              <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 tracking-tighter group-hover:text-cyan-600 transition-colors">
                {item.title}
              </h4>

              <p className="text-sm md:text-lg text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                {item.desc}
              </p>

              {/* Bottom Decorative Line */}
              <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${item.color} transition-all duration-700 group-hover:w-full`}></div>
            </div>
          ))}
        </div>
      </div>
    </section >
  );
};

export default BusinessSection;
