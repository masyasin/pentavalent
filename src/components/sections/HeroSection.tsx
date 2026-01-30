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
    <section className="relative h-[100dvh] min-h-[600px] md:min-h-[700px] overflow-hidden bg-[#0a1128]">
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
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549213821-4708d624a1d1?auto=format&fit=crop&q=80&w=1600';
                      }}
                    />
                  )}
                </div>
                {/* Advanced Overlay for Maximum Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 z-10"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center pt-24 md:pt-0 z-20">
                <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 w-full">
                  <div className="max-w-4xl">
                    {/* Decorative Top Line */}
                    {((language === 'id' ? slide.title_id : slide.title_en) || (language === 'id' ? slide.subtitle_id : slide.subtitle_en)) && (
                      <div className="flex items-center gap-4 mb-4 md:mb-6 animate-fade-in">
                        <div className="h-[2px] w-8 md:w-12 bg-accent shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                        <span className="text-[10px] md:text-sm font-black text-accent uppercase tracking-[0.4em]">Enterprise Logistics Intelligence</span>
                      </div>
                    )}

                    {/* Title */}
                    {(language === 'id' ? slide.title_id : slide.title_en) && (
                      <div className="relative mb-6 transform transition-all duration-1000">
                        <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter transition-all duration-1000 ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                          {language === 'id' ? (
                            <div className="space-y-2">
                              {slide.title_id.split(' ').map((word, i) => (
                                <span key={i} className="inline-block mr-4">{word}</span>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {slide.title_en.split(' ').map((word, i) => (
                                <span key={i} className="inline-block mr-4">{word}</span>
                              ))}
                            </div>
                          )}
                        </h1>
                      </div>
                    )}

                    {/* Subtitle */}
                    {(language === 'id' ? slide.subtitle_id : slide.subtitle_en) && (
                      <p className={`text-base sm:text-lg md:text-2xl mb-8 max-w-2xl font-medium leading-relaxed text-white/70 transition-all duration-1000 delay-300 ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                        {language === 'id' ? slide.subtitle_id : slide.subtitle_en}
                      </p>
                    )}

                    {/* Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center gap-4 mt-8 transition-all duration-1000 delay-500 ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                      {(language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en) && (
                        <button
                          onClick={() => onNavigate(slide.cta_primary_link.replace('#', ''))}
                          className="w-full sm:w-auto px-10 py-5 wow-button-gradient text-white font-black rounded-full shadow-2xl flex items-center justify-center gap-3 group/btn touch-active"
                        >
                          {language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en}
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                      )}
                      {slide.cta_secondary_link && (
                        <button
                          onClick={() => onNavigate(slide.cta_secondary_link.replace('#', ''))}
                          className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black rounded-full hover:bg-white/20 transition-all duration-500 flex items-center justify-center gap-3 touch-active"
                        >
                          {language === 'id' ? slide.cta_secondary_text_id : slide.cta_secondary_text_en}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators - Bottom Navigation */}
      <div className="absolute bottom-12 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 flex items-end justify-between">
          <div className="flex gap-4 pointer-events-auto">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="group relative py-4 focus:outline-none"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className={`h-[4px] transition-all duration-500 rounded-full ${selectedIndex === i ? 'w-16 bg-accent' : 'w-8 bg-white/20 group-hover:bg-white/40'}`}>
                  {selectedIndex === i && (
                    <div
                      className="h-full bg-white rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Current Protocol</span>
              <span className="text-sm font-black text-accent uppercase tracking-widest">{String(selectedIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
