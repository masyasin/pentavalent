import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description_id: string;
  description_en: string;
  requirements_id: string;
  requirements_en: string;
  deadline: string;
}

const CareerSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Captcha State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [userCaptcha, setUserCaptcha] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
    setUserCaptcha('');
  };

  useEffect(() => {
    fetchCareers();
    generateCaptcha();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCareer) return;

    if (parseInt(userCaptcha) !== captcha.a) {
      toast.error(language === 'id' ? 'Jawaban captcha salah' : 'Incorrect captcha answer');
      generateCaptcha();
      return;
    }

    setSubmitting(true);
    try {
      const isGeneral = selectedCareer.id === 'GENERAL';
      const { error } = await supabase
        .from('job_applications')
        .insert({
          career_id: isGeneral ? null : selectedCareer.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.coverLetter,
        });

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', coverLetter: '' });
      generateCaptcha();
      setTimeout(() => {
        setShowApplicationForm(false);
        setSubmitSuccess(false);
        setSelectedCareer(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(language === 'id' ? 'Gagal mengirim lamaran' : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeneralApply = () => {
    setSelectedCareer({
      id: 'GENERAL',
      title: t('career.form.general_app'),
      department: 'General',
      location: 'Indonesia',
      employment_type: 'Full-time',
      description_id: 'Kirimkan CV anda untuk pertimbangan posisi di masa mendatang.',
      description_en: 'Submit your CV for future position consideration.',
      requirements_id: 'Kualifikasi relevan dengan industri kesehatan.',
      requirements_en: 'Qualifications relevant to the healthcare industry.',
      deadline: ''
    });
    setShowApplicationForm(true);
  };

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCareers = careers.filter(career => {
    if (selectedCategory === 'All') return true;
    const dept = career.department?.toLowerCase() || '';
    const cat = selectedCategory.toLowerCase();

    if (cat === 'operation' && (dept === 'operation' || dept === 'operations')) return true;
    if (cat === 'commercial' && (dept === 'commercial' || dept === 'sales' || dept === 'marketing')) return true;
    if (cat === 'support' && (dept === 'support' || dept === 'technology' || dept === 'finance' || dept === 'hr' || dept === 'human resources')) return true;

    return dept === cat;
  });

  const filterButtons = [
    { id: 'All', key: 'career.filter.all' },
    { id: 'Operation', key: 'career.filter.operation' },
    { id: 'Commercial', key: 'career.filter.commercial' },
    { id: 'Support', key: 'career.filter.support' },
  ];

  return (
    <>
      <section id="careers" className="py-20 md:py-40 bg-slate-50/30 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
            <div className="max-w-3xl">
              <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl shadow-primary/5">
                {t('career.future.title')}
              </span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1] py-2 mb-8 text-slate-900">
                {language === 'id' ? (
                  <>Bangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">Masa Depan</span> <br /> Kesehatan Bersama Kami</>
                ) : (
                  <>Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic px-6 inline-block">Future of Healthcare</span> <br /> With Us</>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-8 pb-4">
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-black text-slate-900 leading-none">500+</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Professionals</div>
              </div>
              <div className="w-px h-12 bg-slate-100"></div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-black wow-text-primary leading-none">34</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Hubs</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('career.filter.title')}</h4>
                <div className="flex flex-col gap-2">
                  {filterButtons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setSelectedCategory(btn.id)}
                      className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === btn.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      {t(btn.key)}
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === btn.id ? 'wow-button-gradient' : 'bg-slate-200 group-hover:bg-slate-400'} transition-colors`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-primary rounded-[2.5rem] text-white space-y-6">
                <h5 className="text-xl font-black tracking-tighter">{t('career.talent_scout.title')}</h5>
                <p className="text-white/80 text-xs font-bold leading-relaxed">
                  {t('career.talent_scout.desc')}
                </p>
                <button
                  onClick={handleGeneralApply}
                  className="w-full py-4 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all backdrop-blur-md border border-white/20"
                >
                  {t('career.talent_scout.button')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
                  ))}
                </div>
              ) : filteredCareers.length > 0 ? (
                filteredCareers.map((career) => (
                  <div
                    key={career.id}
                    className="group relative bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black wow-text-primary uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-lg">
                          {career.department}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {career.location}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 group-hover:wow-text-primary inline-block transition-colors tracking-tighter">
                        {career.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-bold line-clamp-1 max-w-xl">
                        {language === 'id' ? career.description_id : career.description_en}
                      </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                      <button onClick={() => setSelectedCareer(career)} className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">{t('career.detail')}</button>
                      <button onClick={() => { setSelectedCareer(career); setShowApplicationForm(true); }} className="px-8 py-4 wow-button-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">{t('career.apply_now')}</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{t('career.no_positions')}</h4>
                  <p className="text-slate-400 font-bold">{t('career.check_back')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal moved OUTSIDE of section to avoid stacking context issues */}
      {selectedCareer && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => { setSelectedCareer(null); setShowApplicationForm(false); }}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            {!showApplicationForm ? (
              <div className="p-6 sm:p-16 pt-10 sm:pt-20">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <div className="text-[10px] font-black wow-text-primary uppercase tracking-[0.4em] mb-4">{t('career.modal.position_details')}</div>
                    <h3 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">{selectedCareer.title}</h3>
                  </div>
                  <button onClick={() => setSelectedCareer(null)} className="p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><div className="w-2 h-2 wow-button-gradient rounded-full"></div>{t('career.modal.description')}</h4>
                    <p className="text-slate-500 font-bold leading-loose text-sm whitespace-pre-line">{language === 'id' ? selectedCareer.description_id : selectedCareer.description_en}</p>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>{t('career.modal.requirements')}</h4>
                    <p className="text-slate-500 font-bold leading-loose text-sm whitespace-pre-line">{language === 'id' ? selectedCareer.requirements_id : selectedCareer.requirements_en}</p>
                  </div>
                </div>
                <button onClick={() => setShowApplicationForm(true)} className="w-full py-6 wow-button-gradient text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl">{t('career.modal.continue')}</button>
              </div>
            ) : (
              <div className="p-6 sm:p-16 pt-10 sm:pt-20">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">{t('career.form.title')}</h3>
                    <p className="text-slate-400 text-sm font-bold">{t('career.form.subtitle')} {selectedCareer.title}</p>
                  </div>
                  <button onClick={() => { setSelectedCareer(null); setShowApplicationForm(false); }} className="p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                {submitSuccess ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 wow-button-gradient text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t('career.form.success_title')}</h4>
                    <p className="text-slate-400 font-bold">{t('career.form.success_desc')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                          {t('career.form.name')}
                        </label>
                        <input required type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all shadow-sm" />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          {t('career.form.email')}
                        </label>
                        <input required type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/30 outline-none font-bold text-slate-900 transition-all shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {t('career.form.phone')}
                      </label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500/30 outline-none font-bold text-slate-900 transition-all shadow-sm" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {t('career.form.cover_letter')}
                      </label>
                      <textarea rows={4} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-slate-500/5 focus:bg-white focus:border-slate-500/30 outline-none font-bold text-slate-900 transition-all resize-none shadow-sm"></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner group/captcha">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-cyan-500 shadow-sm group-hover/captcha:scale-110 transition-transform duration-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{t('career.form.verification')}</span>
                          <div className="flex items-center gap-3">
                            <span className="bg-white px-5 py-3 rounded-xl font-black text-xl tracking-tighter wow-text-primary border border-slate-200 shadow-sm min-w-[100px] text-center">{captcha.q}</span>
                            <span className="text-slate-300 font-black text-2xl">=</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full relative">
                        <input required type="number" placeholder="?" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} className="w-full px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary/30 outline-none font-black text-slate-900 transition-all text-center sm:text-left text-2xl shadow-sm h-[64px]" />
                      </div>
                    </div>

                    <button disabled={submitting} type="submit" className="w-full py-6 wow-button-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50 touch-active active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      {submitting ? t('career.form.submitting') : t('career.apply')}
                      {!submitting && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CareerSection;
