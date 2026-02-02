import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronRight as BreadcrumbRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Slide {
    id: string;
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    image_url: string;
}

interface PageSliderProps {
    pagePath: string;
    breadcrumbLabel: string;
    parentLabel?: string;
}

const PageSlider: React.FC<PageSliderProps> = ({ pagePath, breadcrumbLabel, parentLabel }) => {
    const { language, t } = useLanguage();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: slides.length > 1,
        duration: 40,
        skipSnaps: false
    }, slides.length > 1 ? [Autoplay({ delay: 6000, stopOnInteraction: false })] : []);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            // Normalize path: remove hash, remove trailing slash, ensure leading slash
            let cleanPath = pagePath.replace('#', '');
            if (cleanPath.endsWith('/') && cleanPath.length > 1) {
                cleanPath = cleanPath.slice(0, -1);
            }
            if (!cleanPath.startsWith('/')) {
                cleanPath = '/' + cleanPath;
            }

            const { data, error } = await supabase
                .from('page_banners')
                .select('*')
                .or(`page_path.eq.${cleanPath},page_path.eq.${cleanPath}/`)
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (!error && data && data.length > 0) {
                setSlides(data);
            } else {
                // Fallback slide if none found in DB
                setSlides([{
                    id: 'fallback',
                    title_id: breadcrumbLabel,
                    title_en: breadcrumbLabel,
                    subtitle_id: parentLabel || '',
                    subtitle_en: parentLabel || '',
                    image_url: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=2070&auto=format&fit=crop'
                }]);
            }
        };
        fetchSlides();
    }, [pagePath, breadcrumbLabel, parentLabel]);

    useEffect(() => {
        if (!emblaApi) return;
        
        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        
        // Initial set
        onSelect();

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi]);

    if (slides.length === 0) return null;

    return (
        <section className="relative h-[45dvh] min-h-[350px] md:h-[55dvh] md:min-h-[500px] lg:h-[70vh] lg:min-h-[600px] w-full overflow-hidden bg-slate-900">
            {/* Embla Viewport */}
            <div className="h-full w-full embla" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] h-full w-full overflow-hidden bg-slate-900">
                            {/* Image with Advanced Overlays */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={slide.image_url}
                                    alt={language === 'id' ? slide.title_id : slide.title_en}
                                    className={`w-full h-full object-cover transition-all duration-[8000ms] ease-out ${selectedIndex === index ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`}
                                    loading="eager"
                                    style={{ 
                                        willChange: 'transform, opacity',
                                        objectPosition: 'center 30%'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/20 z-10"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                                <div className="max-w-5xl mx-auto space-y-8">
                                    <AnimatePresence mode="wait">
                                        {selectedIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                                className="space-y-6"
                                            >
                                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full mb-2">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                                                        {breadcrumbLabel}
                                                    </span>
                                                </div>

                                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tighter text-white italic drop-shadow-2xl">
                                                    {language === 'id' ? slide.title_id : slide.title_en}
                                                </h1>

                                                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8 mb-8 select-none">
                                                    {/* Home Node */}
                                                    <a href="/" className="flex items-center group">
                                                        <div className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-transparent group-hover:bg-cyan-400 transition-colors shrink-0"></div>
                                                        <div className="w-6 md:w-10 h-0.5 bg-cyan-400"></div>
                                                        <span className="ml-3 text-[10px] md:text-xs font-bold text-cyan-100/80 group-hover:text-cyan-400 uppercase tracking-[0.2em] transition-colors">
                                                            {language === 'id' ? 'Beranda' : 'Home'}
                                                        </span>
                                                    </a>

                                                    {/* Parent Node (Optional) */}
                                                    {parentLabel && (
                                                        <div className="flex items-center">
                                                            <div className="w-6 md:w-10 h-0.5 bg-cyan-400"></div>
                                                            <div className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-transparent shrink-0"></div>
                                                            <div className="w-6 md:w-10 h-0.5 bg-cyan-400"></div>
                                                            <span className="ml-3 text-[10px] md:text-xs font-bold text-cyan-100/80 uppercase tracking-[0.2em]">
                                                                {parentLabel}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Current Page Node */}
                                                    <div className="flex items-center">
                                                        <div className="w-6 md:w-10 h-0.5 bg-cyan-400"></div>
                                                        <div className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-cyan-950 grid place-items-center shrink-0 z-10">
                                                            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                                                        </div>
                                                        <div className="w-6 md:w-10 h-0.5 bg-cyan-400"></div>
                                                        <span className="ml-3 text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-[0.2em] shadow-cyan-500/20 drop-shadow-sm">
                                                            {breadcrumbLabel}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-lg md:text-2xl text-blue-100/70 font-medium max-w-3xl mx-auto leading-relaxed">
                                                    {language === 'id' ? slide.subtitle_id : slide.subtitle_en}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            {/* Side Arrows (Desktop) - Only show if more than 1 slide */}
            {slides.length > 1 && (
                <div className="hidden xl:block pointer-events-none">
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        className="absolute left-12 top-1/2 -translate-y-1/2 z-40 p-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all pointer-events-auto group"
                    >
                        <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        className="absolute right-12 top-1/2 -translate-y-1/2 z-40 p-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all pointer-events-auto group"
                    >
                        <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* Bottom Interface Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 md:h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
        </section>
    );
};

export default PageSlider;
