import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const CookieBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('peve-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('peve-cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('peve-cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-4xl opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '1s' }}>
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative group">
        {/* Tactical Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="p-8 md:p-12 relative z-10">
          {!showPreferences ? (
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Privacy intelligence</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tighter mb-2">Cookie & Data Sovereignty</h3>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed">{t('cookie.message')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 lg:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                >
                  {t('cookie.manage')}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 lg:flex-none px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-cyan-600 hover:bg-cyan-500 rounded-2xl shadow-xl shadow-cyan-900/20 transition-all active:scale-95"
                >
                  {t('cookie.accept')}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Preference Terminal</h3>
                  <p className="text-slate-400 text-sm font-bold">Customize your digital interaction nodes</p>
                </div>
                <button onClick={() => setShowPreferences(false)} className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-10">
                {[
                  { id: 'necessary', title: 'Necessary', desc: 'Core system stability', required: true },
                  { id: 'analytics', title: 'Analytics', desc: 'Operational intelligence', required: false },
                  { id: 'marketing', title: 'Marketing', desc: 'Strategic delivery', required: false },
                ].map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => !pref.required && setPreferences({ ...preferences, [pref.id]: !preferences[pref.id as keyof typeof preferences] })}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer ${preferences[pref.id as keyof typeof preferences]
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${preferences[pref.id as keyof typeof preferences] ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={pref.required ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${preferences[pref.id as keyof typeof preferences] ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences[pref.id as keyof typeof preferences] ? 'left-5' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <h4 className="font-black text-white text-sm uppercase tracking-widest mb-1">{pref.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{pref.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                  onClick={handleSavePreferences}
                  className="px-12 py-5 text-[10px] font-black uppercase tracking-widest text-white bg-slate-800 hover:bg-cyan-600 rounded-2xl transition-all shadow-2xl active:scale-95"
                >
                  Deploy Configurations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
