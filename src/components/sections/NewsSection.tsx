import React, { useState, useEffect, useCallback } from 'react';
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
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

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
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);

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
    'default': 'bg-secondary text-muted-foreground',
  };

  const categoryLabels: { [key: string]: string } = {
    'award': t('news.cat.award'),
    'expansion': t('news.cat.expansion'),
    'investor': t('news.cat.investor'),
    'partnership': t('news.cat.partnership'),
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
            <h2 className="text-2xl sm:text-6xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('news.title.text')} <br />
              <span className="italic">{t('news.title.italic')}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {t('news.description')}
            </p>
          </div>
          <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button className="flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-[10px] enterprise-shadow group hover-move-icon">
              {t('news.archive')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
                ? 'bg-white/90 border-gray-200 text-primary shadow-2xl hover:bg-primary hover:text-white hover:-translate-x-2'
                : 'bg-gray-50/50 border-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full flex items-center justify-center transition-all backdrop-blur-md border ${canScrollNext
                ? 'bg-white/90 border-gray-200 text-primary shadow-2xl hover:bg-primary hover:text-white hover:translate-x-2'
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
                      onClick={() => setSelectedNews(item)}
                      className="group bg-white rounded-[2rem] md:rounded-[3.5rem] h-full overflow-hidden border border-gray-100 enterprise-shadow hover:-translate-y-4 transition-all duration-700 cursor-pointer relative"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={item.featured_image || newsImages[index % newsImages.length]}
                          alt={language === 'id' ? item.title_id : item.title_en}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-8 left-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md text-primary shadow-sm`}>
                            {categoryLabels[item.category] || item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:p-10 flex flex-col h-[calc(100%-16/10)]">
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(item.published_at)}
                        </div>

                        <h3 className="text-2xl font-black text-primary mb-6 group-hover:text-accent transition-colors leading-tight tracking-tighter line-clamp-2 min-h-[3.5rem]">
                          {language === 'id' ? item.title_id : item.title_en}
                        </h3>

                        <p className="text-gray-400 text-sm font-bold leading-relaxed line-clamp-2 mb-10 flex-grow">
                          {language === 'id' ? item.excerpt_id : item.excerpt_en}
                        </p>

                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between mt-auto">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:text-accent transition-colors">{t('news.readmore')}</span>
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all transform group-hover:translate-x-2">
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
          <button className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-[10px]">
            {t('news.discovery')}
          </button>
        </div>

        {/* Modal Detail Upgrade: Executive Briefing Layout */}
        {selectedNews && (
          <div
            className="fixed inset-0 bg-[#051129]/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto"
            onClick={() => setSelectedNews(null)}
          >
            <div
              className="bg-white rounded-[2rem] md:rounded-[4rem] max-w-6xl w-full enterprise-shadow relative animate-in fade-in zoom-in duration-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid lg:grid-cols-12 max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
                {/* Left Column: Visual & Categories */}
                <div className="lg:col-span-5 relative h-[300px] lg:h-auto group">
                  <img
                    src={selectedNews.featured_image || newsImages[0]}
                    alt={language === 'id' ? selectedNews.title_id : selectedNews.title_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>

                  <button
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-8 left-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all transform hover:-translate-x-2 z-30 lg:hidden"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  <div className="absolute bottom-12 left-12 right-12 text-white">
                    <span className="inline-block px-5 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-6 shadow-xl shadow-accent/20">
                      {categoryLabels[selectedNews.category] || selectedNews.category}
                    </span>
                    <div className="text-sm font-bold text-white/60 tracking-widest uppercase">
                      {formatDate(selectedNews.published_at)}
                    </div>
                  </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-7 p-6 md:p-16 lg:p-24 bg-white relative">
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-12 right-12 w-14 h-14 bg-gray-50 hover:bg-primary transition-all rounded-2xl hidden lg:flex items-center justify-center text-primary hover:text-white group/close"
                  >
                    <svg className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <div className="max-w-2xl">
                    <h2 className="text-3xl lg:text-5xl font-black text-primary mb-12 tracking-tighter leading-[1.1]">
                      {language === 'id' ? selectedNews.title_id : selectedNews.title_en}
                    </h2>

                    <p className="text-xl text-primary/40 font-black italic leading-relaxed mb-12 border-l-4 border-accent pl-8">
                      {language === 'id' ? selectedNews.excerpt_id : selectedNews.excerpt_en}
                    </p>

                    <div className="prose prose-lg max-w-none text-gray-500 font-medium leading-[1.8] space-y-8">
                      {language === 'id' ? selectedNews.content_id : selectedNews.content_en}
                    </div>

                    <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-xs font-black tracking-tighter italic shadow-xl shadow-primary/20">PV</div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('news.source')}</p>
                          <p className="text-sm font-black text-primary tracking-tight">{t('news.comm')}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-[10px]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        {t('news.share')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
