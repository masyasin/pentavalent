import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

interface HeroSlide {
  id: string;
  title_id: string;
  title_en: string;
  subtitle_id: string;
  subtitle_en: string;
  image_url: string;
  video_url?: string;
  cta_primary_text_id: string;
  cta_primary_text_en: string;
  cta_primary_link: string;
  cta_secondary_text_id: string;
  cta_secondary_text_en: string;
  cta_secondary_link: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0); // Reset progress on manual/auto slide change
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();

    const slideDuration = 8000; // 8 seconds per slide
    const intervalTime = 50; // Update progress every 50ms
    const step = (intervalTime / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          emblaApi.scrollNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  if (loading || slides.length === 0) {
    return (
      <section className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-t-2 border-accent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#0a1128]">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden">
              {/* Background Media with Subtle Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-[8000ms] ease-out ${selectedIndex === index ? 'animate-ken-burns opacity-100' : 'opacity-0'}`}
                >
                  {slide.video_url ? (
                    <video
                      src={slide.video_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slide.image_url}
                      alt={language === 'id' ? slide.title_id : slide.title_en}
                      className="w-full h-full object-cover"
                      loading="eager"
                      key={slide.id}
                      onError={(e) => {
                        console.error('Image load error:', slide.image_url);
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549213821-4708d624a1d1?auto=format&fit=crop&q=80&w=1600'; // High bright fallback
                      }}
                    />
                  )}
                </div>
                {/* Optimized Overlay for maximum clarity */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>

                {/* Cinematic Light Streak */}
                <div className="absolute bottom-[20%] -left-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-[100px] rotate-[-5deg] animate-pulse"></div>
                <div className="absolute bottom-[18%] -left-1/4 w-[150%] h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-[20px] rotate-[-5deg]"></div>

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center pt-24 z-10">
                <div className="max-w-[1700px] mx-auto px-8 md:px-12 lg:px-16 w-full">
                  <div className="max-w-3xl">
                    {/* Decorative Top Line - Show ONLY if content exists */}
                    {((language === 'id' ? slide.title_id : slide.title_en) || (language === 'id' ? slide.subtitle_id : slide.subtitle_en) || (language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en)) && (
                      <div className="flex items-center gap-4 mb-10 animate-slide-in">
                        <div className="h-[2px] w-12 bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                        <span className="text-[10px] sm:text-[11px] font-black text-accent uppercase tracking-[0.4em]">Enterprise Logistics Intelligence</span>
                      </div>
                    )}

                    {/* Title - Conditional with Slide Reveal Effect */}
                    {(language === 'id' ? slide.title_id : slide.title_en) && (
                      <div className="relative group">
                        <div className={`absolute -left-4 top-0 w-2 h-full bg-accent transition-all duration-700 ${selectedIndex === index ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}`}></div>
                        <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white transition-all duration-1000 ${selectedIndex === index ? 'animate-title-pop' : 'opacity-0'}`}>
                          {language === 'id' ? slide.title_id : slide.title_en}
                        </h1>
                      </div>
                    )}

                    {/* Subtitle - Conditional */}
                    {(language === 'id' ? slide.subtitle_id : slide.subtitle_en) && (
                      <p className="text-xl sm:text-2xl mb-6 max-w-2xl font-medium leading-relaxed animate-slide-in [animation-delay:200ms] text-white/90">
                        {language === 'id' ? slide.subtitle_id : slide.subtitle_en}
                      </p>
                    )}

                    {/* Separator - Conditional based on title/subtitle existence */}
                    {((language === 'id' ? slide.title_id : slide.title_en) || (language === 'id' ? slide.subtitle_id : slide.subtitle_en)) && (
                      <div className="flex items-center gap-4 mb-12 animate-fade-in [animation-delay:300ms]">
                        <div className="h-px w-12 bg-accent/50"></div>
                        <span className="text-xs sm:text-sm font-black text-white/60 uppercase tracking-[0.6em] italic">Healthcare & Beyond</span>
                      </div>
                    )}

                    {/* Buttons - Always Show if text is defined */}
                    {(language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en) && (
                      <div className="flex flex-wrap gap-6 animate-slide-in [animation-delay:400ms]">
                        <button
                          onClick={() => onNavigate(slide.cta_primary_link.replace('#', ''))}
                          className="px-10 py-5 bg-accent text-white font-black rounded-2xl hover:opacity-90 transition-all duration-500 shadow-2xl flex items-center gap-3 group"
                        >
                          {language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en}
                          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                        <button
                          onClick={() => onNavigate(slide.cta_secondary_link.replace('#', ''))}
                          className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all duration-500"
                        >
                          {language === 'id' ? slide.cta_secondary_text_id : slide.cta_secondary_text_en}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
