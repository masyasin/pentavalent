import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import useEmblaCarousel from 'embla-carousel-react';
import { useNavigate } from 'react-router-dom';

interface BusinessLine {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  subtitle_id: string;
  subtitle_en: string;
  description_id: string;
  description_en: string;
  features: string[];
  color_accent: string;
  icon_name: string;
}

const iconMap: Record<string, React.ReactNode> = {
  pill: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.137 2.137l2.387-.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.137-2.137l-2.387.477z" />
    </svg>
  ),
  microscope: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  'shopping-bag': (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  truck: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
    </svg>
  ),
  activity: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

const BusinessSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [divisions, setDivisions] = useState<BusinessLine[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinessLines();
  }, []);

  const fetchBusinessLines = async () => {
    try {
      const { data, error } = await supabase
        .from('business_lines')
        .select(`
          *,
          business_features (
            feature_id,
            feature_en,
            sort_order
          )
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter only the 3 main business lines for Homepage
        const mainSlugs = ['distribusi-alkes', 'distribusi-farmasi', 'produk-konsumen'];

        const filteredData = data.filter(item => mainSlugs.includes(item.slug));

        // Custom sort to ensure order: Pharma, Medical Devices, Consumer
        // Or user preferred order? Usually Pharma is first or center.
        // Let's sort by ID or predefined order.
        const sortedData = filteredData.sort((a, b) => {
          return mainSlugs.indexOf(a.slug) - mainSlugs.indexOf(b.slug);
        });

        setDivisions(sortedData.map(item => ({
          ...item,
          features: item.business_features
            ? item.business_features
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((f: any) => language === 'id' ? f.feature_id : f.feature_en)
            : []
        })));
      } else {
        // Fallback for safety
        setDivisions([]);
      }
    } catch (err) {
      console.error('Error fetching business lines:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && divisions.length === 0) return null;

  return (
    <section id="business" className="py-24 md:py-48 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <span className="inline-block px-5 py-2 bg-slate-900/5 text-slate-900 rounded-sm text-[13px] font-bold tracking-[0.3em] uppercase mb-8 border border-slate-900/10">
            {language === 'id' ? 'Lini Usaha Utama' : 'Main Business Lines'}
          </span>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-0 tracking-tighter uppercase">
            {language === 'id' ? 'Bidang Operasional &' : 'Operational Fields &'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic pr-4">{language === 'id' ? 'Layanan Terpadu' : 'Integrated Services'}</span>
          </h2>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {divisions.map((div, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-2xl hover:shadow-4xl transition-all duration-700 hover:-translate-y-4 flex flex-col items-center text-center"
            >
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${div.color_accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-[3rem]`}></div>

              <div className={`w-24 h-24 bg-gradient-to-br ${div.color_accent} rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                {iconMap[div.icon_name] || iconMap['pill']}
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight transition-all">
                {language === 'id' ? div.title_id : div.title_en}
              </h3>

              <p className="text-slate-500 text-[15px] font-bold leading-relaxed mb-8 px-4 uppercase tracking-tighter">
                {language === 'id' ? div.subtitle_id : div.subtitle_en}
              </p>

              <div className="w-full flex flex-col gap-4 mb-10">
                {div.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-900 text-[10px] font-black">
                      ✓
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/business/${div.slug}`)}
                className="mt-auto group/btn flex items-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-slate-900 transition-all duration-500 cursor-pointer"
              >
                DISCOVER CAPABILITIES
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-slate-900 group-hover/btn:text-white transition-all">
                  →
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
