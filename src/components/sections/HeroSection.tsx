import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
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

const HeroSlideItem: React.FC<{
  slide: HeroSlide;
  index: number;
  selectedIndex: number;
  language: string;
  onNavigate: (section: string) => void;
}> = ({ slide, index, selectedIndex, language, onNavigate }) => {
  const [imgError, setImgError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Helper to optimize Unsplash URLs
  const getOptimizedUrl = (url: string) => {
    if (url.includes('images.unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}auto=format&fit=crop&q=80&w=${isMobile ? 800 : 1920}`;
    }
    return url;
  };

  return (
    <div className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden max-md:overflow-x-hidden">
      {/* Background Media with Subtle Zoom */}
      <div className="absolute inset-0 overflow-hidden bg-[#0a1128]">
        {/* Deep Atmospheric Fallback Gradient (visible if image fails or is loading) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a1128] to-slate-950"></div>
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div
          className={`absolute inset-0 transition-all duration-[8000ms] ease-out ${selectedIndex === index ? 'animate-ken-burns opacity-100' : 'opacity-0'}`}
        >
          {slide.video_url && !isMobile ? (
            <video
              src={slide.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            !imgError && (
              <img
                src={getOptimizedUrl(slide.image_url)}
                alt={language === 'id' ? slide.title_id : slide.title_en}
                width={1920}
                height={1080}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                sizes="(max-width: 768px) 100vw, 100vw"
                onError={() => {
                  console.warn('Hero image failed, activating premium gradient fallback');
                  setImgError(true);
                }}
              />
            )
          )}
        </div>
        {/* Advanced Overlay for Maximum Readability - Corporate Style */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent z-10 max-md:bg-slate-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-12 md:pb-20 lg:pb-28 z-20 max-md:pb-20">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 w-full max-md:px-4">
          <div className="max-w-4xl max-md:w-full">
            {/* Institutional Badge */}
            <div className={`inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg mb-8 transition-all duration-1000 max-md:mb-4 max-md:px-3 max-md:py-1.5 ${selectedIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse max-md:w-1.5 max-md:h-1.5 max-md:shrink-0"></div>
              <span className="text-[13px] font-bold text-white uppercase tracking-[0.3em] max-md:text-[10px]">IDX: PEVE</span>
              <div className="w-px h-3 bg-white/20"></div>
              <span className="text-[13px] font-medium text-white/70 uppercase tracking-widest max-md:text-[10px]">{language === 'id' ? 'Terbuka (Tbk)' : 'Publicly Listed'}</span>
            </div>

            {/* Title */}
            {(language === 'id' ? slide.title_id : slide.title_en) && (
              <div className="relative mb-6 transform transition-all duration-1000 max-md:mb-4">
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight transition-all duration-1000 drop-shadow-2xl max-md:text-3xl ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  {language === 'id' ? slide.title_id : slide.title_en}
                </h1>
              </div>
            )}

            {/* Subtitle */}
            {(language === 'id' ? slide.subtitle_id : slide.subtitle_en) && (
              <p className={`text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl font-medium leading-relaxed text-blue-50/80 transition-all duration-1000 delay-300 drop-shadow-lg max-md:text-sm max-md:mb-6 max-md:leading-relaxed ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                {language === 'id' ? slide.subtitle_id : slide.subtitle_en}
              </p>
            )}

            {/* Buttons */}
            <div className={`flex flex-col sm:flex-row items-center gap-4 mt-4 transition-all duration-1000 delay-500 max-md:gap-3 ${selectedIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {(language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en) && slide.cta_primary_link && (
                <button
                  onClick={() => onNavigate(slide.cta_primary_link.replace('#', ''))}
                  className="w-full sm:w-auto px-10 py-5 bg-accent text-white hover:bg-white hover:text-slate-900 transition-all duration-500 font-black text-[13px] uppercase tracking-[0.25em] rounded-xl shadow-2xl flex items-center justify-center gap-4 group/btn max-md:w-full max-md:min-h-[44px] max-md:py-4 max-md:px-6 max-md:text-[11px]"
                >
                  {language === 'id' ? slide.cta_primary_text_id : slide.cta_primary_text_en}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2 max-md:shrink-0 max-md:w-3 max-md:h-3" />
                </button>
              )}
              {(language === 'id' ? slide.cta_secondary_text_id : slide.cta_secondary_text_en) && slide.cta_secondary_link && (
                <button
                  onClick={() => onNavigate(slide.cta_secondary_link.replace('#', ''))}
                  className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all duration-500 font-black text-[13px] uppercase tracking-[0.25em] rounded-xl flex items-center justify-center gap-4 group/btn max-md:w-full max-md:min-h-[44px] max-md:py-4 max-md:px-6 max-md:text-[11px]"
                >
                  {language === 'id' ? slide.cta_secondary_text_id : slide.cta_secondary_text_en}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
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
        // Exclude slides intended for specific sub-pages (PageSlider)
        // Exclude slides intended for specific sub-pages (PageSlider)
        // Using % without slash ensures we catch both "/about" and "/about/..."
        .not('cta_secondary_link', 'ilike', '/about%')
        .not('cta_secondary_link', 'ilike', '/investor%')
        .not('cta_secondary_link', 'ilike', '/business%')
        .not('cta_secondary_link', 'ilike', '/news%')
        .not('cta_secondary_link', 'ilike', '/career%')
        .not('cta_secondary_link', 'ilike', '/contact%')
        .not('cta_secondary_link', 'ilike', '/privacy-policy%')
        .not('cta_secondary_link', 'ilike', '/code-of-conduct%')
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
      <section className="min-h-screen bg-[#0F172A] flex items-center justify-center max-md:overflow-x-hidden">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-primary/20 rounded-full max-md:w-12 max-md:h-12"></div>
          <div className="absolute inset-0 w-20 h-20 border-t-2 border-accent rounded-full animate-spin max-md:w-12 max-md:h-12"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[100dvh] min-h-[600px] md:h-[90vh] md:min-h-[750px] lg:h-screen lg:min-h-[850px] overflow-hidden bg-[#0a1128] max-md:overflow-x-hidden">
      <div className="overflow-hidden h-full max-md:overflow-x-hidden" ref={emblaRef}>
        <div className="flex h-full max-md:flex-row">
          {slides.map((slide, index) => (
            <HeroSlideItem
              key={slide.id}
              slide={slide}
              index={index}
              selectedIndex={selectedIndex}
              language={language}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>


      {/* Floating Scroll Indicator - Luxurious Detail */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 animate-fade-in delay-1000 max-md:bottom-6 max-md:gap-2">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1 max-md:text-[8px]">Explore Journey</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent/60 via-accent to-transparent relative max-md:h-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-bounce max-md:w-1 max-md:h-1"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
