import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Advantage {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  icon: string;
}

const AboutSection: React.FC = () => {
  const { language } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [advantages, setAdvantages] = useState<Advantage[]>([]);

  const images = [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000", // Warehouse
    "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=1000", // Logistics/Trucks
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000", // Modern Office
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000", // Pharma/Lab
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"  // Meeting/Business
  ];

  useEffect(() => {
    fetchAdvantages();
  }, []);

  const fetchAdvantages = async () => {
    try {
      const { data, error } = await supabase
        .from('advantages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setAdvantages(data || []);
    } catch (error) {
      console.error('Error fetching advantages:', error);
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      }
    }, 4000); // 4 seconds per slide since it's an ambient slider

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section id="why-penta" className="py-24 md:py-32 bg-white relative overflow-hidden text-left">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Why Penta Valent - Differentiators Section */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
          <div className="lg:w-1/2">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[13px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {language === 'id' ? 'Kenapa Penta Valent' : 'Why Penta Valent'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-none">
              {language === 'id' ? 'Keunggulan' : 'Reasons behind'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block pr-4">{language === 'id' ? 'Kompetitif Kami' : 'Our Excellence'}</span>
            </h2>
            <div className="space-y-6">
              {advantages.map((item, i) => (
                <div key={item.id} className="group/diff p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="text-3xl bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-inner group-hover/diff:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1 transition-colors">
                        {language === 'id' ? item.title_id : item.title_en}
                      </h4>
                      <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                        {language === 'id' ? item.description_id : item.description_en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl p-10 transform translate-x-10 translate-y-10"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl aspect-[4/5] bg-white">
              <div className="absolute inset-0 z-10 pointer-events-none rounded-[3rem] ring-1 ring-inset ring-black/5"></div>
              <div className="h-full" ref={emblaRef}>
                <div className="flex h-full">
                  {images.map((src, idx) => (
                    <div className="flex-[0_0_100%] min-w-0 h-full relative" key={idx}>
                      <img
                        src={src}
                        alt={`Penta Valent Feature ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-[2000ms]"
                      />
                      {/* Subtle gradient overlay for better integration */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
