import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import useEmblaCarousel from 'embla-carousel-react';
import { useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(false);

  // Hardcoded for structural integrity based on request
  const divisions = [
    {
      title_id: 'Distribusi Farmasi',
      title_en: 'Pharmaceutical Distribution',
      desc_id: 'Obat Resep & Non-Resep',
      desc_en: 'Prescription & Non-Prescription',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.137 2.137l2.387-.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.137-2.137l-2.387.477z" />
        </svg>
      ),
      features_id: ['Ethical Products', 'Generic Drugs', 'Cold Chain System'],
      features_en: ['Ethical Products', 'Generic Drugs', 'Cold Chain System'],
      color: 'from-blue-600 to-blue-800',
      long_desc_id: 'Mendistribusikan produk farmasi resep dan non-resep kepada rumah sakit, apotek, klinik, dan fasilitas pelayanan kesehatan lainnya.',
      long_desc_en: 'Distributing prescription and non-prescription pharmaceutical products to hospitals, pharmacies, clinics, and other healthcare facilities.',
      path: '/business/pharmaceuticals'
    },
    {
      title_id: 'Alat Kesehatan & Produk Medis',
      title_en: 'Medical Devices & Products',
      desc_id: 'Peralatan & Instrumen Medis',
      desc_en: 'Medical Devices & Instruments',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      features_id: ['Hospital Equipment', 'Lab Diagnostics', 'Medical Consumables'],
      features_en: ['Hospital Equipment', 'Lab Diagnostics', 'Medical Consumables'],
      color: 'from-cyan-500 to-cyan-700',
      long_desc_id: 'Menyediakan berbagai alat kesehatan dan produk medis dengan pengelolaan distribusi yang sesuai standar mutu dan keamanan.',
      long_desc_en: 'Providing various medical devices and products with distribution management that complies with quality and safety standards.',
      path: '/business/medical-equipment'
    },
    {
      title_id: 'Produk Konsumen & Kesehatan',
      title_en: 'Consumer & Health Products',
      desc_id: 'FMCG & Personal Care',
      desc_en: 'FMCG & Personal Care',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      features_id: ['OTC Medicines', 'Personal Care', 'Beauty & Skin'],
      features_en: ['OTC Medicines', 'Personal Care', 'Beauty & Skin'],
      color: 'from-emerald-500 to-emerald-700',
      long_desc_id: 'Distribusi produk kesehatan konsumen, OTC, personal care, dan produk kecantikan melalui jaringan ritel dan modern trade.',
      long_desc_en: 'Distribution of consumer health products, OTC, personal care, and beauty products through retail and modern trade networks.',
      path: '/business/consumer-goods'
    }
  ];

  const navigate = useNavigate();

  if (loading) return null;

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
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${div.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-[3rem]`}></div>

              <div className={`w-24 h-24 bg-gradient-to-br ${div.color} rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                {div.icon}
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight transition-all">
                {language === 'id' ? div.title_id : div.title_en}
              </h3>

              <p className="text-slate-500 text-[15px] font-bold leading-relaxed mb-8 px-4 uppercase tracking-tighter">
                {language === 'id' ? div.desc_id : div.desc_en}
              </p>

              <div className="w-full flex flex-col gap-4 mb-10">
                {(language === 'id' ? div.features_id : div.features_en).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 group-hover:bg-white group-hover:border-slate-200 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-900 text-[10px] font-black">
                      ✓
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(div.path)}
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
