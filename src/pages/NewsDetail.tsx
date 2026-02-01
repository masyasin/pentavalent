import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Facebook, Twitter, Linkedin, Link2, Share2, Calendar, User, ArrowRight, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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
    images?: string[];
    category: string;
    published_at: string;
}

interface Comment {
    id: string;
    user_name: string;
    email: string;
    content: string;
    is_admin_reply: boolean;
    parent_id: string | null;
    created_at: string;
}

const NewsDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentData, setCommentData] = useState({ name: '', email: '', message: '' });
    const [submittingComment, setSubmittingComment] = useState(false);

    // Captcha State
    const [captcha, setCaptcha] = useState({ q: '', a: 0 });
    const [userCaptcha, setUserCaptcha] = useState('');

    // Pagination State
    const [visibleComments, setVisibleComments] = useState(5);

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
        setUserCaptcha('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => {
            setCurrentIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    const heroImages = article?.images && article.images.length > 0
        ? article.images
        : (article?.featured_image ? [article.featured_image] : []);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticle();
    }, [slug]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const { data: current, error } = await supabase
                .from('news')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setArticle(current);

            if (current) {
                let { data: related } = await supabase
                    .from('news')
                    .select('*')
                    .eq('is_published', true)
                    .eq('category', current.category)
                    .neq('id', current.id)
                    .order('published_at', { ascending: false })
                    .limit(5);

                if (!related || related.length < 5) {
                    const existingIds = related?.map(n => n.id) || [];
                    existingIds.push(current.id);

                    const { data: recent } = await supabase
                        .from('news')
                        .select('*')
                        .eq('is_published', true)
                        .not('id', 'in', `(${existingIds.join(',')})`)
                        .order('published_at', { ascending: false })
                        .limit(5 - (related?.length || 0));

                    if (recent) {
                        related = [...(related || []), ...recent];
                    }
                }

                setRelatedArticles(related || []);

                const { data: commentsData } = await supabase
                    .from('news_comments')
                    .select('*')
                    .eq('news_id', current.id)
                    .eq('is_approved', true)
                    .order('created_at', { ascending: true });

                setComments(commentsData || []);
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            const { error } = await supabase
                .from('newsletter_subscriptions')
                .insert([{ email }]);

            if (error) {
                if (error.code === '23505') {
                    toast.info(language === 'id' ? 'Email sudah terdaftar!' : 'Email already subscribed!');
                } else {
                    throw error;
                }
            } else {
                setSubscribed(true);
                toast.success(language === 'id' ? 'Berhasil berlangganan!' : 'Subscribed successfully!');
                setTimeout(() => setSubscribed(false), 5000);
            }
            setEmail('');
        } catch (error: any) {
            console.error('Subscription error:', error);
            toast.error(language === 'id' ? 'Gagal berlangganan. Coba lagi.' : 'Failed to subscribe. Try again.');
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!article || !commentData.name || !commentData.email || !commentData.message) {
            toast.error(language === 'id' ? 'Mohon isi semua data' : 'Please fill all fields');
            return;
        }

        if (parseInt(userCaptcha) !== captcha.a) {
            toast.error(language === 'id' ? 'Jawaban captcha salah' : 'Incorrect captcha answer');
            generateCaptcha();
            return;
        }

        setSubmittingComment(true);
        try {
            const { error } = await supabase
                .from('news_comments')
                .insert([{
                    news_id: article.id,
                    user_name: commentData.name,
                    email: commentData.email,
                    content: commentData.message,
                    is_approved: true
                }]);

            if (error) throw error;

            toast.success(language === 'id' ? 'Komentar berhasil dikirim' : 'Comment submitted successfully');
            setCommentData({ name: '', email: '', message: '' });
            generateCaptcha();

            const { data } = await supabase
                .from('news_comments')
                .select('*')
                .eq('news_id', article.id)
                .eq('is_approved', true)
                .order('created_at', { ascending: true });

            setComments(data || []);
        } catch (error: any) {
            console.error('Comment error:', error);
            toast.error('Failed to submit comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const shareToSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(language === 'id' ? article?.title_id || '' : article?.title_en || '');
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(language === 'id' ? 'Tautan berhasil disalin!' : 'Link copied to clipboard!');
    };

    const handleNavigate = (section: string) => {
        if (section === 'contact' || section === 'faq' || section === 'sitemap') {
            window.location.href = `/${section}`;
        } else {
            window.location.href = `/#${section}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onNavigate={handleNavigate} activeSection="news" />
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
                <Footer onNavigate={handleNavigate} />
            </div>
        );
    }

    if (!article) return <div>Article not found</div>;

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Header onNavigate={handleNavigate} activeSection="news" />

            <section className="relative h-[60dvh] md:min-h-[550px] lg:h-[75vh] lg:min-h-[650px] w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0 embla h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {heroImages.map((img, idx) => (
                            <div key={idx} className="flex-[0_0_100%] h-full relative">
                                <img
                                    src={img}
                                    alt={`Hero ${idx}`}
                                    className="w-full h-full object-cover opacity-50 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent z-10"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 z-10"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <div className="max-w-6xl mx-auto px-6 text-center text-white space-y-6 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-full mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                                {article.category.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="relative">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] max-w-4xl mx-auto text-white italic px-4 drop-shadow-2xl">
                                {language === 'id' ? article.title_id : article.title_en}
                            </h1>
                            <div className="w-16 h-1 bg-primary mx-auto mt-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"></div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-90">
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                <Calendar size={14} className="text-primary" />
                                {formatDate(article.published_at)}
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                <User size={14} className="text-primary" />
                                <span className="text-white/80">Pentavalent Intelligence</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-12 md:-mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="relative mb-12 group">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full group-hover:w-1.5 transition-all"></div>
                                <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-8 text-[120px] font-black text-slate-200/30 select-none pointer-events-none italic leading-none">
                                        "
                                    </div>
                                    <div
                                        className="relative z-10 text-lg md:text-xl font-bold text-slate-700 leading-[1.6] prose prose-slate max-w-none prose-p:m-0 prose-p:leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: (language === 'id' ? article.excerpt_id : article.excerpt_en) || '' }}
                                    />
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="h-px w-8 bg-primary/30"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Executive Summary</span>
                                    </div>
                                </div>
                            </div>

                            <div dangerouslySetInnerHTML={{ __html: language === 'id' ? article.content_id : article.content_en }} className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-500 prose-p:leading-loose prose-a:text-primary prose-strong:text-slate-800 prose-img:rounded-2xl" />

                            <div className="mt-16 pt-10 border-t border-slate-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                        <Share2 size={18} className="text-primary" />
                                        Share Article
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => shareToSocial('facebook')} className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all touch-active active:scale-90"><Facebook size={20} /></button>
                                        <button onClick={() => shareToSocial('twitter')} className="w-11 h-11 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all touch-active active:scale-90"><Twitter size={20} /></button>
                                        <button onClick={() => shareToSocial('linkedin')} className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all touch-active active:scale-90"><Linkedin size={20} /></button>
                                        <button onClick={copyToClipboard} className="w-11 h-11 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all touch-active active:scale-90"><Link2 size={20} /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-10 border-t border-slate-100">
                                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <Mail className="text-primary" size={24} />
                                    Discussion ({comments.length})
                                </h4>

                                <div className="space-y-8 mb-12">
                                    {comments.filter(c => !c.parent_id).slice(0, visibleComments).map((comment) => (
                                        <div key={comment.id} className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-400 font-black text-xl">{comment.user_name.charAt(0)}</div>
                                                <div className="flex-1 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-black text-slate-900 text-sm">{comment.user_name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(comment.created_at)}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                            {comments.filter(reply => reply.parent_id === comment.id).map((reply) => (
                                                <div key={reply.id} className="flex gap-4 ml-12 md:ml-16">
                                                    <div className={`w-10 h-10 ${reply.is_admin_reply ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'} rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20`}>{reply.is_admin_reply ? 'A' : reply.user_name.charAt(0)}</div>
                                                    <div className={`flex-1 ${reply.is_admin_reply ? 'bg-primary/5 border-primary/10' : 'bg-white border-slate-100'} p-6 rounded-3xl border shadow-sm`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-slate-900 text-sm">{reply.is_admin_reply ? 'Admin Support' : reply.user_name}</span>
                                                                {reply.is_admin_reply && <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Official</span>}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(reply.created_at)}</span>
                                                        </div>
                                                        <p className="text-slate-600 text-sm leading-relaxed">{reply.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    {comments.filter(c => !c.parent_id).length > visibleComments && (
                                        <div className="text-center pt-4">
                                            <button onClick={() => setVisibleComments(prev => prev + 5)} className="px-8 py-3 bg-slate-50 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-slate-100 shadow-sm">
                                                {language === 'id' ? 'Tampilkan Lebih Banyak' : 'Load More Comments'}
                                            </button>
                                        </div>
                                    )}

                                    {comments.length === 0 && (
                                        <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                            <p className="text-slate-400 font-bold text-sm">No comments yet. Be the first to share your thoughts!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <h5 className="text-2xl font-black tracking-tighter mb-2">Leave a Comment</h5>
                                        <p className="text-white/60 text-sm mb-8">Your email address will not be published.</p>
                                        <form onSubmit={handleSubmitComment} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" placeholder="Your Name" value={commentData.name} onChange={(e) => setCommentData({ ...commentData, name: e.target.value })} className="bg-white/10 border-white/10 rounded-2xl px-6 py-4 text-sm focus:bg-white/20 focus:ring-2 focus:ring-primary/50 transition-all outline-none" required />
                                                <input type="email" placeholder="Your Email" value={commentData.email} onChange={(e) => setCommentData({ ...commentData, email: e.target.value })} className="bg-white/10 border-white/10 rounded-2xl px-6 py-4 text-sm focus:bg-white/20 focus:ring-2 focus:ring-primary/50 transition-all outline-none" required />
                                            </div>
                                            <textarea placeholder="Your Message" rows={4} value={commentData.message} onChange={(e) => setCommentData({ ...commentData, message: e.target.value })} className="w-full bg-white/10 border-white/10 rounded-2xl px-6 py-4 text-sm focus:bg-white/20 focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-none" required />

                                            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/10 group/captcha">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover/captcha:scale-110 transition-transform">
                                                        <span className="text-xs font-black uppercase">Solve</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-primary/20 text-primary px-5 py-3 rounded-xl font-black text-xl tracking-tighter border border-primary/10 shadow-xl">{captcha.q}</span>
                                                        <span className="text-xl font-black text-white/40">=</span>
                                                    </div>
                                                </div>
                                                <input type="number" placeholder="?" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} className="w-full sm:w-24 bg-white/10 border-2 border-white/10 rounded-2xl px-6 py-4 text-xl font-black text-white focus:bg-white/20 focus:border-primary transition-all outline-none text-center h-[64px]" required />
                                            </div>

                                            <button type="submit" disabled={submittingComment} className="w-full py-5 wow-button-gradient text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl disabled:opacity-50 touch-active active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                                {submittingComment ? 'Transmitting...' : 'Post Intelligence'}
                                                {!submittingComment && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-8">
                        {relatedArticles.length > 0 && (
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Related Intelligence</h3>
                                <div className="space-y-10">
                                    {relatedArticles.map((item) => {
                                        const categoryLabels: { [key: string]: string } = { 'award': t('news.cat.award'), 'expansion': t('news.cat.expansion'), 'investor': t('news.cat.investor'), 'partnership': t('news.cat.partnership'), 'press_release': t('news.cat.press_release'), 'corporate': t('news.cat.corporate') };
                                        const categoryColors: { [key: string]: string } = { 'award': 'bg-accent/10 text-accent', 'expansion': 'bg-primary/10 text-primary', 'investor': 'bg-accent/10 text-accent', 'partnership': 'bg-primary/10 text-primary', 'press_release': 'bg-blue-500/10 text-blue-600', 'corporate': 'bg-indigo-500/10 text-indigo-600', 'default': 'bg-secondary text-muted-foreground' };
                                        return (
                                            <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/news/${item.slug}`)}>
                                                <div className="aspect-video rounded-2xl overflow-hidden mb-5 relative">
                                                    <img src={item.featured_image} alt={item.title_en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                                </div>
                                                <div className="space-y-3">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${categoryColors[item.category] || categoryColors.default}`}>{categoryLabels[item.category] || item.category}</span>
                                                    <h4 className="font-black text-slate-900 leading-tight group-hover:text-primary transition-colors text-lg line-clamp-2">{language === 'id' ? item.title_id : item.title_en}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider"><span>{formatDate(item.published_at)}</span><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-primary" /></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="group relative bg-slate-900 p-10 md:p-12 rounded-[3rem] text-white overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
                            {/* Premium Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6-fourth.png')]"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                    <Mail className="text-cyan-400" size={32} strokeWidth={2.5} />
                                </div>

                                <h3 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
                                    Subscribe <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 italic">Intelligence</span>
                                </h3>

                                <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed max-w-xs">
                                    Get exclusive corporate insights and strategic updates delivered directly to your inbox.
                                </p>

                                {subscribed ? (
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 p-6 rounded-2xl text-center font-black text-emerald-400 animate-in zoom-in duration-500 flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        TRANSMISSION SECURED
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="space-y-6">
                                        <div className="relative group/input">
                                            <input
                                                type="email"
                                                placeholder="Enter your corporate email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full px-7 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] placeholder:text-white/30 text-white font-bold outline-none focus:bg-white/10 focus:border-cyan-500/50 transition-all backdrop-blur-md"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-5 wow-button-gradient text-white font-black uppercase tracking-[0.25em] text-[10px] rounded-[1.5rem] shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_40px_rgba(6,182,212,0.5)] transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3"
                                        >
                                            SUBSCRIBE NOW
                                            <ArrowRight size={16} strokeWidth={3} />
                                        </button>

                                        <p className="text-[9px] text-white/30 text-center font-bold tracking-widest uppercase">
                                            SECURES CHANNEL • NO SPAM
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default NewsDetail;
