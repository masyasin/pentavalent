import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface TargetMarketSliderProps {
    images: string[];
    activeTab: string;
    onImageClick: (img: string) => void;
    label: string;
    labelEn: string;
    language: 'id' | 'en';
}

const TargetMarketSlider: React.FC<TargetMarketSliderProps> = ({
    images,
    activeTab,
    onImageClick,
    label,
    labelEn,
    language
}) => {
    // Initialize Embla with specific settings for this component instance
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'center', skipSnaps: false },
        [Autoplay({ delay: 4000, stopOnInteraction: false })]
    );

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());


    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const handleImageError = (imgUrl: string) => {
        setFailedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(imgUrl);
            return newSet;
        });
    };

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    // Filter out failed images so they don't take up space
    const validImages = useMemo(() => {
        const filtered = images.filter(url => !failedImages.has(url));
        if (filtered.length === 0) {
            // High quality fallback images if all else fails
            return [
                'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1516594798245-443f1f738723?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200'
            ];
        }
        return filtered;
    }, [images, failedImages]);

    return (
        <div key={activeTab} className="space-y-6 pt-10 border-t border-slate-100">
            <div className="relative px-6 py-4 mb-4">
                {/* Decorative Line/Frame */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                {/* Title Pill */}
                <div className="relative flex justify-center">
                    <div className="bg-white px-6 py-2 rounded-full border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center gap-3 z-10">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            {language === 'id' ? `Visualisasi ${label}` : `${labelEn} Visualization`}
                        </h4>
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>

            <div className="relative py-12 md:py-16 group/gal overflow-hidden">
                {/* Root Embla Container */}
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex touch-pan-y h-[320px] md:h-[550px] items-center">
                        {validImages.map((img, idx) => {
                            const isActive = selectedIndex === idx;

                            return (
                                <div
                                    className="flex-[0_0_80%] md:flex-[0_0_35%] min-w-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] relative"
                                    key={`${activeTab}-${idx}`}
                                    style={{
                                        transform: `scale(${isActive ? 1.05 : 0.85})`,
                                        opacity: isActive ? 1 : 0.5,
                                        zIndex: isActive ? 50 : 10,
                                        padding: '0 10px'
                                    }}
                                >
                                    <div
                                        className={`relative aspect-[3/4.5] w-full rounded-[2rem] md:rounded-[3rem] transition-all duration-1000 cursor-zoom-in ${isActive
                                            ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-4 ring-white/80 ring-offset-4 ring-offset-cyan-500/20'
                                            : 'shadow-xl translate-y-4'
                                            } bg-white overflow-hidden`}
                                        onClick={() => onImageClick(img)}
                                    >
                                        <img
                                            src={img}
                                            alt={`${activeTab} ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                            onError={() => handleImageError(img)}
                                        />

                                        {/* Premium Glass Effect Overlay on Inactive */}
                                        {!isActive && (
                                            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-all duration-500" />
                                        )}

                                        {/* Glossy Highlight Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Large Side Arrows */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-4 md:left-[12%] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-800 transition-all hover:scale-110 active:scale-95 z-[60] border border-slate-100/50"
                >
                    <ChevronLeft size={24} className="md:w-7 md:h-7" />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-4 md:right-[12%] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-800 transition-all hover:scale-110 active:scale-95 z-[60] border border-slate-100/50"
                >
                    <ChevronRight size={24} className="md:w-7 md:h-7" />
                </button>

                <div className="mt-16 flex justify-center">
                    <div className="flex items-center gap-6 bg-white py-4 px-10 rounded-full shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100">
                        <button
                            onClick={scrollPrev}
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                        >
                            <ChevronLeft size={22} strokeWidth={3} />
                        </button>
                        <div className="flex items-center gap-3">
                            {validImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => scrollTo(idx)}
                                    className={`transition-all duration-300 rounded-full ${selectedIndex === idx
                                        ? 'w-4 h-4 bg-blue-700'
                                        : 'w-4 h-4 border-2 border-slate-200 bg-transparent'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={scrollNext}
                            className="text-slate-400 hover:text-blue-700 transition-colors"
                        >
                            <ChevronRight size={22} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TargetMarketSlider;
