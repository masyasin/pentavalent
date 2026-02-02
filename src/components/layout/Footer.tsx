import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, MapPin, Globe, ShieldCheck, Users, Eye, ArrowUpRight, Phone, Clock, Shield, Linkedin, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [footerMenus, setFooterMenus] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      // Fetch menus
      const { data: menuData, error: menuError } = await supabase
        .from('nav_menus')
        .select('*')
        .eq('is_active', true)
        .eq('location', 'footer')
        .order('sort_order', { ascending: true });

      if (menuError) throw menuError;
      setFooterMenus(menuData || []);

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (settingsError) throw settingsError;
      setSettings(settingsData);

      if (settingsData?.social_links) {
        setSocialLinks(settingsData.social_links);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const handleLinkClick = (path: string) => {
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + path);
      } else {
        onNavigate(path.substring(1));
      }
    } else if (path === '/' || path === '') {
      if (location.pathname === '/') {
        onNavigate('beranda');
      } else {
        navigate('/');
      }
    } else if (path.startsWith('/')) {
      navigate(path);
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    }
  };

  const corporateMenus = footerMenus.filter(m => !m.parent_id).slice(0, 4);
  const stakeholderMenus = footerMenus.filter(m => !m.parent_id).slice(4, 8);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Linkedin size={20} />;
      case 'instagram': return <Instagram size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'facebook': return <Facebook size={20} />;
      default: return <Globe size={20} />;
    }
  };

  const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);
    const [active, setActive] = useState<number>(0);

    useEffect(() => {
      const fetchAndIncrement = async () => {
        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single();

          if (data && !error) {
            const newCount = (data.visitor_count || 0) + 1;
            setCount(newCount);

            await supabase
              .from('site_settings')
              .update({ visitor_count: newCount })
              .eq('id', data.id);
          } else {
            setCount(0);
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const { count: todayCount, error: logsError } = await supabase
            .from('visitor_logs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

          if (!logsError && todayCount !== null) {
            setActive(todayCount);
          } else {
            setActive(0);
          }

          try {
            const userAgent = navigator.userAgent;
            const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

            let browser = "Unknown";
            if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
            else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
            else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
            else if (userAgent.indexOf("MSIE") > -1 || !!(document as any).documentMode) browser = "IE";

            let os = "Unknown";
            if (navigator.platform.indexOf("Win") != -1) os = "Windows";
            else if (navigator.platform.indexOf("Mac") != -1) os = "MacOS";
            else if (navigator.platform.indexOf("Linux") != -1) os = "Linux";
            else if (/Android/.test(userAgent)) os = "Android";
            else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";

            await supabase.from('visitor_logs').insert({
              ip_address: 'localhost',
              browser: browser,
              os: os,
              city: 'Local Development',
              country: 'Local',
              page_url: window.location.href,
              referrer: document.referrer,
              user_agent: userAgent,
              is_mobile: isMobile
            });
          } catch (geoErr) {
            console.warn('Analytics logging failed:', geoErr);
          }
        } catch (err) {
          console.error('Counter update error:', err);
        }
      };

      fetchAndIncrement();
    }, []);

    if (count === null) return null;

    return (
      <div className="flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-blue-900/20 w-full max-w-[200px]">
        {/* Institutional Visibility */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Active Sessions</p>
            <p className="text-xl font-black text-white leading-none tracking-tighter transition-colors uppercase italic">{active}</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10"></div>

        {/* Global Reach Audit */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Cumulative Reach</p>
            <p className="text-xl font-black text-white leading-none tracking-tighter transition-colors uppercase italic">
              {count.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="relative bg-foreground text-white overflow-hidden pt-16 pb-16 max-md:pt-10 max-md:pb-10 max-md:overflow-x-hidden">
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden max-md:hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-medical-deep via-foreground to-medical-deep"></div>
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-[700px] bg-gradient-to-t from-blue-600/20 via-purple-600/10 to-transparent blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-full items-end flex opacity-50 scale-110 origin-bottom mix-blend-luminosity">
          <svg className="w-full h-[250px] text-slate-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,320 L0,120 L80,120 L80,200 L160,200 L160,80 L240,80 L240,240 L320,240 L320,160 L400,160 L400,280 L480,280 L480,100 L560,100 L560,220 L640,220 L640,140 L720,140 L720,260 L800,260 L800,60 L880,60 L880,180 L960,180 L960,100 L1040,100 L1040,220 L1120,220 L1120,140 L1200,140 L1200,40 L1280,40 L1280,200 L1360,200 L1360,320 Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full items-end flex opacity-80 mix-blend-normal">
          <svg className="w-full h-[200px] text-slate-800" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,320 L0,160 L50,160 L50,140 L100,140 L100,200 L180,200 L180,100 L240,100 L240,250 L300,250 L300,120 L380,120 L380,220 L440,220 L440,180 L500,180 L500,280 L580,280 L580,80 L640,80 L640,190 L700,190 L700,150 L760,150 L760,240 L820,240 L820,110 L900,110 L900,200 L960,200 L960,130 L1020,130 L1020,260 L1080,260 L1080,90 L1140,90 L1140,170 L1200,170 L1200,230 L1280,230 L1280,140 L1350,140 L1350,320 Z"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden opacity-30">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-10 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#020617] to-transparent opacity-80"></div>
        <div className="absolute bottom-[-50px] left-1/4 w-[800px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-50px] right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-20 max-md:mb-10 max-md:px-4">
        {/* Closing CTA Banner */}
        <div className="relative p-10 md:p-16 rounded-[3rem] overflow-hidden border border-white/10 group max-md:p-8 max-md:rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-slate-900/50 to-cyan-900/50 backdrop-blur-3xl transition-all duration-700 group-hover:scale-105"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 max-md:gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tighter mb-4 italic max-md:text-xl max-md:mb-3">
                {language === 'id'
                  ? 'Mendukung Rantai Distribusi Kesehatan Indonesia'
                  : 'Supporting Indonesia\'s Healthcare Distribution Chain'}
              </h3>
              <p className="text-blue-100/60 mb-6 text-lg font-medium max-md:text-sm max-md:mb-4">
                {language === 'id'
                  ? 'PT Penta Valent Tbk berkomitmen untuk terus berkontribusi dalam memastikan ketersediaan produk farmasi, medis, dan kesehatan secara merata dan berkelanjutan di Indonesia.'
                  : 'PT Penta Valent Tbk is committed to continuing to contribute to ensuring the availability of pharmaceutical, medical, and health products equally and sustainably in Indonesia.'}
              </p>
              <div className="h-1 w-20 bg-accent rounded-full mb-4 mx-auto md:mx-0 max-md:w-12 max-md:mb-2"></div>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-full hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl max-md:w-full max-md:min-h-[44px] max-md:py-4 max-md:text-[10px]"
            >
              {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 max-md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-0 pb-16 border-b border-white/5 max-md:gap-10 max-md:pb-10">
          {/* Column 1: Logo, Social, Counter */}
          <div className="space-y-8 flex flex-col items-start max-md:space-y-6 max-md:items-center max-md:text-center">
            <div className="relative group hover:scale-105 transition-transform duration-300">
              <img src={settings?.logo_url || "/logo-penta-valent.png"} alt={settings?.company_name || "Penta Valent"} className="h-16 w-auto brightness-0 invert max-md:h-12" />
            </div>

            <div className="space-y-6 w-full flex flex-col items-start max-md:items-center max-md:space-y-4">
              <div className="flex items-center gap-3 justify-start max-md:justify-center">
                {socialLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:wow-button-gradient hover:border-transparent hover:-translate-y-1 touch-active active:scale-[0.95] transition-all duration-300 max-md:w-11 max-md:h-11"
                    aria-label={item.platform}
                  >
                    {getSocialIcon(item.platform)}
                  </a>
                ))}
              </div>

              <div className="pt-2 w-full flex justify-start max-md:justify-center">
                <VisitorCounter />
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="pt-2 max-md:pt-0">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3 max-md:mb-4 max-md:justify-center"><span className="w-1 h-4 bg-orange-500 rounded-full"></span>{t('footer.column.contact')}</h4>
            <div className="space-y-6 pt-2 max-md:space-y-4 max-md:pt-0">
              <a href={`tel:${settings?.contact_phone || '+622158061XX'}`} className="flex items-start gap-4 group/link touch-active p-2 rounded-xl transition-all max-md:p-1 max-md:justify-center">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover/link:bg-accent group-hover/link:text-white transition-all max-md:shrink-0 max-md:w-9 max-md:h-9">
                  <Phone size={20} className="max-md:w-5 max-md:h-5" />
                </div>
                <div className="max-md:text-left">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">{t('footer.contact.ho')}</span>
                  <span className="text-white font-bold group-hover/link:text-accent transition-colors max-md:text-sm">{settings?.contact_phone || '+62 21 580 61XX'}</span>
                </div>
              </a>
              <a href={`mailto:${settings?.contact_email || 'info@pentavalent.co.id'}`} className="flex items-start gap-4 group/link touch-active p-2 rounded-xl transition-all max-md:p-1 max-md:justify-center">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover/link:bg-accent group-hover/link:text-white transition-all max-md:shrink-0 max-md:w-9 max-md:h-9">
                  <Mail size={20} className="max-md:w-5 max-md:h-5" />
                </div>
                <div className="max-md:text-left">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">{t('footer.contact.digital')}</span>
                  <span className="text-white font-bold group-hover/link:text-accent transition-colors max-md:text-sm">{settings?.contact_email || 'info@pentavalent.co.id'}</span>
                </div>
              </a>
              <div className="flex items-start gap-4 group/link p-2 max-md:p-1 max-md:justify-center">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-accent max-md:shrink-0 max-md:w-9 max-md:h-9">
                  <MapPin size={20} className="max-md:w-5 max-md:h-5" />
                </div>
                <div className="max-md:text-left">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-1">{t('footer.contact.hq')}</span>
                  <span className="text-white/80 text-xs font-semibold max-md:text-[11px]">{settings?.address || 'Tanah Abang III No. 12, Jakarta'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Corporate Menu */}
          <div className="pt-2 lg:pl-8 max-md:pt-0">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3 max-md:mb-4 max-md:justify-center"><span className="w-1 h-4 bg-blue-500 rounded-full"></span>{t('footer.column.corporate')}</h4>
            <ul className="space-y-4 pl-4 border-l border-white/5 max-md:pl-0 max-md:border-l-0 max-md:flex max-md:flex-col max-md:items-center max-md:space-y-3">
              {corporateMenus.map((link) => (
                <li key={link.id} className="max-md:w-full max-md:text-center"><button onClick={() => handleLinkClick(link.path)} className="text-slate-300 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 transition-all transition-transform duration-300 flex items-center gap-2 group text-left max-md:w-full max-md:justify-center max-md:min-h-[44px]"><span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 wow-text-primary max-md:hidden">→</span>{language === 'id' ? link.label_id : link.label_en}</button></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stakeholders Menu */}
          <div className="pt-2 max-md:pt-0">
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3 max-md:mb-4 max-md:justify-center"><span className="w-1 h-4 bg-cyan-500 rounded-full"></span>{t('footer.column.stakeholders')}</h4>
            <ul className="space-y-4 pl-4 border-l border-white/5 max-md:pl-0 max-md:border-l-0 max-md:flex max-md:flex-col max-md:items-center max-md:space-y-3">
              {stakeholderMenus.map((link) => (
                <li key={link.id} className="max-md:w-full max-md:text-center"><button onClick={() => handleLinkClick(link.path)} className="text-slate-300 text-xs font-bold uppercase tracking-wide hover:text-white hover:translate-x-1 transition-all transition-transform duration-300 flex items-center gap-2 group text-left max-md:w-full max-md:justify-center max-md:min-h-[44px]"><span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 wow-text-primary max-md:hidden">→</span>{language === 'id' ? link.label_id : link.label_en}</button></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 mt-4 max-md:pt-6 max-md:gap-4">
          <div className="flex items-center gap-6 max-md:text-center">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest max-md:text-[10px]">
              © {new Date().getFullYear()} {settings?.company_name?.toUpperCase() || 'PT PENTA VALENT TBK'}. <span className="hidden sm:inline opacity-30 mx-2">|</span> <span className="block sm:inline text-slate-400 mt-1 sm:mt-0">All rights reserved.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center max-md:gap-4">
            <a href="/privacy-policy" className="group flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors max-md:text-[10px]">{t('footer.privacy')}</a>
            <a href="/code-of-conduct" className="group flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors max-md:text-[10px]">{t('footer.code_conduct')}</a>
          </div>
        </div>
      </div >
    </footer >
  );
};

export default Footer;
