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
}

const PageSlider: React.FC<PageSliderProps> = ({ pagePath, breadcrumbLabel }) => {
    const { language, t } = useLanguage();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        duration: 40,
        skipSnaps: false
    }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchSlides = async () => {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .eq('cta_secondary_link', pagePath)
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (!error && data) {
                setSlides(data);
            }
        };
        fetchSlides();
    }, [pagePath]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    if (slides.length === 0) return null;

    return (
        <section className="relative h-[55dvh] min-h-[500px] lg:h-[70vh] lg:min-h-[600px] w-full overflow-hidden bg-slate-950">
            {/* Embla Viewport */}
            <div className="h-full w-full embla" ref={emblaRef}>
                <div className="flex h-full w-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] h-full w-full overflow-hidden">
                            {/* Image with Advanced Overlays */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={slide.image_url}
                                    alt={language === 'id' ? slide.title_id : slide.title_en}
                                    className={`w-full h-full object-cover transition-all duration-[8000ms] ${selectedIndex === index ? 'scale-110 opacity-60' : 'scale-100 opacity-0'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent z-10"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60 z-10"></div>
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

                                                <div className="w-16 h-1.5 bg-primary mx-auto rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>

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

            {/* Navigation Controls */}
            <div className="absolute bottom-16 left-0 right-0 z-30 flex flex-col items-center gap-8 pointer-events-none">
                {/* Indicators */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className="group py-4 focus:outline-none"
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            <div className={`h-[4px] transition-all duration-500 rounded-full ${selectedIndex === i ? 'w-16 bg-primary shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'w-8 bg-white/20 group-hover:bg-white/40'}`}>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 pointer-events-auto">
                    <a href="/" className="hover:text-primary transition-colors">{language === 'id' ? 'Beranda' : 'Home'}</a>
                    <BreadcrumbRight size={14} className="opacity-30" />
                    <span className="text-white/80">{breadcrumbLabel}</span>
                </div>
            </div>

            {/* Side Arrows (Desktop) */}
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

            {/* Bottom Interface Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
        </section>
    );
};

export default PageSlider;
