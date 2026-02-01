import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Building2, Truck, Globe } from 'lucide-react';

// Leaflet imports
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Branch {
  id: string;
  name: string;
  type: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

const NetworkSection: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('province');

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && mapRef.current && branches.length > 0 && !mapInstance.current) {
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

      // Add Markers
      branches.forEach((branch) => {
        if (branch.latitude && branch.longitude) {
          const customIcon = L.divIcon({
            className: 'custom-node-marker',
            html: `
                        <div class="relative group">
                            <div class="absolute -inset-2 bg-blue-400/20 rounded-full animate-ping"></div>
                            <div class="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(37,99,235,0.6)] relative z-10"></div>
                        </div>
                    `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          L.marker([branch.latitude, branch.longitude], { icon: customIcon })
            .addTo(mapInstance.current!)
            .bindPopup(`
                        <div class="p-3 min-w-[150px] font-sans">
                            <div class="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">${branch.type}</div>
                            <h4 class="text-xs font-black uppercase mb-2">${branch.city}</h4>
                            <p class="text-[9px] text-slate-500 leading-tight mb-2">${branch.address}</p>
                            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.name + ' ' + branch.city)}', '_blank')" 
                                class="w-full py-1.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded hover:bg-blue-600 transition-colors">
                                Directions
                            </button>
                        </div>
                    `, {
              className: 'custom-leaflet-popup',
              offset: [0, -5]
            });
        }
      });

      // Force resize
      setTimeout(() => {
        if (mapInstance.current) mapInstance.current.invalidateSize();
      }, 500);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading, branches]);

  const mainHubs = branches.filter(b => b.type === 'head_office');
  const depots = branches.filter(b => b.type === 'branch' || b.type === 'depo');

  return (
    <section id="network" className="py-24 md:py-32 bg-slate-50 relative overflow-hidden text-slate-900">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left: Content & Stats */}
          <div className="lg:w-[40%]">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[13px] font-black text-slate-500 uppercase tracking-widest">{language === 'id' ? 'Jaringan Logistik Nasional' : 'National Logistics Network'}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.05] uppercase">
              {language === 'id' ? 'Cakupan &' : 'National'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 italic pr-4">{language === 'id' ? 'Akses Seluruh Indonesia' : 'Coverage & Access'}</span>
            </h2>

            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
              {language === 'id'
                ? 'Didukung oleh infrastruktur modern yang menghubungkan pusat-pusat ekonomi utama dengan wilayah regional di seluruh nusantara.'
                : 'Supported by modern infrastructure connecting major economic centers with regional areas throughout the archipelago.'}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:scale-110">
                  <Building2 size={24} />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{mainHubs.length}</div>
                <div className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                  {language === 'id' ? 'Hub Utama (Tier 1)' : 'Main Strategic Hubs'}
                </div>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mb-4 transition-transform group-hover:scale-110">
                  <Truck size={24} />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{depots.length}</div>
                <div className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                  {language === 'id' ? 'Cabang & Depo' : 'Regional Branches'}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/about/network-partners')}
              className="group/btn inline-flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.3em] text-slate-900 hover:text-blue-600 transition-all border border-slate-200 px-8 py-4 rounded-2xl hover:bg-white"
            >
              {language === 'id' ? 'Lihat Seluruh Jaringan' : 'View Full Network'}
              <Globe size={16} className="group-hover/btn:rotate-180 transition-transform duration-1000" />
            </button>
          </div>

          {/* Right: Interactive Live Map */}
          <div className="lg:w-[60%] relative">
            <div className="relative h-[400px] md:h-[600px] bg-white rounded-[3rem] border border-white shadow-2xl overflow-hidden group">
              {/* Visual Loading State */}
              {loading && (
                <div className="absolute inset-0 z-20 bg-slate-50 flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Actual Map Container */}
              <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />

              {/* Map Floating UI Overlay */}
              <div className="absolute bottom-8 right-8 z-20 pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Interactive Grid</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
            background: white;
            color: #0f172a;
            border-radius: 1.5rem;
            padding: 0;
            overflow: hidden;
            border: 1px solid #f1f5f9;
        }
        .custom-leaflet-popup .leaflet-popup-content {
            margin: 0;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
            background: white;
        }
        .leaflet-container {
            font-family: inherit;
        }
      `}</style>
    </section>
  );
};

export default NetworkSection;
