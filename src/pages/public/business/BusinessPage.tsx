import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import PageSlider from '../../../components/common/PageSlider';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, TrendingUp, Search, X, Package, ShieldCheck, Zap, Activity, Users, Globe, Building2, Target, ArrowRight, Heart, Smile, Sparkles, Stethoscope, Leaf, Briefcase, Pill, Server, Handshake, CheckCircle2,
    Hospital, Building, Ambulance, ClipboardList, ShoppingBag, Store, ShoppingCart, Scissors, Gem, Warehouse, Home, Truck, Boxes, Coffee, Droplet
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import TargetMarketSlider from './components/TargetMarketSlider';

interface BusinessLine {
    id: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    features?: string[];
    stats?: { label: string; value: string }[];
    images: string[];
    rawImages: { image_url: string; sort_order: number }[];
    image_url?: string;
    slug: string;
}

const CountUp = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / (duration * 1000);

            if (progress < 1) {
                setCount(Math.floor(end * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}</span>;
};
interface BusinessAdvantage {
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon_name: string;
}

const DEFAULT_ADVANTAGES = [
    {
        title_id: 'Jaringan Distribusi Luas',
        title_en: 'Wide Distribution Network',
        description_id: 'Menjangkau seluruh wilayah Indonesia dengan dukungan pusat logistik modern.',
        description_en: 'Reaching all regions of Indonesia with modern logistics center support.',
        icon_name: 'TrendingUp'
    },
    {
        title_id: 'Kualitas Terjamin',
        title_en: 'Guaranteed Quality',
        description_id: 'Sertifikasi CDOB penuh untuk menjamin integritas produk farmasi.',
        description_en: 'Full GSDP certification to ensure pharmaceutical product integrity.',
        icon_name: 'ShieldCheck'
    },
    {
        title_id: 'Layanan Pelanggan 24/7',
        title_en: '24/7 Customer Service',
        description_id: 'Dukungan penuh untuk mitra bisnis dalam mengelola stok dan pengiriman.',
        description_en: 'Full support for business partners in managing stock and delivery.',
        icon_name: 'Users'
    }
];

const TARGET_MARKET_DETAILS = [
    {
        id: 'Farmasi',
        label: 'Farmasi',
        labelEn: 'Pharmacy',
        icon: 'Building2',
        range: [100, 199],
        bg: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
        description: 'Cakupan luas pada sektor kesehatan formal dan retail obat.',
        descriptionEn: 'Wide coverage in formal health sectors and medicine retail.',
        items: [
            { name: 'Government Hospital', icon: 'Hospital' },
            { name: 'Private Hospital', icon: 'Building' },
            { name: 'Puskesmas', icon: 'Ambulance' },
            { name: 'Clinics', icon: 'Stethoscope' },
            { name: 'Pharmacies', icon: 'Pill' },
            { name: 'Registered Drugstore', icon: 'ClipboardList' },
            { name: 'Medical Device Stores', icon: 'Activity' }
        ]
    },
    {
        id: 'Modern Trade',
        label: 'Modern Trade',
        labelEn: 'Modern Trade',
        icon: 'ShoppingBag',
        range: [200, 299],
        bg: 'https://images.unsplash.com/photo-1516594798245-443f1f738723?auto=format&fit=crop&q=80&w=1200',
        description: 'Fokus pada jaringan retail kesehatan dan kecantikan modern.',
        descriptionEn: 'Focus on modern health and beauty retail networks.',
        items: [
            { name: 'Watsons', icon: 'Store' },
            { name: 'Guardian', icon: 'Store' },
            { name: 'Century', icon: 'Store' },
            { name: 'Kimia Farma', icon: 'Store' },
            { name: 'Boston', icon: 'Store' },
            { name: 'Dan + Dan', icon: 'Store' }
        ]
    },
    {
        id: 'Modern Market',
        label: 'Modern Market',
        labelEn: 'Modern Market',
        icon: 'ShoppingCart',
        range: [300, 399],
        bg: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=1200',
        description: 'Distribusi ke jaringan supermarket dan minimarket nasional.',
        descriptionEn: 'Distribution to national supermarket and minimarket networks.',
        items: [
            { name: 'Transmart / Hypermart', icon: 'ShoppingBag' },
            { name: 'Giant / Hero', icon: 'ShoppingBag' },
            { name: 'Lottemart', icon: 'ShoppingBag' },
            { name: 'Farmers Market', icon: 'ShoppingBag' },
            { name: 'Indomaret', icon: 'Zap' },
            { name: 'Alfamart', icon: 'Zap' }
        ]
    },
    {
        id: 'Kios Kosmetik',
        label: 'Kios Kosmetik',
        labelEn: 'Cosmetic Kiosk',
        icon: 'Sparkles',
        range: [400, 499],
        bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
        description: 'Menjangkau pusat grosir dan kios kecantikan spesialis.',
        descriptionEn: 'Reaching wholesale centers and specialized beauty kiosks.',
        items: [
            { name: 'Cosmetic Wholesale', icon: 'Package' },
            { name: 'Beauty Salons', icon: 'Scissors' },
            { name: 'Specialist Retailers', icon: 'Gem' },
            { name: 'Candra Group', icon: 'Building' }
        ]
    },
    {
        id: 'Pasar Tradisional',
        label: 'Pasar Tradisional',
        labelEn: 'Traditional Market',
        icon: 'Warehouse',
        range: [500, 599],
        bg: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=1200',
        description: 'Menjamin ketersediaan produk di pasar rakyat seluruh Indonesia.',
        descriptionEn: 'Ensuring product availability in traditional markets across Indonesia.',
        items: [
            { name: 'Traditional Drugstores', icon: 'Home' },
            { name: 'Herbal Stores', icon: 'Leaf' },
            { name: 'Wholesalers', icon: 'Truck' },
            { name: 'Provision Stores', icon: 'Boxes' },
            { name: 'Household Stores', icon: 'Coffee' }
        ]
    }
];

const BusinessPage: React.FC = () => {
    const { language, t } = useLanguage();
    const location = useLocation();
    const [businessData, setBusinessData] = useState<BusinessLine | null>(null);
    const [advantages, setAdvantages] = useState<BusinessAdvantage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeTargetTab, setActiveTargetTab] = useState<string | null>('Farmasi');

    // Embla for Bottom Gallery
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

    // Status for Bottom Slider
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    // Keyboard listener for Escape key to close Lightbox
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setPrevBtnEnabled(emblaApi.canScrollPrev());
            setNextBtnEnabled(emblaApi.canScrollNext());
        };
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi]);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
    };

    const getSlugFromPath = (path: string) => {
        if (path.includes('pharmaceuticals')) return 'distribusi-farmasi';
        if (path.includes('consumer-goods')) return 'produk-konsumen';
        if (path.includes('medical-equipment')) return 'distribusi-alkes';
        if (path.includes('strategi-usaha')) return 'strategi-bisnis';
        if (path.includes('distribution-flow')) return 'alur-distribusi';
        if (path.includes('target-market')) return 'target-pasar';
        return '';
    };

    const getIcon = (name: string) => {
        const props = { className: "w-full h-full" };
        switch (name.toLowerCase()) {
            case 'globe': return <Globe {...props} />;
            case 'briefcase': return <Briefcase {...props} />;
            case 'shieldcheck': return <ShieldCheck {...props} />;
            case 'users': return <Users {...props} />;
            case 'award': return <ShieldCheck {...props} />;
            case 'trending': return <TrendingUp {...props} />;
            case 'server': return <Server {...props} />;
            case 'handshake': return <Handshake {...props} />;
            case 'building2': return <Building2 {...props} />;
            case 'hospital': return <Hospital {...props} />;
            case 'building': return <Building {...props} />;
            case 'ambulance': return <Ambulance {...props} />;
            case 'stethoscope': return <Stethoscope {...props} />;
            case 'pill': return <Pill {...props} />;
            case 'clipboardlist': return <ClipboardList {...props} />;
            case 'activity': return <Activity {...props} />;
            case 'shoppingbag': return <ShoppingBag {...props} />;
            case 'store': return <Store {...props} />;
            case 'shoppingcart': return <ShoppingCart {...props} />;
            case 'zap': return <Zap {...props} />;
            case 'sparkles': return <Sparkles {...props} />;
            case 'package': return <Package {...props} />;
            case 'scissors': return <Scissors {...props} />;
            case 'gem': return <Gem {...props} />;
            case 'warehouse': return <Warehouse {...props} />;
            case 'home': return <Home {...props} />;
            case 'leaf': return <Leaf {...props} />;
            case 'truck': return <Truck {...props} />;
            case 'boxes': return <Boxes {...props} />;
            case 'coffee': return <Coffee {...props} />;
            default: return <CheckCircle2 {...props} />;
        }
    };

    const DEFAULT_ADVANTAGES = [
        {
            title_id: 'Berpengalaman Lebih dari 54 Tahun',
            title_en: 'Over 54 Years of Experience',
            description_id: 'Pengalaman penting untuk menghadapi persaingan dan masalah yang timbul dalam usaha, serta mengantisipasi tantangan yang ada dalam perjalanan usaha.',
            description_en: 'Essential experience to face competition and issues arising in business, as well as anticipating challenges in the business journey.',
            icon_name: 'users'
        },
        {
            title_id: 'Cara Distribusi Obat yang Baik',
            title_en: 'Good Distribution Practice (CDOB)',
            description_id: 'Perseroan telah mengimplementasikan Cara Distribusi Obat yang Baik (CDOB) sejak tahun 2015, dan mendapatkan penghargaan dari Badan Pengawas Obat dan Makanan (BPOM) pada tahun 2017 dan telah memperoleh sertifikat untuk seluruh cabang pada tahun 2019.',
            description_en: 'The Company has implemented Good Distribution Practice (CDOB) since 2015, received an award from the National Agency of Drug and Food Control (BPOM) in 2017, and obtained certificates for all branches in 2019.',
            icon_name: 'award'
        },
        {
            title_id: 'Jaringan Distribusi yang Luas',
            title_en: 'Extensive Distribution Network',
            description_id: 'Perseroan memiliki 34 Cabang di seluruh Indonesia yang melayani cakupan nasional guna menjangkau 21.000 outlet untuk produk farmasi dan 14.000 outlet untuk produk konsumsi.',
            description_en: 'The Company has 34 Branches throughout Indonesia serving national coverage to reach 21,000 outlets for pharmaceutical products and 14,000 outlets for consumer products.',
            icon_name: 'trending'
        },
        {
            title_id: 'Memiliki Sistem Teknologi Informasi yang Handal',
            title_en: 'Reliable Information Technology System',
            description_id: 'Perseroan mengimplementasikan sistem Oracle sejak tahun 2017. Dengan sistem tersebut, Perseroan dapat menyediakan data online secara real time, cepat dan dapat diandalkan, sehingga menunjang kelancaran komunikasi dan aktivitas operasional.',
            description_en: 'The Company implemented the Oracle system since 2017. With this system, the Company can provide real-time, fast, and reliable online data, supporting smooth communication and operational activities.',
            icon_name: 'server'
        },
        {
            title_id: 'Memiliki Prinsipal dan Pelanggan yang Ternama',
            title_en: 'Reputable Principals and Customers',
            description_id: 'Perseroan saat ini memiliki kontrak dengan prinsipal-prinsipal ternama serta pelanggan-pelanggan yang terpercaya di bidang farmasi.',
            description_en: 'The Company currently holds contracts with reputable principals as well as trusted customers in the pharmaceutical field.',
            icon_name: 'handshake'
        }
    ];

    const getColor = (idx: number) => {
        const colors = [
            'from-blue-500 to-cyan-500',
            'from-cyan-500 to-teal-500',
            'from-teal-500 to-emerald-500',
            'from-blue-600 to-indigo-600',
            'from-indigo-600 to-violet-600'
        ];
        return colors[idx % colors.length];
    };

    useEffect(() => {
        const fetchBusinessLine = async () => {
            const slug = getSlugFromPath(location.pathname);
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('business_lines')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;

                if (data) {
                    // Fetch images
                    const { data: images } = await supabase
                        .from('business_images')
                        .select('image_url, sort_order')
                        .eq('business_line_id', data.id)
                        .order('sort_order', { ascending: true });

                    // Fetch stats
                    const { data: stats } = await supabase
                        .from('business_stats')
                        .select('*')
                        .eq('business_line_id', data.id)
                        .order('sort_order', { ascending: true });

                    // Fetch features
                    const { data: features } = await supabase
                        .from('business_features')
                        .select('*')
                        .eq('business_line_id', data.id)
                        .order('sort_order', { ascending: true });

                    // Fetch business advantages (if table exists)
                    // We handle the case where it might fail or return empty comfortably
                    const { data: advData } = await supabase
                        .from('business_advantages')
                        .select('*')
                        .eq('business_line_id', data.id)
                        .order('sort_order', { ascending: true });

                    setBusinessData({
                        ...data,
                        images: images?.map(img => img.image_url) || [],
                        rawImages: images || [],
                        stats: stats?.map(s => ({
                            label: language === 'id' ? s.label_id : s.label_en,
                            value: language === 'id' ? s.value_id : s.value_en
                        })) || [],
                        features: features?.map(f => language === 'id' ? f.feature_id : f.feature_en) || []
                    });

                    if (advData && advData.length > 0) {
                        setAdvantages(advData);
                    } else if (slug !== 'alur-distribusi' && slug !== 'target-pasar') {
                        setAdvantages(DEFAULT_ADVANTAGES);
                    } else {
                        setAdvantages([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching business line:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessLine();
        window.scrollTo(0, 0);
    }, [location.pathname, language]);

    const activeGalleryImages = React.useMemo(() => {
        if (!businessData) return [];
        // User requested to show ALL images for target market, not filtered by category
        if (location.pathname.includes('target-market')) return businessData.images;

        return businessData.images;
    }, [businessData, location.pathname]);


    // Features scroll logic
    const featuresRef = React.useRef<HTMLDivElement>(null);
    const scrollFeatures = (direction: 'left' | 'right') => {
        if (featuresRef.current) {
            const scrollAmount = 300;
            const currentScroll = featuresRef.current.scrollLeft;
            featuresRef.current.scrollTo({
                left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onNavigate={handleNavigate} activeSection="business" />
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
                <Footer onNavigate={handleNavigate} />
            </div>
        );
    }

    if (!businessData) {
        return (
            <div className="min-h-screen bg-white">
                <Header onNavigate={handleNavigate} activeSection="business" />
                <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
                    <h2 className="text-2xl font-black mb-2">Business Line Not Found</h2>
                    <p>The requested business information could not be loaded.</p>
                </div>
                <Footer onNavigate={handleNavigate} />
            </div>
        );
    }

    const isSpecialBusinessPage = (location.pathname.includes('pharmaceuticals') || location.pathname.includes('consumer-goods')) && !location.pathname.includes('strategi-usaha');
    const isTargetMarketOrFlow = location.pathname.includes('target-market') || location.pathname.includes('distribution-flow');



    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Header onNavigate={handleNavigate} activeSection="business" />

            <PageSlider
                pagePath={location.pathname}
                breadcrumbLabel={language === 'id' ? businessData.title_id : businessData.title_en}
            />

            <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className={`grid grid-cols-1 gap-12 ${isTargetMarketOrFlow ? 'lg:grid-cols-1' : 'lg:grid-cols-12'}`}>
                    {/* Main Content */}
                    <div className={(
                        isTargetMarketOrFlow
                            ? 'lg:col-span-1'
                            : 'lg:col-span-12'
                    ) + ' space-y-16'}>
                        <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-8 border border-cyan-100">
                                    <TrendingUp size={12} />
                                    Business Division
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black mb-10 text-slate-900 tracking-tighter leading-tight italic">
                                    {language === 'id' ? businessData.title_id : businessData.title_en}
                                </h2>

                                {/* Special Compliance/Intro Text */}
                                {(() => {
                                    const slug = businessData.slug;
                                    const specialTexts: Record<string, { id: string, en: string }> = {
                                        'distribusi-farmasi': {
                                            id: "Seluruh aktivitas distribusi farmasi dijalankan sesuai standar CDOB BPOM dan regulasi Kementerian Kesehatan.",
                                            en: "All pharmaceutical distribution activities are carried out in accordance with BPOM CDOB standards and Ministry of Health regulations."
                                        },
                                        'alur-distribusi': {
                                            id: "Didukung sistem distribusi yang memenuhi persyaratan regulator dan audit berkala.",
                                            en: "Supported by a distribution system that meets regulatory requirements and periodic audits."
                                        },
                                        'strategi-bisnis': {
                                            id: "Pertumbuhan bisnis dijalankan dengan mengedepankan kepatuhan regulasi dan tata kelola perusahaan yang baik.",
                                            en: "Business growth is executed by prioritizing regulatory compliance and good corporate governance."
                                        }
                                    };

                                    const text = specialTexts[slug];
                                    if (!text) return null;

                                    return (
                                        <div className="mb-10 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <p className="text-lg font-bold text-slate-700 italic leading-relaxed">
                                                "{language === 'id' ? text.id : text.en}"
                                            </p>
                                        </div>
                                    );
                                })()}

                                {location.pathname.includes('strategi-usaha') ? (
                                    <div className="space-y-12">
                                        {/* 2025 Targets High-Impact Cards */}
                                        {/* 2025 Targets High-Impact Cards with Live Counters */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                            {/* Decorative Background Blob for Life */}
                                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="bg-gradient-to-br from-slate-950 to-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group"
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.2, 1],
                                                        rotate: [0, 5, 0]
                                                    }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                                ></motion.div>
                                                <div className="relative z-10">
                                                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4 block">Target 2025</span>
                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        <span className="text-6xl font-black text-white italic tracking-tighter">
                                                            <CountUp end={17} />%
                                                        </span>
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            <TrendingUp size={28} className="text-cyan-400" />
                                                        </motion.div>
                                                    </div>
                                                    <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">{language === 'id' ? 'Pertumbuhan Penjualan' : 'Sales Growth'}</p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group text-white"
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [0.3, 0.5, 0.3]
                                                    }}
                                                    transition={{ duration: 5, repeat: Infinity }}
                                                    className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                                ></motion.div>
                                                <div className="relative z-10">
                                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-4 block">Target 2025</span>
                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        <span className="text-6xl font-black italic tracking-tighter">
                                                            <CountUp end={40} />%
                                                        </span>
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                        >
                                                            <TrendingUp size={28} />
                                                        </motion.div>
                                                    </div>
                                                    <p className="text-white/80 font-bold uppercase text-[11px] tracking-widest">{language === 'id' ? 'Kenaikan Laba Bersih' : 'Net Profit Increase'}</p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Performance Text with Modern Border */}
                                        <div className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border-l-8 border-cyan-500 shadow-inner relative">
                                            <div className="absolute top-6 right-8 text-cyan-100 font-black text-6xl select-none">"</div>
                                            <p className="text-slate-700 text-lg md:text-xl font-bold italic leading-relaxed relative z-10">
                                                {language === 'id'
                                                    ? 'PEVE menunjukkan kinerja positif dengan tren pertumbuhan penjualan dan laba bersih yang stabil, meskipun kondisi ekonomi belum sepenuhnya kondusif.'
                                                    : 'PEVE shows positive performance with stable sales and net profit growth trends, even though economic conditions are not yet fully conducive.'
                                                }
                                            </p>
                                        </div>

                                        {/* Key Success Factors Grid */}
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2 flex items-center gap-4">
                                                {language === 'id' ? 'Faktor Kunci Pertumbuhan' : 'Key Growth Factors'}
                                                <div className="h-[1px] bg-slate-200 flex-grow"></div>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { id: 'Needs', en: 'Essential Healthcare Needs', icon: Activity, color: 'text-rose-500 bg-rose-50 border-rose-100' },
                                                    { id: 'Portfolio', en: 'Strong Portfolio Mix', icon: Briefcase, color: 'text-blue-500 bg-blue-50 border-blue-100' },
                                                    { id: 'Brand', en: 'Own Brand Development', icon: Sparkles, color: 'text-amber-500 bg-amber-50 border-amber-100' },
                                                    { id: 'Efficiency', en: 'Supply Chain Efficiency', icon: Zap, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' }
                                                ].map((factor, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.8)' }}
                                                        className={`flex items-center gap-5 p-5 rounded-2xl bg-white border ${factor.color.split(' ').pop()} shadow-sm hover:shadow-md transition-all group cursor-default`}
                                                    >
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${factor.color.split(' ').slice(0, 2).join(' ')} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                                            <factor.icon size={24} />
                                                        </div>
                                                        <span className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight">
                                                            {language === 'id' ? (
                                                                idx === 0 ? 'Kebutuhan Esensial Healthcare' :
                                                                    idx === 1 ? 'Portofolio Kuat' :
                                                                        idx === 2 ? 'Pengembangan Merek Sendiri' :
                                                                            'Efisiensi Rantai Pasok'
                                                            ) : factor.en}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-lg max-w-none prose-p:text-slate-600 prose-p:leading-relaxed mb-12">
                                        <p className="whitespace-pre-wrap">{language === 'id' ? businessData.description_id : businessData.description_en}</p>
                                    </div>
                                )}

                                {/* Special for Distribution Flow: Show Diagram */}
                                {location.pathname.includes('distribution-flow') && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="mb-16 p-2 bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-inner cursor-zoom-in group/diagram"
                                        onClick={() => setSelectedImage('/images/distribution-flow.jpg')}
                                    >
                                        <div className="bg-white rounded-[2.2rem] overflow-hidden relative">
                                            <img
                                                src="/images/distribution-flow.jpg"
                                                alt="Distribution Flow Diagram"
                                                className="w-full h-auto transition-transform duration-700 group-hover/diagram:scale-[1.02]"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/0 group-hover/diagram:bg-slate-950/5 transition-colors flex items-center justify-center">
                                                <div className="px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl opacity-0 group-hover/diagram:opacity-100 transition-all translate-y-4 group-hover/diagram:translate-y-0 flex items-center gap-2">
                                                    <Search size={16} className="text-cyan-600" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{language === 'id' ? 'Klik untuk Memperbesar' : 'Click to Enlarge'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                {language === 'id' ? 'Visualisasi Alur Distribusi Terintegrasi' : 'Integrated Distribution Flow Visualization'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Features List */}
                                {!location.pathname.includes('target-market') && (
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        {businessData.features?.map((feature, idx) => {
                                            // Smart icon and color matching based on feature name
                                            const getFeatureIconAndColor = (featureName: string) => {
                                                const lowerFeature = featureName.toLowerCase();

                                                // Kosmetik / Beauty
                                                if (lowerFeature.includes('kosmetik') || lowerFeature.includes('cosmetic') || lowerFeature.includes('beauty')) {
                                                    return { icon: Sparkles, color: 'bg-pink-500 shadow-pink-200' };
                                                }
                                                // Personal Care
                                                if (lowerFeature.includes('personal care') || lowerFeature.includes('perawatan')) {
                                                    return { icon: Heart, color: 'bg-rose-500 shadow-rose-200' };
                                                }
                                                // Toiletries
                                                if (lowerFeature.includes('toiletries') || lowerFeature.includes('toilet')) {
                                                    return { icon: Smile, color: 'bg-indigo-500 shadow-indigo-200' };
                                                }
                                                // Ethical / Produk Resep
                                                if (lowerFeature.includes('ethical') || lowerFeature.includes('resep') || lowerFeature.includes('prescription')) {
                                                    return { icon: ShieldCheck, color: 'bg-cyan-500 shadow-cyan-200' };
                                                }
                                                // OTC
                                                if (lowerFeature.includes('otc') || lowerFeature.includes('over the counter')) {
                                                    return { icon: Pill, color: 'bg-blue-500 shadow-blue-200' };
                                                }
                                                // Alat Kesehatan / Medical Device
                                                if (lowerFeature.includes('alat kesehatan') || lowerFeature.includes('medical device')) {
                                                    return { icon: Stethoscope, color: 'bg-purple-500 shadow-purple-200' };
                                                }
                                                // Reagensia
                                                if (lowerFeature.includes('reagensia') || lowerFeature.includes('reagent')) {
                                                    return { icon: Activity, color: 'bg-emerald-500 shadow-emerald-200' };
                                                }
                                                // Food Supplement
                                                if (lowerFeature.includes('food supplement') || lowerFeature.includes('suplemen')) {
                                                    return { icon: Leaf, color: 'bg-orange-500 shadow-orange-200' };
                                                }

                                                // Default fallback
                                                return { icon: Package, color: 'bg-teal-500 shadow-teal-200' };
                                            };

                                            const { icon: IconComponent, color } = getFeatureIconAndColor(feature);

                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-cyan-200 hover:shadow-lg transition-all group/feat">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconComponent size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <p className="font-bold text-slate-700 text-xs text-center leading-snug">{feature}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Interactive Target Market Detail - Enhanced Tabs */}
                                {location.pathname.includes('target-market') && (
                                    <div className="mt-16 space-y-10">
                                        <div className="flex flex-col gap-6">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white">
                                                    <Users size={16} />
                                                </div>
                                                {language === 'id' ? 'Kategori Target Pasar' : 'Target Market Categories'}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 relative z-[101]">
                                                {TARGET_MARKET_DETAILS.map((tab) => (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTargetTab(tab.id)}
                                                        className={`relative overflow-hidden px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 active:scale-95 touch-manipulation cursor-pointer shadow-sm hover:shadow-md ${activeTargetTab === tab.id
                                                            ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-200 -translate-y-1'
                                                            : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                                            }`}
                                                    >
                                                        <div className={`w-4 h-4 ${activeTargetTab === tab.id ? 'text-white' : 'text-cyan-500'}`}>
                                                            {getIcon(tab.icon)}
                                                        </div>
                                                        {language === 'id' ? tab.label : tab.labelEn}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-12 mt-10">
                                            {/* Animated Header & Grid */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={activeTargetTab || 'empty'}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-12"
                                                >
                                                    {/* Category Header Card */}
                                                    <div className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl group bg-slate-900 border border-slate-800">
                                                        <img
                                                            src={TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.bg}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
                                                            alt={activeTargetTab || 'category background'}
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
                                                        <div className="relative h-full flex flex-col justify-center p-10 md:p-14 space-y-4">
                                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400 border border-cyan-400/30 w-fit">
                                                                {language === 'id' ? 'Visualisasi Pasar' : 'Market Visualization'}
                                                            </div>
                                                            <h4 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                                                {language === 'id' ? TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.label : TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.labelEn}
                                                            </h4>
                                                            <p className="text-white/70 max-w-md text-sm md:text-base leading-relaxed font-medium">
                                                                {language === 'id' ? TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.description : TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.descriptionEn}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Outlet Coverage Grid */}
                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">
                                                            {language === 'id' ? 'Cakupan Outlet & Instansi' : 'Outlet & Institution Coverage'}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                                            {TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.items.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all group/item text-center sm:text-left justify-center sm:justify-start"
                                                                >
                                                                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 group-hover/item:bg-cyan-500 group-hover/item:text-white transition-all duration-300">
                                                                        {getIcon(item.icon)}
                                                                    </div>
                                                                    <span className="font-bold text-slate-700 text-xs uppercase tracking-tight">{item.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>

                                            {/* Category Specific Slider - Stable Wrapper */}
                                            <TargetMarketSlider
                                                activeTab={activeTargetTab || ''}
                                                images={activeGalleryImages}
                                                onImageClick={setSelectedImage}
                                                label={TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.label || ''}
                                                labelEn={TARGET_MARKET_DETAILS.find(t => t.id === activeTargetTab)?.labelEn || ''}
                                                language={language as 'id' | 'en'}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats & Downloads Section - Below Main Content */}
                    {
                        isSpecialBusinessPage && (
                            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Metrics Card */}
                                <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl shadow-slate-900/20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                                        <div className="space-y-10 flex-1">
                                            <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Performance Metrics</h3>

                                            <div className="flex flex-wrap gap-12">
                                                {[
                                                    { value: '5000+', label: 'Produk Aktif' },
                                                    { value: '12000+', label: 'Outlet Terlayani' },
                                                    { value: '150+', label: 'Prinsipal Partner' }
                                                ].map((stat, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="text-4xl xl:text-5xl font-black text-cyan-400 tracking-tighter italic mb-2 group-hover:scale-105 transition-transform origin-left">
                                                            {stat.value}
                                                        </div>
                                                        <p className="text-xs font-black text-white/60 uppercase tracking-widest leading-loose">
                                                            {stat.label}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto pt-8 md:pt-0 md:pl-10 border-t md:border-t-0 md:border-l border-white/10">
                                            <button onClick={() => handleNavigate('contact')} className="w-full md:w-auto px-10 py-5 bg-white text-slate-900 hover:bg-cyan-400 hover:text-white transition-all rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 group whitespace-nowrap">
                                                Partner With Us
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Downloads & Resources Card */}
                                <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Downloads</h3>

                                            <div className="space-y-4">
                                                {[
                                                    { label: 'E-Catalogue 2025', size: '12.5 MB', type: 'PDF' },
                                                    { label: 'Company Profile', size: '8.2 MB', type: 'PDF' }
                                                ].map((file, i) => (
                                                    <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-100 transition-all group/file text-left">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm group-hover/file:scale-110 transition-transform">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm group-hover/file:text-cyan-700 transition-colors">{file.label}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{file.type} • {file.size}</div>
                                                        </div>
                                                        <div className="ml-auto opacity-0 group-hover/file:opacity-100 transition-opacity -translate-x-2 group-hover/file:translate-x-0">
                                                            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                                                    <ShieldCheck size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Quality Assurance</div>
                                                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">ISO 9001:2015 Certified</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >

                {/* Gallery Section - Full Width Placement */}
                {
                    !location.pathname.includes('target-market') && !location.pathname.includes('strategi-usaha') && businessData.images && businessData.images.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10 mt-24"
                        >
                            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic px-4 flex items-center gap-6">
                                <span className="w-16 h-1.5 bg-cyan-500 rounded-full"></span>
                                Operational <span className="text-cyan-500">Excellence</span>
                            </h3>

                            <div className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group bg-slate-50 border border-slate-100" ref={emblaRef}>
                                <div className="flex touch-pan-y">
                                    {activeGalleryImages.map((img, idx) => (
                                        <div className="flex-[0_0_100%] min-w-0 relative" key={idx}>
                                            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden cursor-zoom-in" onClick={() => setSelectedImage(img)}>
                                                <img
                                                    src={img}
                                                    alt={`Business Operation ${idx + 1}`}
                                                    className="w-full h-auto min-h-64 object-cover transition-transform duration-1000 hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200';
                                                        e.currentTarget.onerror = null;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Buttons - Enhanced */}
                                <button
                                    onClick={scrollPrev}
                                    className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 hover:border-white backdrop-blur-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 disabled:opacity-0 hover:scale-110 shadow-2xl"
                                    disabled={!prevBtnEnabled}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 hover:border-white backdrop-blur-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 disabled:opacity-0 hover:scale-110 shadow-2xl"
                                    disabled={!nextBtnEnabled}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>
                        </motion.div>
                    )
                }

                {/* Competitive Advantages Section - Conditional Rendering for Strategy Page */}
                {
                    advantages.length > 0 && (
                        <div className="space-y-16 mt-24 md:mt-32">
                            <div className="relative text-center max-w-3xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-50 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-600 mb-6 border border-cyan-100">
                                    <TrendingUp size={12} />
                                    {location.pathname.includes('strategi-usaha') ? (language === 'id' ? 'Arah Strategis' : 'Strategic Direction') : (language === 'id' ? 'Mengapa Memilih Kami' : 'Why Choose Us')}
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-8 italic">
                                    {location.pathname.includes('strategi-usaha') ? (
                                        <>
                                            {language === 'id' ? 'Strategi' : 'Business'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 leading-normal">{language === 'id' ? 'Usaha' : 'Strategy'}</span>
                                        </>
                                    ) : (
                                        <>
                                            {language === 'id' ? 'Keunggulan' : 'Competitive'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 leading-normal">{language === 'id' ? 'Kompetitif' : 'Advantages'}</span>
                                        </>
                                    )}
                                </h3>
                                <div className="w-48 h-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto"></div>
                            </div>

                            {location.pathname.includes('strategi-usaha') ? (
                                /* Clean & Professional Enterprise Infographic Flow */
                                <div className="relative py-32 px-4 overflow-visible">
                                    {/* Background Timeline Path */}
                                    <div className="absolute top-[50%] left-0 w-full h-[2px] bg-slate-200 hidden lg:block -translate-y-1/2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '100%' }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-60"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-24 lg:gap-x-12 relative z-10">
                                        {advantages.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: idx % 2 === 0 ? -50 : 50 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.15, duration: 0.8 }}
                                                viewport={{ once: true }}
                                                className={`relative flex flex-col items-center ${idx % 2 === 0 ? 'lg:flex-col' : 'lg:flex-col-reverse'}`}
                                            >
                                                {/* Content Box */}
                                                <div className={`text-center space-y-4 max-w-[280px] ${idx % 2 === 0 ? 'mb-16' : 'mt-16'}`}>
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black tracking-widest text-slate-500 uppercase">
                                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getColor(idx)} animate-pulse`}></span>
                                                        Step 0{idx + 1}
                                                    </div>
                                                    <h4 className="text-[17px] font-black text-slate-900 leading-tight uppercase tracking-tight">
                                                        {language === 'id' ? item.title_id : item.title_en}
                                                    </h4>
                                                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic px-2">
                                                        {language === 'id' ? item.description_id : item.description_en}
                                                    </p>
                                                </div>

                                                {/* Central Hub (The Icon) */}
                                                <div className="relative group">
                                                    {/* Glow Background */}
                                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColor(idx)} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`}></div>

                                                    {/* Hub Circle */}
                                                    <div className={`w-24 h-24 rounded-full bg-white border-2 border-slate-100 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.1)] flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                                                        <div className={`absolute inset-0.5 rounded-full border-[6px] border-slate-50/50`}></div>
                                                        <div className={`w-10 h-10 flex items-center justify-center relative z-10`}>
                                                            {/* Apply gradient color to the icon stroke using a filter or solid primary color */}
                                                            <div className="text-cyan-600">
                                                                {React.cloneElement(getIcon(item.icon_name) as React.ReactElement, { size: 36, strokeWidth: 1.5 })}
                                                            </div>
                                                        </div>

                                                        {/* Step Badge on Hub */}
                                                        <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center border-4 border-white shadow-md select-none`}>
                                                            0{idx + 1}
                                                        </div>

                                                        {/* Connecting Line to Path */}
                                                        <div className={`absolute ${idx % 2 === 0 ? 'top-full' : 'bottom-full'} left-1/2 w-[1px] h-20 -translate-x-1/2 bg-gradient-to-b from-slate-200 to-transparent hidden lg:block`}></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Standard Grid Layout for other pages */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {advantages.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="group flex flex-col p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-cyan-200 hover:-translate-y-3 transition-all duration-500 relative overflow-hidden"
                                        >
                                            {/* Decorative Background Blob */}
                                            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${getColor(idx)} rounded-bl-[100%] opacity-5 group-hover:scale-150 transition-transform duration-700`}></div>

                                            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${getColor(idx)} flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 text-white`}>
                                                {React.cloneElement(getIcon(item.icon_name) as React.ReactElement, { size: 40, strokeWidth: 1.5, className: "w-12 h-12" })}
                                            </div>

                                            <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-cyan-600 transition-colors leading-tight relative z-10">
                                                {language === 'id' ? item.title_id : item.title_en}
                                            </h4>

                                            <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                                                {language === 'id' ? item.description_id : item.description_en}
                                            </p>

                                            {/* Bottom Line */}
                                            <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${getColor(idx)} transition-all duration-700 group-hover:w-full`}></div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }
            </main>

            {/* Image Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close UI */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-end items-center z-[10001]">
                            <motion.button
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-rose-500 rounded-full shadow-2xl transition-all duration-300 active:scale-95"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-white transition-colors">
                                    {language === 'id' ? 'Tutup Gambar' : 'Close Image'}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-white/20 flex items-center justify-center text-slate-900 group-hover:text-white transition-all">
                                    <X size={18} />
                                </div>
                            </motion.button>
                        </div>

                        {/* Image Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: -10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-[95vw] h-[90vh] flex items-center justify-center select-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Enlarged visualization"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] cursor-default transition-all"
                            />
                        </motion.div>

                        {/* Background Close Hint */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[9px] font-black uppercase tracking-[0.4em] pointer-events-none">
                            {language === 'id' ? 'Klik di mana saja untuk menutup' : 'Click anywhere to close'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default BusinessPage;
