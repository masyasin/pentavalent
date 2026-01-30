import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface NewsItem {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  featured_image: string;
  category: string;
  published_at: string;
}

const NewsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, news]);

  useEffect(() => {
    console.log('NewsSection mounted, fetching news...');
    fetchNews();
  }, [language]); // Re-fetch when language changes too, just in case

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categoryColors: { [key: string]: string } = {
    'award': 'bg-accent/10 text-accent',
    'expansion': 'bg-primary/10 text-primary',
    'investor': 'bg-accent/10 text-accent',
    'partnership': 'bg-primary/10 text-primary',
    'press_release': 'bg-blue-500/10 text-blue-600',
    'corporate': 'bg-indigo-500/10 text-indigo-600',
    'default': 'bg-secondary text-muted-foreground',
  };

  const categoryLabels: { [key: string]: string } = {
    'award': t('news.cat.award'),
    'expansion': t('news.cat.expansion'),
    'investor': t('news.cat.investor'),
    'partnership': t('news.cat.partnership'),
    'press_release': t('news.cat.press_release'),
    'corporate': t('news.cat.corporate'),
  };

  const newsImages = [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  ];

  return (
    <section id="news" className="py-24 md:py-36 bg-white relative overflow-hidden">
      {/* Super Premium Background Decor */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-transparent rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-50/30 via-blue-50/20 to-transparent rounded-full blur-[100px] -ml-64 -mb-64"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6-fourth.png')]"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {t('news.tagline')}
            </span>
            <h2 className="text-2xl sm:text-6xl font-black tracking-tighter leading-[1.1] py-2 mb-8 text-slate-900">
              {t('news.title.text')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">{t('news.title.italic')}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {t('news.description')}
            </p>
          </div>
          <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={() => navigate('/news')}
              className="px-10 py-5 wow-button-gradient text-white font-black rounded-2xl flex items-center gap-3 group shadow-2xl shadow-primary/20"
            >
              {t('news.cta')}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[500px] bg-gray-50 rounded-[3rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="relative group/slider">
            {/* Premium Side Navigation Buttons */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${canScrollPrev
                ? 'bg-white/90 border-slate-200 text-slate-600 shadow-2xl hover:bg-white hover:border-cyan-400 hover:text-cyan-600 hover:-translate-x-2'
                : 'bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed opacity-0'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${canScrollNext
                ? 'bg-white/90 border-slate-200 text-slate-600 shadow-2xl hover:bg-white hover:border-cyan-400 hover:text-cyan-600 hover:translate-x-2'
                : 'bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed opacity-0'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Carousel Container */}
            <div className="embla overflow-hidden px-4 -mx-4" ref={emblaRef}>
              <div className="flex">
                {news.map((item, index) => (
                  <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-6">
                    <article
                      onClick={() => navigate(`/news/${item.slug}`)}
                      className="group relative bg-white rounded-[3rem] md:rounded-[4rem] h-full overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(6,182,212,0.15)] hover:-translate-y-5 transition-all duration-700 cursor-pointer"
                    >
                      {/* Interactive Top Shine */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>

                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20"></div>

                      <div className="relative aspect-[16/11] overflow-hidden">
                        <img
                          src={item.featured_image || newsImages[index % newsImages.length]}
                          alt={language === 'id' ? item.title_id : item.title_en}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                        />

                        {/* Glassmorphism Category Badge */}
                        <div className="absolute top-8 left-8 z-20">
                          <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-xl border border-white/40 shadow-xl flex items-center gap-2 ${categoryColors[item.category] || categoryColors.default}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            {categoryLabels[item.category] || item.category}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>

                      <div className="p-10 md:p-14 flex flex-col h-[calc(100%-16/11)] relative">
                        {/* Date with Accent */}
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-10 h-px bg-slate-200 group-hover:w-16 group-hover:bg-cyan-500 transition-all duration-700"></div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-[0.25em] transition-colors">{formatDate(item.published_at)}</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-all duration-500 leading-tight tracking-tight line-clamp-2 min-h-[4rem] mb-6">
                          {language === 'id' ? item.title_id : item.title_en}
                        </h3>

                        <div
                          className="text-slate-500 text-base md:text-lg leading-relaxed font-medium line-clamp-2 mb-12 opacity-80 group-hover:opacity-100 transition-opacity flex-grow prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: (language === 'id' ? item.excerpt_id : item.excerpt_en) || '' }}
                        />

                        {/* Premium Footer */}
                        <div className="pt-10 border-t border-slate-50 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3 group/link">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">{t('news.readmore')}</span>
                            <div className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </div>
                          </div>

                          <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] group-hover:rotate-12">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile View All */}
        <div className="lg:hidden text-center mt-12">
          <button
            onClick={() => navigate('/news')}
            className="w-full py-5 wow-button-gradient text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px]"
          >
            {t('news.discovery')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
