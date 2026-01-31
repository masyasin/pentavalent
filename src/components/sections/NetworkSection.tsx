import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

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
  const { t, language } = useLanguage();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [modalBranch, setModalBranch] = useState<Branch | null>(null);
  const [showAll, setShowAll] = useState(false);

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

  const provinces = ['all', ...new Set(branches.map(b => b.province))];
  const filteredBranches = selectedProvince === 'all'
    ? branches
    : branches.filter(b => b.province === selectedProvince);

  const branchCount = branches.filter(b => b.type === 'branch').length;
  const depoCount = branches.filter(b => b.type === 'depo').length;

  return (
    <section id="network" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden text-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header - Enterprise Mobile System */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white/60 mb-8 touch-active">
            <div className="relative flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{t('network.header.title')}</span>
            </div>
          </div>

          <h2 className="text-fluid-h1 py-2 mb-8 text-slate-900">
            {t('network.title.text')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block pr-4">{t('network.title.italic')}</span>
          </h2>
          <p className="text-fluid-body text-gray-500 max-w-3xl mx-auto">
            {t('network.header.desc')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20">
          {[
            { label: t('network.stats.main'), value: branchCount, icon: '🏢' },
            { label: t('network.stats.depots'), value: depoCount, icon: '📦' },
            { label: t('network.stats.provinces'), value: '34', icon: '🗺️' },
            { label: 'Reliability', value: '99.8%', icon: '⚡' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all touch-active">
              <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
              <div className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(showAll ? filteredBranches : filteredBranches.slice(0, 8)).map((branch) => (
            <div key={branch.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl hover:-translate-y-2 transition-all flex flex-col h-full touch-active">
              <div className="bg-slate-900 p-8 flex justify-between items-start">
                <div className="text-white">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{branch.type}</div>
                  <div className="text-xl font-black tracking-tight">{branch.city}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  {branch.type === 'branch' ? '🏢' : '📦'}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 mb-4">{branch.name}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{branch.address}</p>
                </div>
                <button
                  onClick={() => setModalBranch(branch)}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-900 group/btn hover:text-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 touch-active"
                >
                  {t('map.view_on_map')}
                  <svg className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBranches.length > 8 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black uppercase tracking-widest text-xs rounded-full hover:border-cyan-500 transition-all touch-active"
            >
              {showAll ? 'Sembunyikan' : `Lihat ${filteredBranches.length - 8} Lainnya`}
            </button>
          </div>
        )}
      </div>

      {/* Modal - Enterprise Interaction Layer */}
      {modalBranch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setModalBranch(null)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-96 bg-slate-100">
                <iframe
                  width="100%" height="100%" frameBorder="0"
                  src={`https://maps.google.com/maps?q=${modalBranch.latitude},${modalBranch.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1">{modalBranch.type}</div>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{modalBranch.name}</h3>
                    </div>
                    <button onClick={() => setModalBranch(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all touch-active">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <p className="text-slate-500 font-medium mb-8">{modalBranch.address}</p>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(modalBranch.name + ' ' + modalBranch.city)}`, '_blank')}
                  className="w-full py-5 wow-button-gradient text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl touch-active"
                >
                  Direction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NetworkSection;
