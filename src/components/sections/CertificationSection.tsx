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
    <section id="certifications" className="py-24 md:py-32 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/3">
            <span className="inline-block px-5 py-2 bg-accent/5 text-accent rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-accent/10">
              {t('qa.title')}
            </span>
            <h2 className="text-fluid-h1 py-2 mb-10 text-slate-900">
              {t('qa.subtitle')?.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-4">{t('qa.subtitle')?.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-fluid-body text-gray-500 mb-10">
              {t('qa.desc')}
            </p>
            <div className="space-y-6">
              {[
                t('qa.cdob.title'),
                'CDAKB Certified (MDDP)',
                t('qa.iso.title')
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-lg font-black wow-text-primary inline-block uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
              ))
            ) : (
              (certifications || []).map((cert, idx) => (
                <div
                  key={cert.id}
                  className="group relative p-8 sm:p-10 bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Animated top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-t-[2.5rem]"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {certIcons[cert.name] || (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-cyan-600 uppercase tracking-[0.25em] bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-100">Active</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-cyan-600 transition-colors">
                      {cert.name}
                    </h3>

                    <p className="text-fluid-body text-slate-600 mb-6">
                      {language === 'id' ? cert.description_id : cert.description_en}
                    </p>

                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Registration ID:</span>
                        <span className="text-sm font-black text-cyan-600 tracking-wide">{cert.certificate_number || `ISO-0MS-2024-XYZ`}</span>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-cyan-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 group/btn">
                        <svg className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Floating decoration */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              ))
            )}
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
