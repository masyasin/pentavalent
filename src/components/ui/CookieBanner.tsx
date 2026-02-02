import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const CookieBanner: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
    <div className="fixed bottom-6 right-6 z-[1000] w-[calc(100%-3rem)] max-w-md opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDelay: '1s' }}>
      <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="p-8 relative z-10">
          {!showPreferences ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tighter">Cookie Privacy</h3>
                  <p className="text-slate-400 text-[11px] font-bold leading-relaxed">
                    {t('cookie.message')}{' '}
                    <button
                      onClick={() => navigate('/privacy-policy')}
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                    >
                      {t('footer.privacy')}
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex-1 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                >
                  {t('cookie.manage')}
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-2 px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-xl shadow-cyan-900/20 transition-all active:scale-95"
                >
                  {t('cookie.accept')}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tighter">{t('cookie.pref.title')}</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{t('cookie.pref.subtitle')}</p>
                </div>
                <button onClick={() => setShowPreferences(false)} className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'necessary', title: t('cookie.pref.necessary'), required: true },
                  { id: 'analytics', title: t('cookie.pref.analytics'), required: false },
                  { id: 'marketing', title: t('cookie.pref.marketing'), required: false },
                ].map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => !pref.required && setPreferences({ ...preferences, [pref.id]: !preferences[pref.id as keyof typeof preferences] })}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${preferences[pref.id as keyof typeof preferences]
                      ? 'bg-cyan-500/10 border-cyan-500/20'
                      : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${preferences[pref.id as keyof typeof preferences] ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={pref.required ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      </div>
                      <span className="font-black text-white text-[10px] uppercase tracking-widest">{pref.title}</span>
                    </div>
                    <div className={`w-8 h-5 rounded-full relative transition-colors ${preferences[pref.id as keyof typeof preferences] ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${preferences[pref.id as keyof typeof preferences] ? 'left-4' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSavePreferences}
                className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-white bg-slate-800 hover:bg-cyan-600 rounded-xl transition-all shadow-2xl active:scale-95"
              >
                {t('cookie.save')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
