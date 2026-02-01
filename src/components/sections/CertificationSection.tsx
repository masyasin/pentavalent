import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Certification {
  id: string;
  name: string;
  description_id: string;
  description_en: string;
  certificate_number: string;
}

const CertificationSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const certIcons: { [key: string]: JSX.Element } = {
    'CDOB': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'CDAKB': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    'PBF': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'CCP': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    'ISO 9001:2015': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    'ISO 14001:2015': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'OHSAS 18001': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'GDP': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  };

  return (
    <section id="certifications" className="py-24 md:py-32 lg:py-48 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-[40%] flex-shrink-0">
            <span className="inline-block px-5 py-2 bg-accent/5 text-accent rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-accent/10">
              {language === 'id' ? 'Kepatuhan & Tata Kelola' : 'Compliance & Governance'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-[56px] font-black py-2 mb-10 text-slate-900 tracking-tighter leading-[1.05]">
              {language === 'id' ? 'Tata Kelola' : 'Corporate'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block pr-4">{language === 'id' ? 'Perusahaan yang Baik' : 'Governance'}</span>
            </h2>
            <div className="space-y-6">
              {[
                { id: 'Etika & Integritas Profesional', en: 'Professional Ethics & Integrity', badge: 'GCG' },
                { id: 'Pengendalian Risiko Internal', en: 'Internal Risk Management', badge: 'Audit' },
                { id: 'Transparansi Digital Terpadu', en: 'Integrated Digital Transparency', badge: 'Compliance' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-100 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{language === 'id' ? item.id : item.en}</span>
                      <span className="px-2 py-0.5 bg-slate-900/5 text-slate-400 text-[8px] font-black rounded-md border border-slate-900/10 group-hover:bg-blue-600/10 group-hover:text-blue-600 group-hover:border-blue-600/20 transition-all">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[60%] flex items-center justify-center">
            <div className="relative w-full max-w-2xl group">
              {/* Premium Glassmorphism Box */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-[3rem] opacity-20 blur-xl group-hover:opacity-40 transition-all duration-700"></div>

              <div className="relative p-10 md:p-14 bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white/40 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10">
                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>

                  <blockquote className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight italic mb-8">
                    {language === 'id'
                      ? '"Komitmen teguh pada standar tertinggi kepatuhan dan integritas korporasi."'
                      : '"An unwavering commitment to the highest standards of corporate compliance and integrity."'}
                  </blockquote>

                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-10"></div>

                  <button
                    onClick={() => {
                      window.location.href = '/about/legality-achievements';
                    }}
                    className="group/btn px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  >
                    {language === 'id' ? 'Tata Kelola Perusahaan' : 'Corporate Governance'}
                    <svg className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Global Standards Footer */}
        <div className="mt-20 md:mt-28 pt-12 border-t border-slate-200/60">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
            {['ISO 9001:2015', 'CDOB (BPOM)', 'CDAKB (KEMENKES)', 'GDP Certified'].map((standard, i) => (
              <div
                key={i}
                className="group relative px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-xs md:text-sm font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-[0.15em] transition-colors whitespace-nowrap">
                    {standard}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-60">
            Penta Valent Global Quality Standards & Compliance
          </p>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
