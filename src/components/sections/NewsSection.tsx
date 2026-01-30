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
    <section id="news" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.01] pointer-events-none"></div>

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
            {/* Side Navigation Buttons */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${canScrollPrev
                ? 'bg-white/90 border-gray-200 text-primary shadow-2xl hover:bg-cyan-500 hover:text-white hover:-translate-x-2 border-transparent'
                : 'bg-gray-50/50 border-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${canScrollNext
                ? 'bg-white/90 border-gray-200 text-primary shadow-2xl hover:bg-cyan-500 hover:text-white hover:translate-x-2 border-transparent'
                : 'bg-gray-50/50 border-gray-100 text-gray-300 cursor-not-allowed'
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
                      className="group bg-white rounded-[2rem] md:rounded-[3.5rem] h-full overflow-hidden border border-gray-100 enterprise-shadow hover:-translate-y-4 transition-all duration-700 cursor-pointer relative"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={item.featured_image || newsImages[index % newsImages.length]}
                          alt={language === 'id' ? item.title_id : item.title_en}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-8 left-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${categoryColors[item.category] || categoryColors.default}`}>
                            {categoryLabels[item.category] || item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:p-10 flex flex-col h-[calc(100%-16/10)]">
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          <svg className="w-4 h-4 wow-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(item.published_at)}
                        </div>

                        <div className="space-y-4 mb-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${categoryColors[item.category] || categoryColors.default}`}>
                            {categoryLabels[item.category] || item.category}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:wow-text-primary transition-colors duration-300 leading-tight tracking-tight line-clamp-2 min-h-[3.5rem]">
                            {language === 'id' ? item.title_id : item.title_en}
                          </h3>
                        </div>

                        <div
                          className="text-gray-400 text-sm font-bold leading-relaxed line-clamp-2 mb-10 flex-grow prose prose-sm max-w-none prose-p:m-0 prose-p:leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: (language === 'id' ? item.excerpt_id : item.excerpt_en) || '' }}
                        />

                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between mt-auto">
                          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest group-hover:text-cyan-600 inline-block transition-colors">{t('news.readmore')}</span>
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all transform group-hover:translate-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
