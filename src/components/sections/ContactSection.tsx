import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Captcha State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [userCaptcha, setUserCaptcha] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
    setUserCaptcha('');
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(userCaptcha) !== captcha.a) {
      setSubmitError(language === 'id' ? 'Jawaban captcha salah' : 'Incorrect captcha answer');
      generateCaptcha();
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      generateCaptcha();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError(language === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      label: t('contact.sidebar.hq'),
      value: 'Tanah Abang III, Jakarta',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    {
      label: t('contact.sidebar.hotline'),
      value: '(021) 345-6789',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      )
    },
    {
      label: t('contact.sidebar.correspondence'),
      value: 'info@pentavalent.co.id',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      )
    },
    {
      label: t('contact.sidebar.operational'),
      value: '08:00 - 17:00 WIB',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-40"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-200/40 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] animate-float-slow"></div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="mb-24">
          <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl shadow-primary/5">
            {t('contact.tagline')}
          </span>
          <h2 className="text-4xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            {language === 'id' ? 'Hubungkan' : 'Connect'} <span className="text-cyan-500 italic">{language === 'id' ? 'Visi Anda' : 'Your Vision'}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Neural Communication Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-12 md:p-16 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tighter">{t('contact.cta.subtitle')}</h3>

                {submitSuccess && (
                  <div className="mb-10 p-8 bg-cyan-50 border border-cyan-100 rounded-3xl flex items-center gap-6 animate-fade-in">
                    <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <div className="text-cyan-900 font-black uppercase text-[10px] tracking-widest mb-1">{t('contact.success.title')}</div>
                      <div className="text-cyan-700 text-sm font-bold">{t('contact.success.msg')}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('contact.form.identity')}</label>
                    <input required type="text" placeholder={t('contact.form.name_placeholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('contact.form.corporate_email')}</label>
                    <input required type="email" placeholder={t('contact.form.email_placeholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('contact.form.phone_label')}</label>
                    <input type="tel" placeholder={t('contact.form.phone_placeholder')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('contact.form.consultation_type')}</label>
                    <div className="relative">
                      <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 appearance-none transition-all cursor-pointer">
                        <option value="">{t('contact.form.category_placeholder')}</option>
                        <option value="partnership">{t('contact.form.partnership')}</option>
                        <option value="investor">{t('contact.form.investor')}</option>
                        <option value="sales">{t('contact.form.sales')}</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t('contact.form.intelligence')}</label>
                    <textarea required rows={4} placeholder={t('contact.form.message_placeholder')} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 resize-none transition-all placeholder:text-slate-300"></textarea>
                  </div>

                  {/* Math Captcha */}
                  <div className="md:col-span-2 flex items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('contact.form.bot_protection')}</span>
                        <div className="flex items-center gap-3">
                          <span className="bg-white px-4 py-2 rounded-xl font-black text-lg tracking-widest text-primary border border-slate-100 shadow-sm">{captcha.q}</span>
                          <span className="text-slate-400 font-black">=</span>
                        </div>
                      </div>
                    </div>
                    <input
                      required
                      type="number"
                      placeholder="?"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                      className="w-24 px-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-black text-slate-900 transition-all text-center text-xl shadow-sm"
                    />
                  </div>

                  {submitError && (
                    <div className="md:col-span-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                      {submitError}
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="group/btn relative w-full overflow-hidden rounded-2xl bg-primary py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl transition-all hover:bg-primary/90 disabled:opacity-50"
                    >
                      <span className="relative z-10">{submitting ? t('contact.form.submitting') : t('contact.form.submit')}</span>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-accent transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Intelligence Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative h-80 bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl group">
              <div className="absolute inset-0 transition-all duration-1000 group-hover:scale-105">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253848.58042025325!2d106.48640691741731!3d-6.2129721969640155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7a7cddfa5db%3A0x4e855b5b65a13480!2sPT.%20Penta%20Valent%20Tbk!5e0!3m2!1sid!2sid!4v1769656976101!5m2!1sid!2sid"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="PT Penta Valent HQ"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-cyan-500 mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</h5>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <button onClick={() => window.open('https://wa.me/6281234567890', '_blank')} className="group relative w-full bg-gradient-to-br from-cyan-500 to-blue-600 p-10 rounded-[3rem] text-left overflow-hidden shadow-2xl">
              <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">{language === 'id' ? 'Aksi Instan' : 'Instant Action'}</span>
                </div>
                <h4 className="text-3xl font-black text-white mb-2 tracking-tighter">{t('contact.fast_response')}</h4>
                <p className="text-white/60 text-sm font-bold mb-8">{language === 'id' ? 'Terhubung dengan tim dukungan eksekutif kami.' : 'Connect with our executive support team.'}</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                  {t('contact.sidebar.whatsapp')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
