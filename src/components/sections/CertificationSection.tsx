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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'CDAKB': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    'PBF': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'CCP': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    'ISO 9001:2015': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    'ISO 14001:2015': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'OHSAS 18001': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'GDP': (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  };

  return (
    <section id="certifications" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>

      <div className="max-w-[1700px] mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/3">
            <span className="inline-block px-5 py-2 bg-accent/5 text-accent rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-accent/10">
              {t('qa.title')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none mb-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('qa.subtitle')?.split(' ')[0]} <br />
              <span className="italic">{t('qa.subtitle')?.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
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
                  <span className="text-lg font-black text-primary uppercase tracking-tight">{item}</span>
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
              (certifications || []).map((cert) => (
                <div key={cert.id} className="group p-10 bg-white rounded-[3rem] border border-gray-100 enterprise-shadow hover:ring-4 ring-primary/5 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      {certIcons[cert.name] || (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] bg-accent/10 px-4 py-1.5 rounded-full">Active</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-4 tracking-tight leading-tight group-hover:text-accent transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-8">
                    {language === 'id' ? cert.description_id : cert.description_en}
                  </p>
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Registration ID: <br /> <span className="text-primary mt-1 block tracking-normal">{cert.certificate_number || `TR-00${cert.id.slice(0, 4)}`}</span></span>
                    <button className="text-primary hover:text-accent transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global standards footer */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap justify-center items-center gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
          {['ISO 9001:2015', 'CDOB (BPOM)', 'CDAKB (KEMENKES)', 'Tbk List Price'].map((standard, i) => (
            <div key={i} className="text-xl font-black text-primary tracking-tighter uppercase">{standard}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
