import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Clock, Building2, Users, TrendingUp, Award, Globe, Shield, MapPin, Pill, ShoppingBag } from 'lucide-react';

interface StatItem {
    value: string;
    label_id: string;
    label_en: string;
    icon: string;
}

const SnapshotSection: React.FC = () => {
    const { language } = useLanguage();
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('company_stats')
                .single();

            if (data?.company_stats) {
                setStats(data.company_stats as any);
            } else {
                // Fallback defaults
                setStats([
                    { value: '34', label_id: 'Cabang Nasional', label_en: 'National Branches', icon: 'MapPin' },
                    { value: '21.000+', label_id: 'Outlet Farmasi', label_en: 'Pharma Outlets', icon: 'Pill' },
                    { value: '14.000+', label_id: 'Outlet Konsumsi', label_en: 'Consumer Outlets', icon: 'ShoppingBag' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        const props = { size: 30, strokeWidth: 2 };
        switch (iconName) {
            case 'Clock': return { icon: <Clock {...props} />, color: 'bg-amber-100 text-amber-600' };
            case 'Building2': return { icon: <Building2 {...props} />, color: 'bg-blue-100 text-blue-600' };
            case 'Users': return { icon: <Users {...props} />, color: 'bg-rose-100 text-rose-600' };
            case 'TrendingUp': return { icon: <TrendingUp {...props} />, color: 'bg-indigo-100 text-indigo-600' };
            case 'Award': return { icon: <Award {...props} />, color: 'bg-purple-100 text-purple-600' };
            case 'Globe': return { icon: <Globe {...props} />, color: 'bg-cyan-100 text-cyan-600' };
            case 'Shield': return { icon: <Shield {...props} />, color: 'bg-indigo-100 text-indigo-600' };
            case 'MapPin': return { icon: <MapPin {...props} />, color: 'bg-cyan-100 text-cyan-600' };
            case 'Pill': return { icon: <Pill {...props} />, color: 'bg-blue-100 text-blue-600' };
            case 'ShoppingBag': return { icon: <ShoppingBag {...props} />, color: 'bg-emerald-100 text-emerald-600' };
            default: return { icon: <Clock {...props} />, color: 'bg-slate-100 text-slate-600' };
        }
    };

    return (
        <section className="relative z-30 -mt-10 md:-mt-20 px-6 max-md:-mt-6 max-md:px-4 max-md:overflow-x-hidden">
            <div className="max-w-[1700px] mx-auto">
                <div className={`grid grid-cols-2 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 md:gap-8 max-md:grid-cols-1 max-md:gap-4`}>
                    {stats.map((stat, i) => {
                        const iconData = getIcon(stat.icon);
                        return (
                            <div
                                key={i}
                                className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-2xl md:rounded-[3rem] shadow-2xl border border-white/50 group hover:-translate-y-2 transition-all duration-500 max-md:p-6 max-md:rounded-2xl max-md:w-full max-md:min-h-auto"
                            >
                                <div className="flex flex-col items-center text-center max-md:flex-row max-md:text-left max-md:gap-4">
                                    <div className={`w-16 h-16 ${iconData.color} rounded-2xl flex items-center justify-center transition-all duration-500 mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 max-md:w-12 max-md:h-12 max-md:rounded-xl max-md:mb-0 max-md:shrink-0`}>
                                        <div className="max-md:scale-75">
                                            {iconData.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2 tracking-tighter max-md:text-2xl max-md:mb-0">
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] max-md:text-[8px] max-md:tracking-widest">
                                            {language === 'id' ? stat.label_id : stat.label_en}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SnapshotSection;
