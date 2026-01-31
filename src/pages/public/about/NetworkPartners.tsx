import React, { useState, useEffect, useRef } from 'react';
import PageSlider from '../../../components/common/PageSlider';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Globe, MapPin, Building2, ExternalLink, ShieldCheck, Zap, ArrowRight, Layers, X, Phone } from 'lucide-react';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Branch {
    id: string;
    name: string;
    type: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    latitude: number;
    longitude: number;
}

interface Partner {
    id: string;
    name: string;
    partner_type: string;
    logo_url: string;
    website: string;
    description_id: string;
    description_en: string;
}

const PartnerCard: React.FC<{
    partner: Partner;
    index: number;
    language: string;
}> = ({ partner, index, language }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group h-full"
        >
            <div className="group relative bg-white rounded-[2.5rem] p-4 flex flex-col items-center text-center transition-all duration-700 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 border border-slate-100/80 overflow-hidden h-full">
                {/* Logo Box - Clean & Minimalist */}
                <div className="w-full aspect-[16/10] bg-slate-50/30 rounded-[2rem] flex items-center justify-center relative mb-6 overflow-hidden border border-slate-50 group/logo">
                    {partner.logo_url && !imgError ? (
                        <img
                            src={partner.logo_url}
                            alt={partner.name}
                            onError={() => setImgError(true)}
                            className="w-[85%] h-[85%] object-contain relative z-10 transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black text-xl shadow-md relative z-10">
                            {partner.name.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Content - Clean & Proportional */}
                <div className="px-4 pb-6 flex flex-col flex-grow items-center w-full">
                    <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3 uppercase italic tracking-tight leading-tight min-h-[2.5rem] flex items-center justify-center">
                        {partner.name}
                    </h3>

                    <p className="text-slate-400 font-medium text-[13px] leading-relaxed mb-6 line-clamp-3">
                        {language === 'id' ? partner.description_id : partner.description_en}
                    </p>

                    {partner.website && (
                        <button
                            onClick={() => window.open(partner.website, '_blank')}
                            className="mt-auto group/btn flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-primary transition-all duration-500"
                        >
                            DISCOVER MORE
                            <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Subtle Hover Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
};

const NetworkPartners: React.FC = () => {
    const { language, t } = useLanguage();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'branches' | 'partners'>('branches');
    const [activeRegion, setActiveRegion] = useState<number>(1);
    const [modalBranch, setModalBranch] = useState<Branch | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    const handleNavigate = (section: string) => {
        window.location.href = `/#${section}`;
    };

    const focusBranch = (branch: Branch) => {
        if (mapInstance.current) {
            mapInstance.current.setView([branch.latitude, branch.longitude], 12, {
                animate: true,
                duration: 1.5
            });
            // Auto-open the popup for this branch
            mapInstance.current.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    const latLng = layer.getLatLng();
                    if (latLng.lat === branch.latitude && latLng.lng === branch.longitude) {
                        layer.openPopup();
                    }
                }
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: branchData } = await supabase
                    .from('branches')
                    .select('*')
                    .eq('is_active', true)
                    .order('name', { ascending: true });

                const { data: partnerData } = await supabase
                    .from('partners')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                setBranches(branchData || []);
                setPartners(partnerData || []);
            } catch (error) {
                console.error('Error fetching network & partners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!loading && activeTab === 'branches' && mapRef.current && branches.length > 0 && !mapInstance.current) {
            // Initialize Leaflet Map
            mapInstance.current = L.map(mapRef.current, {
                center: [-2.5489, 118.0149],
                zoom: 5,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false
            });

            // Modern Voyager Tiles
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(mapInstance.current);

            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

            // Robust force resize
            const refresh = () => {
                if (mapInstance.current) mapInstance.current.invalidateSize();
            };
            setTimeout(refresh, 500);

            // Add Markers
            branches.forEach((branch) => {
                if (branch.latitude && branch.longitude) {
                    const customIcon = L.divIcon({
                        className: 'custom-node-marker',
                        html: `
                            <div class="relative group">
                                <div class="absolute -inset-4 bg-primary/20 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                                <div class="absolute -inset-2 bg-primary/10 rounded-full animate-ping"></div>
                                <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)] relative z-10"></div>
                                <div class="absolute top-1/2 left-6 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                                    <div class="text-[8px] font-black text-primary uppercase tracking-widest">${branch.city}</div>
                                    <div class="text-[10px] font-bold text-white uppercase">${branch.name}</div>
                                </div>
                            </div>
                        `,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    const marker = L.marker([branch.latitude, branch.longitude], { icon: customIcon })
                        .addTo(mapInstance.current!)
                        .bindPopup(`
                            <div class="p-4 min-w-[200px] bg-slate-900 text-white rounded-xl border border-white/10 font-sans">
                                <span class="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">Network Node</span>
                                <h4 class="text-sm font-black uppercase italic tracking-tighter mb-2 border-b border-white/5 pb-2">${branch.name}</h4>
                                <div class="space-y-2 text-[10px] text-white/60 font-medium">
                                    <div class="flex gap-2">
                                        <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0"></div>
                                        <p>${branch.address}</p>
                                    </div>
                                    ${branch.phone ? `
                                    <div class="flex items-center gap-2">
                                        <div class="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                                        <p class="text-white font-bold tracking-tight">${branch.phone}</p>
                                    </div>` : ''}
                                </div>
                                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.name + ' ' + branch.city)}', '_blank')" 
                                    class="mt-4 w-full py-2 bg-primary text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-colors">
                                    Get Directions
                                </button>
                            </div>
                        `, {
                            className: 'custom-leaflet-popup',
                            maxWidth: 300,
                            offset: [0, -10]
                        });

                    marker.on('click', () => {
                        focusBranch(branch);
                    });
                }
            });
        }
    }, [loading, activeTab, branches]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header onNavigate={handleNavigate} activeSection="about" />
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
                <Footer onNavigate={handleNavigate} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Header onNavigate={handleNavigate} activeSection="about" />

            <PageSlider
                pagePath="/about/network-partners"
                breadcrumbLabel={language === 'id' ? 'Jaringan & Mitra' : 'Network & Partners'}
            />

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10 -mt-24 md:-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-12">
                        {/* Tab Navigation - Premium Dashboard Style */}
                        <div className="flex justify-center mb-16 relative z-10">
                            <div className="bg-white p-2 rounded-[2.5rem] flex items-center gap-2 shadow-2xl shadow-slate-200 border border-slate-100">
                                <button
                                    onClick={() => setActiveTab('branches')}
                                    className={`px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 relative overflow-hidden group ${activeTab === 'branches' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin size={16} className={activeTab === 'branches' ? 'text-primary' : 'text-slate-300'} />
                                        {language === 'id' ? 'Distribution Network' : 'Network Map'}
                                    </div>
                                    {activeTab === 'branches' && (
                                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('partners')}
                                    className={`px-10 py-5 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 relative overflow-hidden group ${activeTab === 'partners' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe size={16} className={activeTab === 'partners' ? 'text-primary' : 'text-slate-300'} />
                                        {language === 'id' ? 'Prinsipals' : 'Global Principals'}
                                    </div>
                                    {activeTab === 'partners' && (
                                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'branches' ? (
                                <motion.div
                                    key="branches"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-16"
                                >
                                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden text-center max-w-5xl mx-auto mb-12">
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 tracking-tighter uppercase italic">
                                                Indonesia's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500 text-6xl">Logistics Backbone</span>
                                            </h2>
                                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
                                                Over 34 strategic operation hubs connecting major cities across the archipelago, ensuring medical supplies reach those who need them most.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unified Network Command Center */}
                                    <div className="bg-slate-950 rounded-[4rem] p-4 md:p-10 relative overflow-hidden shadow-4xl mb-24 border border-white/5 box-ring-glow">
                                        {/* Atmospheric Background */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px]"></div>
                                            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                                        </div>

                                        <div className="relative z-10 flex flex-col lg:flex-row gap-8 h-[700px]">
                                            {/* Left: Region Navigator */}
                                            <div className="w-full lg:w-[350px] bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 flex flex-col overflow-hidden">
                                                <div className="p-8 border-b border-white/10">
                                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Region Navigator</h3>
                                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Select Tactical Zone</p>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                                                    {[
                                                        { id: 1, title: 'REGION-1', cities: ['Banda Aceh', 'Batam', 'Medan', 'Pekanbaru', 'Padang', 'Jambi', 'Palembang', 'Lampung'] },
                                                        { id: 2, title: 'REGION-2', cities: ['Jakarta-1', 'Jakarta-2', 'Tangerang', 'Bogor', 'Bandung', 'Tasikmalaya', 'Cirebon', 'Pontianak'] },
                                                        { id: 3, title: 'REGION-3', cities: ['Semarang', 'Tegal', 'Purwokerto', 'Solo', 'Jogjakarta', 'Banjarmasin', 'Denpasar', 'Mataram', 'Kupang'] },
                                                        { id: 4, title: 'REGION-4', cities: ['Surabaya', 'Kediri', 'Malang', 'Jember', 'Samarinda', 'Makasar', 'Palu', 'Kendari', 'Manado'] }
                                                    ].map((region) => (
                                                        <div key={region.id} className={`rounded-3xl transition-all duration-500 overflow-hidden ${activeRegion === region.id ? 'bg-primary/20 border-primary/30 border' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}>
                                                            <button
                                                                onClick={() => setActiveRegion(region.id)}
                                                                className="w-full p-6 text-left flex items-center justify-between"
                                                            >
                                                                <span className={`text-sm font-black uppercase tracking-[0.2em] ${activeRegion === region.id ? 'text-primary' : 'text-white/60'}`}>{region.title}</span>
                                                                <ArrowRight size={14} className={`transition-transform duration-500 ${activeRegion === region.id ? 'rotate-90 text-primary' : 'text-white/20'}`} />
                                                            </button>

                                                            <AnimatePresence>
                                                                {activeRegion === region.id && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="px-6 pb-6 pt-2"
                                                                    >
                                                                        <ul className="space-y-3">
                                                                            {region.cities.map((city, idx) => {
                                                                                const searchTerms = city.split(/[\s-]+/);
                                                                                const cityAliases: { [key: string]: string[] } = {
                                                                                    'Jogjakarta': ['Yogyakarta'],
                                                                                    'Makasar': ['Makassar'],
                                                                                    'Jakarta-1': ['Jakarta'],
                                                                                    'Jakarta-2': ['Jakarta'],
                                                                                    'Solo': ['Surakarta'],
                                                                                    'Lampung': ['Bandar Lampung']
                                                                                };

                                                                                const branch = branches.find(b => {
                                                                                    const bName = b.name.toLowerCase();
                                                                                    const bCity = b.city.toLowerCase();
                                                                                    const bProv = b.province.toLowerCase();

                                                                                    // Check direct terms
                                                                                    const directMatch = searchTerms.some(term => {
                                                                                        const t = term.toLowerCase();
                                                                                        if (t.length < 3) return false;
                                                                                        return bName.includes(t) || bCity.includes(t) || bProv.includes(t);
                                                                                    });
                                                                                    if (directMatch) return true;

                                                                                    // Check aliases
                                                                                    const aliases = cityAliases[city] || [];
                                                                                    return aliases.some(alias => {
                                                                                        const a = alias.toLowerCase();
                                                                                        return bName.includes(a) || bCity.includes(a) || bProv.includes(a);
                                                                                    });
                                                                                });

                                                                                return (
                                                                                    <li key={idx} className="flex items-center gap-3">
                                                                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${branch ? 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/5'}`}></div>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                if (branch) {
                                                                                                    focusBranch(branch);
                                                                                                }
                                                                                            }}
                                                                                            className={`text-[11px] font-bold uppercase tracking-wider text-left transition-all duration-300 ${branch ? 'text-white/90 hover:text-primary' : 'text-white/10 cursor-default'}`}
                                                                                        >
                                                                                            {city}
                                                                                        </button>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right: Real Leaflet Map (Free Replacement) */}
                                            <div className="flex-1 bg-slate-900 rounded-[3rem] border border-white/5 relative overflow-hidden group/map">
                                                <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

                                                {/* Map Overlay Info */}
                                                <div className="absolute top-8 right-8 text-right pointer-events-none z-10">
                                                    <div className="text-[40px] font-black text-white/5 italic leading-none tracking-tighter uppercase">Integrated Network</div>
                                                    <div className="text-primary/40 font-black uppercase tracking-[0.5em] text-[10px] mt-2">Tactical Command Visualization v3.0</div>
                                                </div>

                                                <div className="absolute bottom-10 left-10 flex items-center gap-6 z-10">
                                                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Active Link Established</span>
                                                    </div>
                                                </div>

                                                <style>{`
                                                    .custom-tooltip {
                                                        background: transparent !important;
                                                        border: none !important;
                                                        box-shadow: none !important;
                                                    }
                                                    .custom-tooltip:before {
                                                        display: none !important;
                                                    }
                                                    .leaflet-container {
                                                        background: #0f172a !important;
                                                    }
                                                `}</style>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="partners"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="space-y-16"
                                >
                                    <div className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-900/40 text-white relative overflow-hidden text-center max-w-5xl mx-auto">
                                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase italic">
                                                Strategic <span className="text-cyan-400 text-6xl">Global Alliances</span>
                                            </h2>
                                            <p className="text-white/60 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
                                                We bridge the gap between world-leading clinical innovators and the Indonesian market through resilient partnerships built on trust and efficiency.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                                        {partners.map((partner, index) => (
                                            <PartnerCard
                                                key={partner.id}
                                                partner={partner}
                                                index={index}
                                                language={language}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Network Stats / Capabilities */}
                        <div className="mt-24 grid md:grid-cols-3 gap-10">
                            {[
                                { icon: <Layers size={32} />, label_id: 'Gudang Modern', label_en: 'Modern Warehousing', value: '45,000 m²', color: 'text-primary' },
                                { icon: <Zap size={32} />, label_id: 'Distribusi Cepat', label_en: 'Last-Mile Delivery', value: '24/7 Ops', color: 'text-cyan-500' },
                                { icon: <ShieldCheck size={32} />, label_id: 'Rantai Dingin', label_en: 'Cold Chain Ready', value: '100% Secure', color: 'text-emerald-500' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-4 group"
                                >
                                    <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center ${stat.color} mx-auto group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.value}</div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        {language === 'id' ? stat.label_id : stat.label_en}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Branch Modal - Map Viewer */}
            <AnimatePresence>
                {modalBranch && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalBranch(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-4xl bg-white rounded-[4rem] overflow-hidden shadow-4xl flex flex-col md:flex-row border border-white/20"
                        >
                            <button
                                onClick={() => setModalBranch(null)}
                                className="absolute top-8 right-8 z-30 w-14 h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-950/20"
                            >
                                <X size={28} />
                            </button>

                            <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-slate-100">
                                <iframe
                                    width="100%" height="100%" frameBorder="0"
                                    src={`https://maps.google.com/maps?q=${modalBranch.latitude},${modalBranch.longitude}&z=15&output=embed`}
                                    title={modalBranch.name}
                                ></iframe>
                            </div>

                            <div className="p-10 md:p-14 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Official Network Location</span>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                                            {modalBranch.name}
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <MapPin className="text-primary shrink-0" size={24} />
                                            <p className="text-slate-500 font-medium leading-relaxed">{modalBranch.address}</p>
                                        </div>
                                        {modalBranch.phone && (
                                            <div className="flex gap-4">
                                                <Phone className="text-primary shrink-0" size={24} />
                                                <p className="text-slate-700 font-black tracking-tight">{modalBranch.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(modalBranch.name + ' ' + modalBranch.city)}`, '_blank')}
                                    className="mt-12 w-full py-6 wow-button-gradient text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl shadow-2xl flex items-center justify-center gap-4 group/btn"
                                >
                                    Get Directions
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer onNavigate={handleNavigate} />
        </div>
    );
};

export default NetworkPartners;
